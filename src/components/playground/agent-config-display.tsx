"use client";

import { Brain, Thermometer, FileText, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import type { AgentConfig } from "@/types/playground";

interface AgentConfigDisplayProps {
  config: AgentConfig | null | undefined;
  isLoading?: boolean;
}

export function AgentConfigDisplay({
  config,
  isLoading,
}: AgentConfigDisplayProps) {
  if (isLoading) {
    return (
      <div className="space-y-3 p-3 bg-muted/30 rounded-md border">
        <div className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            Carregando configuração...
          </span>
        </div>
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    );
  }

  if (!config) {
    return (
      <div className="p-3 bg-muted/30 rounded-md border text-center">
        <p className="text-sm text-muted-foreground">
          Selecione um agente para ver a configuração padrão
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3 p-3 bg-muted/30 rounded-md border">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium">Configuração do Agente</h4>
        <Badge
          variant={config.status === "active" ? "default" : "secondary"}
          className="text-xs"
        >
          {config.status}
        </Badge>
      </div>

      {config.description && (
        <p className="text-xs text-muted-foreground">{config.description}</p>
      )}

      <Separator />

      <div className="space-y-2">
        {/* Model */}
        <div className="flex items-center gap-2">
          <Brain className="h-4 w-4 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">Modelo:</span>
          <Badge variant="outline" className="text-xs font-mono">
            {config.default_model}
          </Badge>
        </div>

        {/* Temperature */}
        <div className="flex items-center gap-2">
          <Thermometer className="h-4 w-4 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">Temperatura:</span>
          <Badge variant="outline" className="text-xs font-mono">
            {config.default_temperature}
          </Badge>
        </div>

        {/* System Prompt Preview */}
        {config.default_system_prompt && (
          <div className="flex items-start gap-2">
            <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div className="flex-1 min-w-0">
              <span className="text-xs text-muted-foreground block mb-1">
                System Prompt:
              </span>
              <p className="text-xs text-muted-foreground/80 line-clamp-3 bg-background/50 p-2 rounded border">
                {config.default_system_prompt.length > 200
                  ? `${config.default_system_prompt.slice(0, 200)}...`
                  : config.default_system_prompt}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
