"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { AgentConfig } from "@/types/playground";

export function useAgentConfigs() {
  return useQuery<AgentConfig[]>({
    queryKey: ["agent-configs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .schema("centerfisio")
        .from("agent_configs")
        .select("*")
        .order("name", { ascending: true });

      if (error) {
        // Table might not exist yet, return empty array
        if (error.code === "42P01") {
          return [];
        }
        throw error;
      }
      return (data ?? []) as AgentConfig[];
    },
  });
}

export function useAgentConfig(identifier: string) {
  return useQuery<AgentConfig | null>({
    queryKey: ["agent-config", identifier],
    queryFn: async () => {
      const { data, error } = await supabase
        .schema("centerfisio")
        .from("agent_configs")
        .select("*")
        .eq("agent_identifier", identifier)
        .single();

      if (error) {
        if (error.code === "PGRST116" || error.code === "42P01") {
          return null;
        }
        throw error;
      }
      return data as AgentConfig;
    },
    enabled: !!identifier,
  });
}

export function useCreateAgentConfig() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (config: Omit<AgentConfig, "id" | "created_at" | "updated_at">) => {
      const { data, error } = await supabase
        .schema("centerfisio")
        .from("agent_configs")
        .insert(config)
        .select()
        .single();

      if (error) throw error;
      return data as AgentConfig;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agent-configs"] });
    },
  });
}

export function useUpdateAgentConfig() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      updates: Partial<AgentConfig> & { id?: string; agent_identifier: string }
    ) => {
      const { id, agent_identifier, ...rest } = updates;

      // If we have an ID, update by ID
      if (id) {
        const { data, error } = await supabase
          .schema("centerfisio")
          .from("agent_configs")
          .update({ ...rest, agent_identifier })
          .eq("id", id)
          .select()
          .single();

        if (error) throw error;
        return data as AgentConfig;
      }

      // Otherwise, try to upsert by agent_identifier
      const { data, error } = await supabase
        .schema("centerfisio")
        .from("agent_configs")
        .upsert(
          { ...rest, agent_identifier },
          { onConflict: "agent_identifier" }
        )
        .select()
        .single();

      if (error) throw error;
      return data as AgentConfig;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agent-configs"] });
      queryClient.invalidateQueries({ queryKey: ["agents-with-config"] });
    },
  });
}
