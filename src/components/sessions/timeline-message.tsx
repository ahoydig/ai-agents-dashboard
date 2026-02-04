"use client";

import Link from "next/link";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { User, Bot, AlertTriangle, ChevronRight, Wrench } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { AgentTurn } from "@/types/database";

interface TimelineMessageProps {
  turn: AgentTurn;
}

export function TimelineMessage({ turn }: TimelineMessageProps) {
  const isError = turn.status === "error";
  const isBlocked =
    turn.status === "input_blocked" || turn.status === "output_blocked";
  const hasToolCalls = turn.tool_calls && turn.tool_calls.length > 0;

  return (
    <div className="space-y-3">
      {/* User message */}
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
          <User className="h-4 w-4 text-blue-500" />
        </div>
        <div className="flex-1 max-w-[80%]">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs text-muted-foreground">
              {format(new Date(turn.created_at), "HH:mm:ss", { locale: ptBR })}
            </span>
            <span className="text-xs font-medium">Usuário</span>
          </div>
          <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <p className="text-sm whitespace-pre-wrap">{turn.user_message}</p>
          </div>
        </div>
      </div>

      {/* Agent response */}
      <div className="flex items-start gap-3 justify-end">
        <div
          className={cn(
            "flex-1 max-w-[80%]",
            isError && "border-l-2 border-destructive pl-3"
          )}
        >
          <div className="flex items-center justify-end gap-2 mb-1">
            <Badge variant="outline" className="text-xs">
              {turn.agent_identifier}
            </Badge>
            {turn.model_used && (
              <Badge variant="secondary" className="text-xs">
                {turn.model_used}
              </Badge>
            )}
            <span className="text-xs text-muted-foreground">
              {format(new Date(turn.created_at), "HH:mm:ss", { locale: ptBR })}
            </span>
          </div>
          <div
            className={cn(
              "p-3 rounded-lg",
              isError
                ? "bg-destructive/10 border border-destructive/30"
                : isBlocked
                  ? "bg-yellow-500/10 border border-yellow-500/30"
                  : "bg-muted"
            )}
          >
            {isError ? (
              <div className="flex items-start gap-2 text-destructive">
                <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium">Erro</p>
                  <p className="text-sm">{turn.error_message}</p>
                </div>
              </div>
            ) : isBlocked ? (
              <div className="flex items-start gap-2 text-yellow-600 dark:text-yellow-500">
                <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium">
                    {turn.status === "input_blocked"
                      ? "Input Bloqueado"
                      : "Output Bloqueado"}
                  </p>
                  <p className="text-sm">
                    {turn.guardrail_input_reason || turn.guardrail_output_reason}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-sm whitespace-pre-wrap">
                {turn.final_response || turn.assistant_response || "-"}
              </p>
            )}
          </div>

          {/* Tool calls summary */}
          {hasToolCalls && (
            <div className="mt-2 flex flex-wrap gap-1">
              <Wrench className="h-3 w-3 text-muted-foreground" />
              {turn.tool_calls.slice(0, 3).map((tool, i) => (
                <Badge key={i} variant="outline" className="text-xs">
                  {tool.name}
                </Badge>
              ))}
              {turn.tool_calls.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{turn.tool_calls.length - 3}
                </Badge>
              )}
            </div>
          )}

          {/* Metrics */}
          <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
            {turn.latency_total_ms && (
              <span>{turn.latency_total_ms}ms</span>
            )}
            {turn.tokens_input + turn.tokens_output > 0 && (
              <span>
                {turn.tokens_input + turn.tokens_output} tokens
              </span>
            )}
            {turn.cost_usd && <span>${turn.cost_usd.toFixed(4)}</span>}
            <Link href={`/turns/${turn.id}`}>
              <Button variant="ghost" size="sm" className="h-6 px-2">
                Detalhes
                <ChevronRight className="h-3 w-3 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
        <div
          className={cn(
            "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
            isError
              ? "bg-destructive/20"
              : isBlocked
                ? "bg-yellow-500/20"
                : "bg-green-500/20"
          )}
        >
          <Bot
            className={cn(
              "h-4 w-4",
              isError
                ? "text-destructive"
                : isBlocked
                  ? "text-yellow-500"
                  : "text-green-500"
            )}
          />
        </div>
      </div>
    </div>
  );
}
