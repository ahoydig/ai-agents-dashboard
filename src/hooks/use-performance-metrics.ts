"use client";

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Period } from "@/types/metrics";

export interface PerformanceMetrics {
  latencyPercentiles: {
    p50: number;
    p90: number;
    p99: number;
  };
  hourlyThroughput: Array<{
    hour: string;
    turns: number;
  }>;
  latencyBreakdown: {
    context: number;
    guardrailInput: number;
    agent: number;
    guardrailOutput: number;
  };
  agentComparison: Array<{
    agent: string;
    avgLatency: number;
    p90Latency: number;
    turns: number;
    errorRate: number;
  }>;
  latencyOverTime: Array<{
    date: string;
    avgLatency: number;
    p90Latency: number;
  }>;
}

function getPeriodDays(period: Period): number {
  switch (period) {
    case "24h":
      return 1;
    case "7d":
      return 7;
    case "30d":
      return 30;
  }
}

function calculatePercentile(values: number[], percentile: number): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const index = Math.ceil((percentile / 100) * sorted.length) - 1;
  return sorted[Math.max(0, index)] || 0;
}

export function usePerformanceMetrics(period: Period, agentIdentifier?: string) {
  return useQuery<PerformanceMetrics>({
    queryKey: ["performance-metrics", period, agentIdentifier],
    queryFn: async () => {
      const periodDays = getPeriodDays(period);
      const startDate = new Date(Date.now() - periodDays * 24 * 60 * 60 * 1000);

      // Build query
      let query = supabase
        .schema("centerfisio")
        .from("agent_turns")
        .select(
          "latency_total_ms, latency_context_ms, latency_guardrail_input_ms, latency_agent_ms, latency_guardrail_output_ms, agent_identifier, status, created_at"
        )
        .gte("created_at", startDate.toISOString());

      if (agentIdentifier) {
        query = query.eq("agent_identifier", agentIdentifier);
      }

      const { data, error } = await query.order("created_at", { ascending: true });

      if (error) throw error;

      const turns = data ?? [];

      // Calculate latency percentiles
      const latencies = turns
        .map((t) => t.latency_total_ms)
        .filter((l): l is number => l != null);

      const latencyPercentiles = {
        p50: calculatePercentile(latencies, 50),
        p90: calculatePercentile(latencies, 90),
        p99: calculatePercentile(latencies, 99),
      };

      // Calculate hourly throughput
      const hourlyMap = new Map<string, number>();
      turns.forEach((turn) => {
        const date = new Date(turn.created_at);
        const dateParts = date.toISOString().split("T");
        const hourKey =
          period === "24h"
            ? `${date.getHours().toString().padStart(2, "0")}:00`
            : dateParts[0] ?? "";
        hourlyMap.set(hourKey, (hourlyMap.get(hourKey) ?? 0) + 1);
      });

      const hourlyThroughput = Array.from(hourlyMap.entries())
        .map(([hour, turns]) => ({ hour, turns }))
        .sort((a, b) => a.hour.localeCompare(b.hour));

      // Calculate latency breakdown averages
      const latencyBreakdown = {
        context:
          turns.reduce((sum, t) => sum + (t.latency_context_ms || 0), 0) /
          Math.max(turns.length, 1),
        guardrailInput:
          turns.reduce((sum, t) => sum + (t.latency_guardrail_input_ms || 0), 0) /
          Math.max(turns.length, 1),
        agent:
          turns.reduce((sum, t) => sum + (t.latency_agent_ms || 0), 0) /
          Math.max(turns.length, 1),
        guardrailOutput:
          turns.reduce((sum, t) => sum + (t.latency_guardrail_output_ms || 0), 0) /
          Math.max(turns.length, 1),
      };

      // Calculate agent comparison
      const agentStatsMap = new Map<
        string,
        { latencies: number[]; errors: number }
      >();
      turns.forEach((turn) => {
        const agent = turn.agent_identifier || "unknown";
        const existing = agentStatsMap.get(agent) || { latencies: [], errors: 0 };
        if (turn.latency_total_ms != null) {
          existing.latencies.push(turn.latency_total_ms);
        }
        if (turn.status === "error") {
          existing.errors++;
        }
        agentStatsMap.set(agent, existing);
      });

      const agentComparison = Array.from(agentStatsMap.entries())
        .map(([agent, stats]) => ({
          agent,
          avgLatency:
            stats.latencies.length > 0
              ? stats.latencies.reduce((a, b) => a + b, 0) / stats.latencies.length
              : 0,
          p90Latency: calculatePercentile(stats.latencies, 90),
          turns: stats.latencies.length,
          errorRate:
            stats.latencies.length > 0
              ? (stats.errors / stats.latencies.length) * 100
              : 0,
        }))
        .sort((a, b) => b.turns - a.turns);

      // Calculate latency over time
      const dailyLatencyMap = new Map<string, number[]>();
      turns.forEach((turn) => {
        const dateParts = new Date(turn.created_at).toISOString().split("T");
        const date = dateParts[0] ?? "";
        const latency = turn.latency_total_ms;
        if (latency != null) {
          const existing = dailyLatencyMap.get(date) ?? [];
          existing.push(latency);
          dailyLatencyMap.set(date, existing);
        }
      });

      const latencyOverTime = Array.from(dailyLatencyMap.entries())
        .map(([date, values]) => ({
          date,
          avgLatency:
            values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 0,
          p90Latency: calculatePercentile(values, 90),
        }))
        .sort((a, b) => a.date.localeCompare(b.date));

      return {
        latencyPercentiles,
        hourlyThroughput,
        latencyBreakdown,
        agentComparison,
        latencyOverTime,
      };
    },
    refetchInterval: 60000, // Refresh every minute
  });
}
