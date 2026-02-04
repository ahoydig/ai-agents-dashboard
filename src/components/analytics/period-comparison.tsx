"use client";

import { ArrowUp, ArrowDown, Minus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface PeriodComparisonProps {
  currentValue: number;
  previousValue: number;
  changePercentage: number;
  label: string;
  formatValue?: (value: number) => string;
  isLoading?: boolean;
}

export function PeriodComparison({
  currentValue,
  previousValue,
  changePercentage,
  label,
  formatValue = (v) => `$${v.toFixed(4)}`,
  isLoading,
}: PeriodComparisonProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">{label}</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-24 mb-2" />
          <Skeleton className="h-4 w-32" />
        </CardContent>
      </Card>
    );
  }

  const isIncrease = changePercentage > 0;
  const isDecrease = changePercentage < 0;
  const isNeutral = changePercentage === 0;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">{label}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{formatValue(currentValue)}</div>
        <div className="flex items-center gap-2 text-sm">
          <span
            className={cn(
              "flex items-center gap-1",
              isIncrease && "text-red-500",
              isDecrease && "text-green-500",
              isNeutral && "text-muted-foreground"
            )}
          >
            {isIncrease && <ArrowUp className="h-3 w-3" />}
            {isDecrease && <ArrowDown className="h-3 w-3" />}
            {isNeutral && <Minus className="h-3 w-3" />}
            {Math.abs(changePercentage).toFixed(1)}%
          </span>
          <span className="text-muted-foreground">
            vs período anterior ({formatValue(previousValue)})
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
