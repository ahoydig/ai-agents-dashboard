"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CopyButton } from "@/components/ui/copy-button";
import { Bot } from "lucide-react";
import { cn } from "@/lib/utils";

interface TurnOutputProps {
  assistantResponse?: string | null;
  finalResponse?: string | null;
  status: "success" | "error" | "input_blocked" | "output_blocked";
  errorMessage?: string | null;
}

export function TurnOutput({
  assistantResponse,
  finalResponse,
  status,
  errorMessage,
}: TurnOutputProps) {
  const isError = status === "error";
  const isBlocked = status === "input_blocked" || status === "output_blocked";
  const response = finalResponse || assistantResponse;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <Bot className="h-4 w-4" />
          Resposta do Agente
        </CardTitle>
        {response && <CopyButton value={response} />}
      </CardHeader>
      <CardContent>
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
            <div className="text-destructive">
              <p className="font-medium mb-1">Erro</p>
              <p className="text-sm">{errorMessage || "Erro desconhecido"}</p>
            </div>
          ) : isBlocked ? (
            <div className="text-yellow-600 dark:text-yellow-500">
              <p className="font-medium mb-1">
                {status === "input_blocked" ? "Input Bloqueado" : "Output Bloqueado"}
              </p>
              <p className="text-sm">{response || "Conteúdo bloqueado pelos guardrails"}</p>
            </div>
          ) : (
            <p className="text-sm whitespace-pre-wrap">{response || "-"}</p>
          )}
        </div>

        {/* Show both if different */}
        {assistantResponse && finalResponse && assistantResponse !== finalResponse && (
          <div className="mt-4">
            <p className="text-xs text-muted-foreground mb-2">Resposta original (antes sanitização)</p>
            <div className="p-3 rounded-lg bg-muted/50 border">
              <p className="text-sm whitespace-pre-wrap">{assistantResponse}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
