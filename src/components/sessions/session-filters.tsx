"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import type { DateRange } from "react-day-picker";
import type { SessionsFilters } from "@/hooks/use-sessions";

interface SessionFiltersProps {
  filters: SessionsFilters;
  onFiltersChange: (filters: SessionsFilters) => void;
  agents?: string[];
  onSearch: () => void;
}

export function SessionFilters({
  filters,
  onFiltersChange,
  agents = [],
  onSearch,
}: SessionFiltersProps) {
  const dateRange: DateRange | undefined =
    filters.dateFrom || filters.dateTo
      ? { from: filters.dateFrom, to: filters.dateTo }
      : undefined;

  const handleDateChange = (range: DateRange | undefined) => {
    onFiltersChange({
      ...filters,
      dateFrom: range?.from,
      dateTo: range?.to,
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      onSearch();
    }
  };

  return (
    <div className="flex flex-wrap gap-4 items-end">
      <div className="flex-1 min-w-[200px]">
        <label className="text-sm font-medium mb-2 block">Telefone</label>
        <div className="flex gap-2">
          <Input
            placeholder="Ex: 5581999999999"
            value={filters.phone ?? ""}
            onChange={(e) =>
              onFiltersChange({ ...filters, phone: e.target.value || undefined })
            }
            onKeyDown={handleKeyDown}
          />
        </div>
      </div>

      <div className="w-[180px]">
        <label className="text-sm font-medium mb-2 block">Agente</label>
        <Select
          value={filters.agentIdentifier ?? "all"}
          onValueChange={(v) =>
            onFiltersChange({
              ...filters,
              agentIdentifier: v === "all" ? undefined : v,
            })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Todos os agentes" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os agentes</SelectItem>
            {agents.map((agent) => (
              <SelectItem key={agent} value={agent}>
                {agent}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-sm font-medium mb-2 block">Período</label>
        <DateRangePicker value={dateRange} onChange={handleDateChange} />
      </div>

      <Button onClick={onSearch}>
        <Search className="h-4 w-4 mr-2" />
        Buscar
      </Button>
    </div>
  );
}
