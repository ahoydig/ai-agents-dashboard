"use client";

import { useState } from "react";
import { PeriodSelector } from "@/components/dashboard/period-selector";
import { LatencyPercentiles } from "@/components/analytics/latency-percentiles";
import { ThroughputChart } from "@/components/analytics/throughput-chart";
import { LatencyBreakdownChart } from "@/components/analytics/latency-breakdown-chart";
import { AgentComparisonTable } from "@/components/analytics/agent-comparison-table";
import { AgentSelector } from "@/components/playground/agent-selector";
import { usePerformanceMetrics } from "@/hooks/use-performance-metrics";
import type { Period } from "@/types/metrics";

export default function PerformancePage() {
  const [period, setPeriod] = useState<Period>("7d");
  const [agentFilter, setAgentFilter] = useState<string>("");

  const { data: perfMetrics, isLoading } = usePerformanceMetrics(
    period,
    agentFilter || undefined
  );

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex items-center gap-4">
        <PeriodSelector value={period} onChange={setPeriod} />
        <div className="w-[200px]">
          <AgentSelector
            value={agentFilter}
            onChange={setAgentFilter}
          />
        </div>
      </div>

      {/* Latency Overview */}
      <div className="grid gap-6 lg:grid-cols-2">
        <LatencyPercentiles
          data={perfMetrics?.latencyPercentiles ?? { p50: 0, p90: 0, p99: 0 }}
          isLoading={isLoading}
        />
        <LatencyBreakdownChart
          data={
            perfMetrics?.latencyBreakdown ?? {
              context: 0,
              guardrailInput: 0,
              agent: 0,
              guardrailOutput: 0,
            }
          }
          isLoading={isLoading}
        />
      </div>

      {/* Throughput */}
      <ThroughputChart
        data={perfMetrics?.hourlyThroughput ?? []}
        isLoading={isLoading}
      />

      {/* Agent Comparison */}
      <AgentComparisonTable
        data={perfMetrics?.agentComparison ?? []}
        isLoading={isLoading}
      />
    </div>
  );
}
