"use client";

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { AgentDistribution, Period } from "@/types/metrics";

function getPeriodHours(period: Period): number {
  switch (period) {
    case "24h":
      return 24;
    case "7d":
      return 24 * 7;
    case "30d":
      return 24 * 30;
  }
}

export function useAgentDistribution(period: Period = "24h") {
  return useQuery<AgentDistribution[]>({
    queryKey: ["agent-distribution", period],
    queryFn: async () => {
      const hours = getPeriodHours(period);
      const since = new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();

      const { data, error } = await supabase
        .schema("centerfisio")
        .from("agent_turns")
        .select("agent_identifier")
        .gte("created_at", since);

      if (error) throw error;

      // Count by agent
      const counts = new Map<string, number>();
      let total = 0;

      for (const turn of data ?? []) {
        const agent = turn.agent_identifier || "unknown";
        counts.set(agent, (counts.get(agent) ?? 0) + 1);
        total++;
      }

      // Convert to array and calculate percentages
      const distribution: AgentDistribution[] = Array.from(counts.entries())
        .map(([agent, count]) => ({
          agent,
          count,
          percentage: total > 0 ? (count / total) * 100 : 0,
        }))
        .sort((a, b) => b.count - a.count);

      return distribution;
    },
    refetchInterval: 30000,
  });
}
