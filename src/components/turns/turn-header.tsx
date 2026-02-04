"use client";

import Link from "next/link";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ArrowLeft, Play, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/sessions/status-badge";
import type { AgentTurn } from "@/types/database";

interface TurnHeaderProps {
  turn?: AgentTurn;
  isLoading?: boolean;
}

export function TurnHeader({ turn, isLoading }: TurnHeaderProps) {
  if (isLoading || !turn) {
    return (
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-48" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>
    );
  }

  return (
    <div className="flex items-start justify-between">
      <div>
        <div className="flex items-center gap-3 mb-2">
          {turn.session_id && (
            <Link href={`/sessions/${turn.session_id}`}>
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar à Sessão
              </Button>
            </Link>
          )}
          <h1 className="text-2xl font-bold">Turn #{turn.turn_number}</h1>
          <StatusBadge status={turn.status} />
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="font-mono">{turn.id}</span>
          <span>
            {format(new Date(turn.created_at), "dd/MM/yyyy 'às' HH:mm:ss", {
              locale: ptBR,
            })}
          </span>
          {turn.model_used && (
            <Badge variant="secondary">{turn.model_used}</Badge>
          )}
          <Badge variant="outline">{turn.agent_identifier}</Badge>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {turn.session_id && (
          <Link href={`/sessions/${turn.session_id}`}>
            <Button variant="outline" size="sm">
              <ExternalLink className="h-4 w-4 mr-2" />
              Ver Sessão
            </Button>
          </Link>
        )}
        <Link href={`/replay/${turn.id}`}>
          <Button>
            <Play className="h-4 w-4 mr-2" />
            Replay Turn
          </Button>
        </Link>
      </div>
    </div>
  );
}
