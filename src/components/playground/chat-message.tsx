"use client";

import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { User, Bot, AlertTriangle, Wrench } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { PlaygroundMessage } from "@/types/playground";

interface ChatMessageProps {
  message: PlaygroundMessage;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";
  const hasError = !!message.error;
  const hasToolCalls = message.toolCalls && message.toolCalls.length > 0;

  return (
    <div
      className={cn(
        "flex items-start gap-3",
        isUser ? "" : "justify-end"
      )}
    >
      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
          <User className="h-4 w-4 text-blue-500" />
        </div>
      )}

      <div className={cn("flex-1 max-w-[80%]", !isUser && "order-first")}>
        <div
          className={cn(
            "flex items-center gap-2 mb-1",
            !isUser && "justify-end"
          )}
        >
          <span className="text-xs text-muted-foreground">
            {format(new Date(message.timestamp), "HH:mm:ss", { locale: ptBR })}
          </span>
          <span className="text-xs font-medium">
            {isUser ? "Você" : "Agente"}
          </span>
        </div>

        <div
          className={cn(
            "p-3 rounded-lg",
            isUser
              ? "bg-blue-500/10 border border-blue-500/20"
              : hasError
                ? "bg-destructive/10 border border-destructive/30"
                : "bg-muted"
          )}
        >
          {hasError ? (
            <div className="flex items-start gap-2 text-destructive">
              <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium">Erro</p>
                <p className="text-sm">{message.error}</p>
              </div>
            </div>
          ) : (
            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
          )}
        </div>

        {/* Tool calls */}
        {hasToolCalls && (
          <div className="mt-2 flex flex-wrap gap-1">
            <Wrench className="h-3 w-3 text-muted-foreground" />
            {message.toolCalls?.slice(0, 3).map((tool, i) => (
              <Badge key={i} variant="outline" className="text-xs">
                {tool.name}
              </Badge>
            ))}
            {message.toolCalls && message.toolCalls.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{message.toolCalls.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Metrics */}
        {message.metrics && (
          <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
            <span>{message.metrics.tokensIn + message.metrics.tokensOut} tokens</span>
            <span>${message.metrics.cost.toFixed(4)}</span>
            <span>{message.metrics.latency}ms</span>
          </div>
        )}
      </div>

      {!isUser && (
        <div
          className={cn(
            "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
            hasError ? "bg-destructive/20" : "bg-green-500/20"
          )}
        >
          <Bot
            className={cn(
              "h-4 w-4",
              hasError ? "text-destructive" : "text-green-500"
            )}
          />
        </div>
      )}
    </div>
  );
}
