"use client";

import { Badge } from "@/components/ui/badge";
import { CheckCircle2, PauseCircle, AlertCircle, HelpCircle } from "lucide-react";

interface AgentStatusBadgeProps {
  status?: "active" | "paused" | "error";
}

export function AgentStatusBadge({ status }: AgentStatusBadgeProps) {
  if (!status) {
    return (
      <Badge variant="outline" className="gap-1">
        <HelpCircle className="h-3 w-3" />
        Não configurado
      </Badge>
    );
  }

  switch (status) {
    case "active":
      return (
        <Badge variant="default" className="gap-1 bg-green-600">
          <CheckCircle2 className="h-3 w-3" />
          Ativo
        </Badge>
      );
    case "paused":
      return (
        <Badge variant="secondary" className="gap-1">
          <PauseCircle className="h-3 w-3" />
          Pausado
        </Badge>
      );
    case "error":
      return (
        <Badge variant="destructive" className="gap-1">
          <AlertCircle className="h-3 w-3" />
          Erro
        </Badge>
      );
  }
}
