"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface LatencyBreakdownChartProps {
  data: {
    context: number;
    guardrailInput: number;
    agent: number;
    guardrailOutput: number;
  };
  isLoading?: boolean;
}

const LABELS: Record<string, string> = {
  context: "Context",
  guardrailInput: "Guardrail In",
  agent: "Agent/LLM",
  guardrailOutput: "Guardrail Out",
};

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
];

function formatMs(value: number): string {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}s`;
  }
  return `${value.toFixed(0)}ms`;
}

export function LatencyBreakdownChart({
  data,
  isLoading,
}: LatencyBreakdownChartProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Breakdown de Latência</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[250px] w-full" />
        </CardContent>
      </Card>
    );
  }

  const chartData = [
    { name: LABELS.context, value: data.context },
    { name: LABELS.guardrailInput, value: data.guardrailInput },
    { name: LABELS.agent, value: data.agent },
    { name: LABELS.guardrailOutput, value: data.guardrailOutput },
  ];

  const totalLatency =
    data.context + data.guardrailInput + data.agent + data.guardrailOutput;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center justify-between">
          <span>Breakdown de Latência</span>
          <span className="text-sm font-normal text-muted-foreground">
            Total médio: {formatMs(totalLatency)}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="name" className="text-xs" />
              <YAxis tickFormatter={formatMs} className="text-xs" />
              <Tooltip formatter={(value: number) => [formatMs(value), "Latência"]} />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {chartData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 grid grid-cols-4 gap-2 text-center text-xs">
          {chartData.map((item, index) => (
            <div key={item.name}>
              <div
                className="h-2 w-full rounded mb-1"
                style={{ backgroundColor: COLORS[index] }}
              />
              <div className="text-muted-foreground">{item.name}</div>
              <div className="font-semibold">{formatMs(item.value)}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
