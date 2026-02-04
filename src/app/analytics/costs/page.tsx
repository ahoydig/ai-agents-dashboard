"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PeriodSelector } from "@/components/dashboard/period-selector";
import { CostLineChart } from "@/components/analytics/cost-line-chart";
import { CostByAgentPie } from "@/components/analytics/cost-by-agent-pie";
import { CostByModelTable } from "@/components/analytics/cost-by-model-table";
import { PeriodComparison } from "@/components/analytics/period-comparison";
import { AgentSelector } from "@/components/playground/agent-selector";
import { useCostMetrics } from "@/hooks/use-cost-metrics";
import { exportToCSV } from "@/lib/export";
import { toast } from "sonner";
import type { Period } from "@/types/metrics";

export default function CostsPage() {
  const [period, setPeriod] = useState<Period>("7d");
  const [agentFilter, setAgentFilter] = useState<string>("");

  const { data: costMetrics, isLoading } = useCostMetrics(
    period,
    agentFilter || undefined
  );

  const handleExport = () => {
    if (!costMetrics) {
      toast.error("Nenhum dado para exportar");
      return;
    }

    // Export daily costs
    exportToCSV(
      costMetrics.dailyCosts,
      `custos-diarios-${period}`,
      [
        { key: "date", label: "Data" },
        { key: "cost", label: "Custo (USD)" },
        { key: "turns", label: "Turns" },
      ]
    );

    toast.success("Dados exportados");
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <PeriodSelector value={period} onChange={setPeriod} />
          <div className="w-[200px]">
            <AgentSelector
              value={agentFilter}
              onChange={setAgentFilter}
            />
          </div>
        </div>
        <Button variant="outline" onClick={handleExport} disabled={isLoading}>
          <Download className="h-4 w-4 mr-2" />
          Exportar CSV
        </Button>
      </div>

      {/* Summary Card */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <PeriodComparison
          label={`Custo Total (${period})`}
          currentValue={costMetrics?.totalCost ?? 0}
          previousValue={costMetrics?.previousPeriodCost ?? 0}
          changePercentage={costMetrics?.costChange ?? 0}
          formatValue={(v) => `$${v.toFixed(4)}`}
          isLoading={isLoading}
        />
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <CostLineChart
          data={costMetrics?.dailyCosts ?? []}
          isLoading={isLoading}
        />
        <CostByAgentPie
          data={costMetrics?.costByAgent ?? []}
          isLoading={isLoading}
        />
      </div>

      {/* Table */}
      <CostByModelTable
        data={costMetrics?.costByModel ?? []}
        isLoading={isLoading}
      />
    </div>
  );
}
