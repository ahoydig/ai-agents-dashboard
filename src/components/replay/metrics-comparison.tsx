"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowUp, ArrowDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatCurrency, formatLatency } from "@/lib/utils";

interface MetricsComparisonProps {
  original: {
    tokensIn: number;
    tokensOut: number;
    cost: number;
    latency: number;
  };
  replay: {
    tokensIn: number;
    tokensOut: number;
    cost: number;
    latency: number;
  };
}

export function MetricsComparison({
  original,
  replay,
}: MetricsComparisonProps) {
  const metrics = [
    {
      name: "Tokens Input",
      original: original.tokensIn.toLocaleString(),
      replay: replay.tokensIn.toLocaleString(),
      diff: replay.tokensIn - original.tokensIn,
      diffFormatted: `${replay.tokensIn - original.tokensIn >= 0 ? "+" : ""}${replay.tokensIn - original.tokensIn}`,
      betterWhenLower: true,
    },
    {
      name: "Tokens Output",
      original: original.tokensOut.toLocaleString(),
      replay: replay.tokensOut.toLocaleString(),
      diff: replay.tokensOut - original.tokensOut,
      diffFormatted: `${replay.tokensOut - original.tokensOut >= 0 ? "+" : ""}${replay.tokensOut - original.tokensOut}`,
      betterWhenLower: true,
    },
    {
      name: "Custo",
      original: formatCurrency(original.cost),
      replay: formatCurrency(replay.cost),
      diff: replay.cost - original.cost,
      diffFormatted: `${replay.cost - original.cost >= 0 ? "+" : ""}${formatCurrency(replay.cost - original.cost)}`,
      betterWhenLower: true,
    },
    {
      name: "Latência",
      original: formatLatency(original.latency),
      replay: formatLatency(replay.latency),
      diff: replay.latency - original.latency,
      diffFormatted: `${replay.latency - original.latency >= 0 ? "+" : ""}${formatLatency(Math.abs(replay.latency - original.latency))}`,
      betterWhenLower: true,
    },
  ];

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Comparação de Métricas</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Métrica</TableHead>
              <TableHead>Original</TableHead>
              <TableHead>Replay</TableHead>
              <TableHead>Diferença</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {metrics.map((metric) => {
              const isBetter = metric.betterWhenLower
                ? metric.diff < 0
                : metric.diff > 0;
              const isWorse = metric.betterWhenLower
                ? metric.diff > 0
                : metric.diff < 0;
              const isEqual = metric.diff === 0;

              return (
                <TableRow key={metric.name}>
                  <TableCell className="font-medium">{metric.name}</TableCell>
                  <TableCell>{metric.original}</TableCell>
                  <TableCell>{metric.replay}</TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        "flex items-center gap-1",
                        isBetter && "text-green-500",
                        isWorse && "text-red-500",
                        isEqual && "text-muted-foreground"
                      )}
                    >
                      {isEqual ? (
                        <Minus className="h-3 w-3" />
                      ) : metric.diff > 0 ? (
                        <ArrowUp className="h-3 w-3" />
                      ) : (
                        <ArrowDown className="h-3 w-3" />
                      )}
                      {metric.diffFormatted}
                    </span>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
