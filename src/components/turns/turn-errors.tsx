"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CopyButton } from "@/components/ui/copy-button";
import { AlertTriangle } from "lucide-react";

interface TurnErrorsProps {
  errorMessage?: string | null;
  errorTraceback?: string | null;
}

export function TurnErrors({ errorMessage, errorTraceback }: TurnErrorsProps) {
  if (!errorMessage && !errorTraceback) {
    return null;
  }

  return (
    <Card className="border-destructive/50">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base text-destructive">
          <AlertTriangle className="h-4 w-4" />
          Erro
        </CardTitle>
      </CardHeader>
      <CardContent>
        {errorMessage && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium">Mensagem</p>
              <CopyButton value={errorMessage} />
            </div>
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/30">
              <p className="text-sm text-destructive">{errorMessage}</p>
            </div>
          </div>
        )}

        {errorTraceback && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium">Traceback</p>
              <CopyButton value={errorTraceback} />
            </div>
            <div className="p-3 rounded-lg bg-muted overflow-auto max-h-[300px]">
              <pre className="text-xs font-mono whitespace-pre-wrap">
                {errorTraceback}
              </pre>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
