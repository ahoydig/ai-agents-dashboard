"use client";

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { AgentConfig } from "@/types/playground";
import { useDiscoveredAgents } from "./use-sessions";

export interface AgentWithConfig {
  identifier: string;
  config?: AgentConfig;
  turnCount: number;
  lastActivity?: string;
}

export function useAgents() {
  const { data: discoveredAgents = [], isLoading: isDiscovering } =
    useDiscoveredAgents();

  return useQuery<AgentWithConfig[]>({
    queryKey: ["agents-with-config", discoveredAgents],
    queryFn: async () => {
      // Fetch agent configs from database
      const { data: configs, error: configError } = await supabase
        .schema("centerfisio")
        .from("agent_configs")
        .select("*");

      if (configError && configError.code !== "42P01") {
        throw configError;
      }

      // Fetch turn counts and last activity for each agent
      const { data: agentStats, error: statsError } = await supabase
        .schema("centerfisio")
        .from("agent_turns")
        .select("agent_identifier, created_at")
        .order("created_at", { ascending: false });

      if (statsError) throw statsError;

      // Calculate stats per agent
      const statsMap = new Map<
        string,
        { count: number; lastActivity?: string }
      >();
      (agentStats ?? []).forEach((turn) => {
        const agent = turn.agent_identifier || "unknown";
        const existing = statsMap.get(agent);
        if (!existing) {
          statsMap.set(agent, { count: 1, lastActivity: turn.created_at });
        } else {
          existing.count++;
        }
      });

      // Combine discovered agents with configs
      const configMap = new Map<string, AgentConfig>(
        (configs ?? []).map((c) => [c.agent_identifier, c as AgentConfig])
      );

      // Get unique agents from both sources
      const allAgentIds = new Set([
        ...discoveredAgents,
        ...(configs ?? []).map((c) => c.agent_identifier),
      ]);

      return Array.from(allAgentIds).map((identifier) => {
        const stats = statsMap.get(identifier);
        return {
          identifier,
          config: configMap.get(identifier),
          turnCount: stats?.count ?? 0,
          lastActivity: stats?.lastActivity,
        };
      });
    },
    enabled: discoveredAgents.length > 0 || !isDiscovering,
    refetchInterval: 60000,
  });
}
