"use client";

import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { AlertCircle, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { formatPhone } from "@/lib/utils";
import type { RecentError } from "@/types/metrics";

interface RecentErrorsProps {
  data?: RecentError[];
  isLoading?: boolean;
}

export function RecentErrors({ data, isLoading }: RecentErrorsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-destructive" />
          Erros Recentes
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : !data || data.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">
            Nenhum erro recente
          </div>
        ) : (
          <div className="space-y-3">
            {data.map((error) => (
              <div
                key={error.id}
                className="p-3 rounded-lg border bg-muted/50 hover:bg-muted transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="destructive" className="text-xs">
                        {error.agent_identifier}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(error.created_at), {
                          addSuffix: true,
                          locale: ptBR,
                        })}
                      </span>
                    </div>
                    <p className="text-sm font-mono truncate">
                      {error.error_message}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatPhone(error.phone_number)}
                    </p>
                  </div>
                  <Link
                    href={`/turns/${error.id}`}
                    className="flex-shrink-0 p-1 hover:bg-background rounded"
                  >
                    <ExternalLink className="h-4 w-4 text-muted-foreground" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
