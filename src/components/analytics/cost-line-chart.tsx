"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface CostLineChartProps {
  data: Array<{
    date: string;
    cost: number;
    turns: number;
  }>;
  isLoading?: boolean;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
  });
}

function formatCurrency(value: number): string {
  return `$${value.toFixed(4)}`;
}

export function CostLineChart({ data, isLoading }: CostLineChartProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Custo Diário</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Custo Diário</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="date"
                tickFormatter={formatDate}
                className="text-xs"
              />
              <YAxis
                yAxisId="cost"
                tickFormatter={formatCurrency}
                className="text-xs"
              />
              <YAxis
                yAxisId="turns"
                orientation="right"
                className="text-xs"
              />
              <Tooltip
                formatter={(value: number, name: string) =>
                  name === "cost"
                    ? [formatCurrency(value), "Custo"]
                    : [value, "Turns"]
                }
                labelFormatter={formatDate}
              />
              <Legend />
              <Line
                yAxisId="cost"
                type="monotone"
                dataKey="cost"
                name="Custo"
                stroke="hsl(var(--chart-1))"
                strokeWidth={2}
                dot={{ fill: "hsl(var(--chart-1))" }}
              />
              <Line
                yAxisId="turns"
                type="monotone"
                dataKey="turns"
                name="Turns"
                stroke="hsl(var(--chart-2))"
                strokeWidth={2}
                dot={{ fill: "hsl(var(--chart-2))" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
