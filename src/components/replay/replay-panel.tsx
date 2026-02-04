"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CopyButton } from "@/components/ui/copy-button";
import { formatCurrency, formatLatency } from "@/lib/utils";

interface ReplayPanelProps {
  title: string;
  response: string;
  tokens?: { input: number; output: number };
  cost?: number;
  latency?: number;
  isOriginal?: boolean;
}

export function ReplayPanel({
  title,
  response,
  tokens,
  cost,
  latency,
  isOriginal = false,
}: ReplayPanelProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          {title}
          {isOriginal && (
            <Badge variant="outline" className="text-xs">
              Original
            </Badge>
          )}
        </CardTitle>
        <CopyButton value={response} />
      </CardHeader>
      <CardContent>
        <div className="p-3 rounded-lg bg-muted min-h-[200px] max-h-[400px] overflow-auto">
          <p className="text-sm whitespace-pre-wrap">{response || "-"}</p>
        </div>

        {(tokens || cost !== undefined || latency !== undefined) && (
          <div className="mt-4 flex flex-wrap gap-4 text-xs text-muted-foreground">
            {tokens && (
              <span>
                Tokens: {tokens.input + tokens.output} ({tokens.input} in /{" "}
                {tokens.output} out)
              </span>
            )}
            {cost !== undefined && <span>Custo: {formatCurrency(cost)}</span>}
            {latency !== undefined && (
              <span>Latência: {formatLatency(latency)}</span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
