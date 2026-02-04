"use client";

import Link from "next/link";
import { format, formatDistanceStrict } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ArrowLeft, Play, Clock, MessageSquare, Coins, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { formatPhone } from "@/lib/utils";
import type { ConversationSession } from "@/types/database";

interface SessionHeaderProps {
  session?: ConversationSession;
  isLoading?: boolean;
  totalCost?: number;
}

export function SessionHeader({
  session,
  isLoading,
  totalCost = 0,
}: SessionHeaderProps) {
  if (isLoading || !session) {
    return (
      <Card>
        <CardContent className="p-6">
          <Skeleton className="h-8 w-64 mb-4" />
          <div className="grid grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-16" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const duration =
    session.started_at && session.ended_at
      ? formatDistanceStrict(
          new Date(session.ended_at),
          new Date(session.started_at),
          { locale: ptBR }
        )
      : "Em andamento";

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Link href="/sessions">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar
                </Button>
              </Link>
              <h1 className="text-2xl font-bold">
                {formatPhone(session.phone_number)}
              </h1>
              {session.outcome && (
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
              )}
              {session.escalated && (
                <Badge variant="destructive">Escalado</Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground font-mono">
              ID: {session.id}
            </p>
            {session.started_at && (
              <p className="text-sm text-muted-foreground">
                {format(new Date(session.started_at), "dd/MM/yyyy 'às' HH:mm", {
                  locale: ptBR,
                })}
              </p>
            )}
          </div>
          <Link href={`/replay/${session.id}`}>
            <Button>
              <Play className="h-4 w-4 mr-2" />
              Replay Sessão
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
            <Clock className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Duração</p>
              <p className="font-semibold">{duration}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
            <MessageSquare className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Mensagens</p>
              <p className="font-semibold">{session.message_count}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
            <Coins className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Tokens / Custo</p>
              <p className="font-semibold">
                {session.total_tokens.toLocaleString()} / ${totalCost.toFixed(4)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
            <Bot className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Agentes</p>
              <div className="flex flex-wrap gap-1">
                {session.agents_used.map((agent) => (
                  <Badge key={agent} variant="outline" className="text-xs">
                    {agent}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
