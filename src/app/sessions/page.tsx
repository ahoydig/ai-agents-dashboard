"use client";

import { useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SessionFilters } from "@/components/sessions/session-filters";
import { SessionsTable } from "@/components/sessions/sessions-table";
import { SimplePagination } from "@/components/ui/pagination";
import {
  useSessions,
  useDiscoveredAgents,
  type SessionsFilters as Filters,
} from "@/hooks/use-sessions";

export default function SessionsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize filters from URL
  const [filters, setFilters] = useState<Filters>(() => ({
    phone: searchParams.get("phone") || undefined,
    agentIdentifier: searchParams.get("agent") || undefined,
  }));

  const [page, setPage] = useState(() => {
    const p = searchParams.get("page");
    return p ? parseInt(p, 10) : 1;
  });

  const { data: sessionsResult, isLoading: sessionsLoading } = useSessions(
    filters,
    page,
    20
  );
  const { data: agents } = useDiscoveredAgents();

  // Update URL when searching
  const handleSearch = useCallback(() => {
    const params = new URLSearchParams();
    if (filters.phone) params.set("phone", filters.phone);
    if (filters.agentIdentifier) params.set("agent", filters.agentIdentifier);
    params.set("page", "1");
    router.push(`/sessions?${params.toString()}`);
    setPage(1);
  }, [filters, router]);

  const handlePageChange = useCallback(
    (newPage: number) => {
      const params = new URLSearchParams();
      if (filters.phone) params.set("phone", filters.phone);
      if (filters.agentIdentifier) params.set("agent", filters.agentIdentifier);
      params.set("page", newPage.toString());
      router.push(`/sessions?${params.toString()}`);
      setPage(newPage);
    },
    [filters, router]
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Sessões</h1>
        <p className="text-muted-foreground">
          Buscar e visualizar sessões de conversa
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <SessionFilters
            filters={filters}
            onFiltersChange={setFilters}
            agents={agents}
            onSearch={handleSearch}
          />
        </CardContent>
      </Card>

      {/* Results */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>
            Resultados
            {sessionsResult && (
              <span className="ml-2 text-sm font-normal text-muted-foreground">
                ({sessionsResult.total} sessões encontradas)
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <SessionsTable
            sessions={sessionsResult?.data}
            isLoading={sessionsLoading}
          />

          {sessionsResult && sessionsResult.totalPages > 1 && (
            <div className="mt-6">
              <SimplePagination
                currentPage={page}
                totalPages={sessionsResult.totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
