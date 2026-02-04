"use client";

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Period } from "@/types/metrics";

export interface CostMetrics {
  totalCost: number;
  dailyCosts: Array<{
    date: string;
    cost: number;
    turns: number;
  }>;
  costByAgent: Array<{
    agent: string;
    cost: number;
    percentage: number;
  }>;
  costByModel: Array<{
    model: string;
    cost: number;
    turns: number;
    avgCostPerTurn: number;
  }>;
  previousPeriodCost: number;
  costChange: number;
}

function getPeriodInterval(period: Period): string {
  switch (period) {
    case "24h":
      return "24 hours";
    case "7d":
      return "7 days";
    case "30d":
      return "30 days";
  }
}

export function useCostMetrics(period: Period, agentIdentifier?: string) {
  return useQuery<CostMetrics>({
    queryKey: ["cost-metrics", period, agentIdentifier],
    queryFn: async () => {
      const interval = getPeriodInterval(period);
      const now = new Date();

      // Calculate date boundaries
      const periodDays = period === "24h" ? 1 : period === "7d" ? 7 : 30;
      const startDate = new Date(now.getTime() - periodDays * 24 * 60 * 60 * 1000);
      const previousStartDate = new Date(startDate.getTime() - periodDays * 24 * 60 * 60 * 1000);

      // Build base query
      let query = supabase
        .schema("centerfisio")
        .from("agent_turns")
        .select("cost_usd, model, agent_identifier, created_at");

      if (agentIdentifier) {
        query = query.eq("agent_identifier", agentIdentifier);
      }

      // Current period data
      const { data: currentData, error: currentError } = await query
        .gte("created_at", startDate.toISOString())
        .order("created_at", { ascending: true });

      if (currentError) throw currentError;

      // Previous period data for comparison
      let previousQuery = supabase
        .schema("centerfisio")
        .from("agent_turns")
        .select("cost_usd");

      if (agentIdentifier) {
        previousQuery = previousQuery.eq("agent_identifier", agentIdentifier);
      }

      const { data: previousData, error: previousError } = await previousQuery
        .gte("created_at", previousStartDate.toISOString())
        .lt("created_at", startDate.toISOString());

      if (previousError) throw previousError;

      // Calculate total cost
      const totalCost = (currentData ?? []).reduce(
        (sum, turn) => sum + (turn.cost_usd || 0),
        0
      );

      const previousPeriodCost = (previousData ?? []).reduce(
        (sum, turn) => sum + (turn.cost_usd || 0),
        0
      );

      const costChange = previousPeriodCost > 0
        ? ((totalCost - previousPeriodCost) / previousPeriodCost) * 100
        : 0;

      // Calculate daily costs
      const dailyCostsMap = new Map<string, { cost: number; turns: number }>();
      (currentData ?? []).forEach((turn) => {
        const dateParts = new Date(turn.created_at).toISOString().split("T");
        const date = dateParts[0] ?? "";
        const existing = dailyCostsMap.get(date) ?? { cost: 0, turns: 0 };
        dailyCostsMap.set(date, {
          cost: existing.cost + (turn.cost_usd || 0),
          turns: existing.turns + 1,
        });
      });

      const dailyCosts = Array.from(dailyCostsMap.entries())
        .map(([date, data]) => ({ date, ...data }))
        .sort((a, b) => a.date.localeCompare(b.date));

      // Calculate cost by agent
      const agentCostsMap = new Map<string, number>();
      (currentData ?? []).forEach((turn) => {
        const agent = turn.agent_identifier || "unknown";
        agentCostsMap.set(agent, (agentCostsMap.get(agent) || 0) + (turn.cost_usd || 0));
      });

      const costByAgent = Array.from(agentCostsMap.entries())
        .map(([agent, cost]) => ({
          agent,
          cost,
          percentage: totalCost > 0 ? (cost / totalCost) * 100 : 0,
        }))
        .sort((a, b) => b.cost - a.cost);

      // Calculate cost by model
      const modelStatsMap = new Map<string, { cost: number; turns: number }>();
      (currentData ?? []).forEach((turn) => {
        const model = turn.model || "unknown";
        const existing = modelStatsMap.get(model) || { cost: 0, turns: 0 };
        modelStatsMap.set(model, {
          cost: existing.cost + (turn.cost_usd || 0),
          turns: existing.turns + 1,
        });
      });

      const costByModel = Array.from(modelStatsMap.entries())
        .map(([model, stats]) => ({
          model,
          cost: stats.cost,
          turns: stats.turns,
          avgCostPerTurn: stats.turns > 0 ? stats.cost / stats.turns : 0,
        }))
        .sort((a, b) => b.cost - a.cost);

      return {
        totalCost,
        dailyCosts,
        costByAgent,
        costByModel,
        previousPeriodCost,
        costChange,
      };
    },
    refetchInterval: 60000, // Refresh every minute
  });
}
