"use client";

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { DashboardMetrics, Period } from "@/types/metrics";

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

export function useMetrics(period: Period = "24h", agentIdentifier?: string) {
  return useQuery<DashboardMetrics>({
    queryKey: ["metrics", period, agentIdentifier],
    queryFn: async () => {
      const hours = getPeriodHours(period);
      const since = new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();

      let baseQuery = supabase
        .schema("centerfisio")
        .from("agent_turns")
        .select("*", { count: "exact", head: false })
        .gte("created_at", since);

      if (agentIdentifier) {
        baseQuery = baseQuery.eq("agent_identifier", agentIdentifier);
      }

      const { data: turns, count, error } = await baseQuery;

      if (error) throw error;

      const totalTurns = count ?? 0;
      const turnsData = turns ?? [];

      // Calculate metrics from returned data
      let totalLatency = 0;
      let latencyCount = 0;
      let totalCost = 0;
      let errorCount = 0;
      let blockedCount = 0;
      const sessionIds = new Set<string>();

      for (const turn of turnsData) {
        if (turn.latency_total_ms) {
          totalLatency += turn.latency_total_ms;
          latencyCount++;
        }
        if (turn.cost_usd) {
          totalCost += turn.cost_usd;
        }
        if (turn.status === "error") {
          errorCount++;
        }
        if (turn.status === "input_blocked" || turn.status === "output_blocked") {
          blockedCount++;
        }
        if (turn.session_id) {
          sessionIds.add(turn.session_id);
        }
      }

      const averageLatency = latencyCount > 0 ? totalLatency / latencyCount : 0;
      const errorRate = totalTurns > 0 ? (errorCount / totalTurns) * 100 : 0;
      const successRate = totalTurns > 0 ? ((totalTurns - errorCount - blockedCount) / totalTurns) * 100 : 0;

      return {
        totalTurns,
        activeSessions: sessionIds.size,
        averageLatency: Math.round(averageLatency),
        totalCost,
        errorRate,
        successRate,
        turnsWithErrors: errorCount,
        turnsBlocked: blockedCount,
      };
    },
    refetchInterval: 30000, // Auto-refresh every 30 seconds
  });
}
