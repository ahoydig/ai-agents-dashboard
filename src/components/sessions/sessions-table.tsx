"use client";

import Link from "next/link";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ExternalLink } from "lucide-react";
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
import { formatPhone, formatCurrency } from "@/lib/utils";
import type { ConversationSession } from "@/types/database";

interface SessionsTableProps {
  sessions?: ConversationSession[];
  isLoading?: boolean;
}

export function SessionsTable({ sessions, isLoading }: SessionsTableProps) {
  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 10 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  if (!sessions || sessions.length === 0) {
    return (
      <div className="py-12 text-center text-muted-foreground">
        Nenhuma sessão encontrada
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Telefone</TableHead>
          <TableHead>Início</TableHead>
          <TableHead>Mensagens</TableHead>
          <TableHead>Tokens</TableHead>
          <TableHead>Agentes</TableHead>
          <TableHead>Outcome</TableHead>
          <TableHead className="w-[50px]"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sessions.map((session) => (
          <TableRow key={session.id}>
            <TableCell className="font-mono">
              {formatPhone(session.phone_number)}
            </TableCell>
            <TableCell>
              {session.started_at
                ? format(new Date(session.started_at), "dd/MM/yyyy HH:mm", {
                    locale: ptBR,
                  })
                : "-"}
            </TableCell>
            <TableCell>{session.message_count}</TableCell>
            <TableCell>{session.total_tokens.toLocaleString()}</TableCell>
            <TableCell>
              <div className="flex flex-wrap gap-1">
                {session.agents_used.slice(0, 3).map((agent) => (
                  <Badge key={agent} variant="outline" className="text-xs">
                    {agent}
                  </Badge>
                ))}
                {session.agents_used.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{session.agents_used.length - 3}
                  </Badge>
                )}
              </div>
            </TableCell>
            <TableCell>
              {session.outcome ? (
                <Badge
                  variant={
                    session.outcome === "completed"
                      ? "default"
                      : session.outcome === "escalated"
                        ? "secondary"
                        : "outline"
                  }
                >
                  {session.outcome}
                </Badge>
              ) : (
                "-"
              )}
            </TableCell>
            <TableCell>
              <Link
                href={`/sessions/${session.id}`}
                className="p-2 hover:bg-muted rounded inline-flex"
              >
                <ExternalLink className="h-4 w-4" />
              </Link>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
