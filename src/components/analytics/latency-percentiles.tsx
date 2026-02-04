"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface LatencyPercentilesProps {
  data: {
    p50: number;
    p90: number;
    p99: number;
  };
  isLoading?: boolean;
}

function formatMs(value: number): string {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}s`;
  }
  return `${value.toFixed(0)}ms`;
}

export function LatencyPercentiles({ data, isLoading }: LatencyPercentilesProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Percentis de Latência</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[200px] w-full" />
        </CardContent>
      </Card>
    );
  }

  const chartData = [
    { name: "P50", value: data.p50, fill: "hsl(var(--chart-1))" },
    { name: "P90", value: data.p90, fill: "hsl(var(--chart-2))" },
    { name: "P99", value: data.p99, fill: "hsl(var(--chart-3))" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Percentis de Latência</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis type="number" tickFormatter={formatMs} />
              <YAxis type="category" dataKey="name" width={50} />
              <Tooltip
                formatter={(value: number) => [formatMs(value), "Latência"]}
              />
              <Bar dataKey="value" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-sm text-muted-foreground">P50</div>
            <div className="text-lg font-semibold">{formatMs(data.p50)}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">P90</div>
            <div className="text-lg font-semibold">{formatMs(data.p90)}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">P99</div>
            <div className="text-lg font-semibold">{formatMs(data.p99)}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
