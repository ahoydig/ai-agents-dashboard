"use client";

import { useState } from "react";
import {
  Activity,
  MessageSquare,
  Clock,
  DollarSign,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import { MetricCard } from "@/components/dashboard/metric-card";
import { PeriodSelector } from "@/components/dashboard/period-selector";
import { TurnsChart } from "@/components/dashboard/turns-chart";
import { AgentDistributionChart } from "@/components/dashboard/agent-distribution-chart";
import { RecentErrors } from "@/components/dashboard/recent-errors";
import { useMetrics } from "@/hooks/use-metrics";
import { useTurnsOverTime } from "@/hooks/use-turns-over-time";
import { useAgentDistribution } from "@/hooks/use-agent-distribution";
import { useRecentErrors } from "@/hooks/use-recent-errors";
import { formatCurrency, formatLatency } from "@/lib/utils";
import type { Period } from "@/types/metrics";

export default function DashboardPage() {
  const [period, setPeriod] = useState<Period>("24h");

  const { data: metrics, isLoading: metricsLoading } = useMetrics(period);
  const { data: turnsData, isLoading: turnsLoading } = useTurnsOverTime(period);
  const { data: distributionData, isLoading: distributionLoading } =
    useAgentDistribution(period);
  const { data: errorsData, isLoading: errorsLoading } = useRecentErrors(5);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Visão geral dos agentes de IA
          </p>
        </div>
        <PeriodSelector value={period} onChange={setPeriod} />
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total de Turns"
          value={metrics?.totalTurns ?? 0}
          subtitle={`${period === "24h" ? "Últimas 24h" : period === "7d" ? "Últimos 7 dias" : "Últimos 30 dias"}`}
          icon={Activity}
          isLoading={metricsLoading}
        />
        <MetricCard
          title="Sessões"
          value={metrics?.activeSessions ?? 0}
          subtitle="Únicas no período"
          icon={MessageSquare}
          isLoading={metricsLoading}
        />
        <MetricCard
          title="Latência Média"
          value={formatLatency(metrics?.averageLatency ?? 0)}
          subtitle="Tempo de resposta"
          icon={Clock}
          isLoading={metricsLoading}
        />
        <MetricCard
          title="Custo Total"
          value={formatCurrency(metrics?.totalCost ?? 0)}
          subtitle="API costs"
          icon={DollarSign}
          isLoading={metricsLoading}
        />
      </div>

      {/* Secondary metrics */}
      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          title="Taxa de Sucesso"
          value={`${(metrics?.successRate ?? 0).toFixed(1)}%`}
          subtitle="Turns bem-sucedidos"
          icon={CheckCircle}
          isLoading={metricsLoading}
          valueClassName={
            (metrics?.successRate ?? 100) >= 95
              ? "text-green-500"
              : (metrics?.successRate ?? 100) >= 90
                ? "text-yellow-500"
                : "text-red-500"
          }
        />
        <MetricCard
          title="Taxa de Erro"
          value={`${(metrics?.errorRate ?? 0).toFixed(1)}%`}
          subtitle={`${metrics?.turnsWithErrors ?? 0} turns com erro`}
          icon={AlertTriangle}
          isLoading={metricsLoading}
          valueClassName={
            (metrics?.errorRate ?? 0) <= 1
              ? "text-green-500"
              : (metrics?.errorRate ?? 0) <= 5
                ? "text-yellow-500"
                : "text-red-500"
          }
        />
        <MetricCard
          title="Bloqueados"
          value={metrics?.turnsBlocked ?? 0}
          subtitle="Por guardrails"
          icon={AlertTriangle}
          isLoading={metricsLoading}
        />
      </div>

      {/* Charts */}
      <div className="grid gap-4 lg:grid-cols-2">
        <TurnsChart data={turnsData} isLoading={turnsLoading} />
        <AgentDistributionChart
          data={distributionData}
          isLoading={distributionLoading}
        />
      </div>

      {/* Recent Errors */}
      <RecentErrors data={errorsData} isLoading={errorsLoading} />
    </div>
  );
}
