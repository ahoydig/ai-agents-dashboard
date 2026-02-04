"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Gauge, Coins, Zap } from "lucide-react";

interface TurnMetricsProps {
  tokensInput: number;
  tokensOutput: number;
  costUsd?: number | null;
  latencyContextMs?: number | null;
  latencyGuardrailInputMs?: number | null;
  latencyAgentMs?: number | null;
  latencyGuardrailOutputMs?: number | null;
  latencyTotalMs?: number | null;
}

export function TurnMetrics({
  tokensInput,
  tokensOutput,
  costUsd,
  latencyContextMs,
  latencyGuardrailInputMs,
  latencyAgentMs,
  latencyGuardrailOutputMs,
  latencyTotalMs,
}: TurnMetricsProps) {
  const totalTokens = tokensInput + tokensOutput;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <Gauge className="h-4 w-4" />
          Métricas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-3">
          {/* Tokens */}
          <div className="p-3 rounded-lg bg-muted/50">
            <p className="text-sm text-muted-foreground mb-1">Tokens</p>
            <p className="text-lg font-semibold">
              {totalTokens.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground">
              {tokensInput.toLocaleString()} in / {tokensOutput.toLocaleString()}{" "}
              out
            </p>
          </div>

          {/* Cost */}
          <div className="p-3 rounded-lg bg-muted/50">
            <div className="flex items-center gap-2 mb-1">
              <Coins className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Custo</p>
            </div>
            <p className="text-lg font-semibold">
              ${(costUsd ?? 0).toFixed(4)}
            </p>
          </div>

          {/* Latency */}
          <div className="p-3 rounded-lg bg-muted/50">
            <div className="flex items-center gap-2 mb-1">
              <Zap className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Latência Total</p>
            </div>
            <p className="text-lg font-semibold">
              {latencyTotalMs ? `${latencyTotalMs}ms` : "-"}
            </p>
          </div>
        </div>

        {/* Latency breakdown */}
        {(latencyContextMs ||
          latencyGuardrailInputMs ||
          latencyAgentMs ||
          latencyGuardrailOutputMs) && (
          <div className="mt-4 pt-4 border-t">
            <p className="text-sm text-muted-foreground mb-3">
              Breakdown de Latência
            </p>
            <div className="flex flex-wrap gap-3">
              {latencyContextMs !== null && latencyContextMs !== undefined && (
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 rounded-full bg-blue-500" />
                  <span>Context: {latencyContextMs}ms</span>
                </div>
              )}
              {latencyGuardrailInputMs !== null &&
                latencyGuardrailInputMs !== undefined && (
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <span>Guardrail In: {latencyGuardrailInputMs}ms</span>
                  </div>
                )}
              {latencyAgentMs !== null && latencyAgentMs !== undefined && (
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span>Agent: {latencyAgentMs}ms</span>
                </div>
              )}
              {latencyGuardrailOutputMs !== null &&
                latencyGuardrailOutputMs !== undefined && (
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-3 h-3 rounded-full bg-orange-500" />
                    <span>Guardrail Out: {latencyGuardrailOutputMs}ms</span>
                  </div>
                )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
