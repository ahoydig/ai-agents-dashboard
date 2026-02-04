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
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface AgentComparisonTableProps {
  data: Array<{
    agent: string;
    avgLatency: number;
    p90Latency: number;
    turns: number;
    errorRate: number;
  }>;
  isLoading?: boolean;
}

function formatMs(value: number): string {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}s`;
  }
  return `${value.toFixed(0)}ms`;
}

function getErrorRateBadge(errorRate: number) {
  if (errorRate === 0) {
    return <Badge variant="secondary">0%</Badge>;
  }
  if (errorRate < 1) {
    return <Badge variant="secondary">{errorRate.toFixed(2)}%</Badge>;
  }
  if (errorRate < 5) {
    return <Badge variant="outline">{errorRate.toFixed(1)}%</Badge>;
  }
  return <Badge variant="destructive">{errorRate.toFixed(1)}%</Badge>;
}

export function AgentComparisonTable({
  data,
  isLoading,
}: AgentComparisonTableProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Comparação de Agentes</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[200px] w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Comparação de Agentes</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Agente</TableHead>
              <TableHead className="text-right">Turns</TableHead>
              <TableHead className="text-right">Latência Média</TableHead>
              <TableHead className="text-right">P90</TableHead>
              <TableHead className="text-right">Taxa de Erro</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center text-muted-foreground"
                >
                  Nenhum dado disponível
                </TableCell>
              </TableRow>
            ) : (
              data.map((row) => (
                <TableRow key={row.agent}>
                  <TableCell className="font-medium">{row.agent}</TableCell>
                  <TableCell className="text-right">{row.turns}</TableCell>
                  <TableCell className="text-right">
                    {formatMs(row.avgLatency)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatMs(row.p90Latency)}
                  </TableCell>
                  <TableCell className="text-right">
                    {getErrorRateBadge(row.errorRate)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
