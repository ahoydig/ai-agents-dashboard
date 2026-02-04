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
import { Skeleton } from "@/components/ui/skeleton";

interface CostByModelTableProps {
  data: Array<{
    model: string;
    cost: number;
    turns: number;
    avgCostPerTurn: number;
  }>;
  isLoading?: boolean;
}

function formatCurrency(value: number): string {
  return `$${value.toFixed(4)}`;
}

export function CostByModelTable({ data, isLoading }: CostByModelTableProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Custo por Modelo</CardTitle>
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
        <CardTitle className="text-base">Custo por Modelo</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Modelo</TableHead>
              <TableHead className="text-right">Turns</TableHead>
              <TableHead className="text-right">Custo Total</TableHead>
              <TableHead className="text-right">Custo/Turn</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center text-muted-foreground"
                >
                  Nenhum dado disponível
                </TableCell>
              </TableRow>
            ) : (
              data.map((row) => (
                <TableRow key={row.model}>
                  <TableCell className="font-medium">{row.model}</TableCell>
                  <TableCell className="text-right">{row.turns}</TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(row.cost)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(row.avgCostPerTurn)}
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
