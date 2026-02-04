"use client";

import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AgentStatusBadge } from "./agent-status-badge";
import { Settings, BarChart3 } from "lucide-react";
import Link from "next/link";
import type { AgentWithConfig } from "@/hooks/use-agents";

interface AgentCardProps {
  agent: AgentWithConfig;
  onEdit?: () => void;
}

export function AgentCard({ agent, onEdit }: AgentCardProps) {
  return (
    <Card className="hover:border-primary/50 transition-colors">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">
              {agent.config?.name ?? agent.identifier}
            </CardTitle>
            <p className="text-xs text-muted-foreground font-mono mt-1">
              {agent.identifier}
            </p>
          </div>
          <AgentStatusBadge status={agent.config?.status} />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {agent.config?.description && (
          <p className="text-sm text-muted-foreground">
            {agent.config.description}
          </p>
        )}

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Turns</p>
            <p className="font-semibold">{agent.turnCount.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Última atividade</p>
            <p className="font-semibold">
              {agent.lastActivity
                ? formatDistanceToNow(new Date(agent.lastActivity), {
                    addSuffix: true,
                    locale: ptBR,
                  })
                : "Nunca"}
            </p>
          </div>
        </div>

        {agent.config && (
          <div className="text-xs text-muted-foreground space-y-1">
            <div className="flex justify-between">
              <span>Modelo padrão:</span>
              <span className="font-mono">{agent.config.default_model}</span>
            </div>
            <div className="flex justify-between">
              <span>Temperature:</span>
              <span className="font-mono">{agent.config.default_temperature}</span>
            </div>
          </div>
        )}

        <div className="flex gap-2 pt-2">
          <Link href={`/analytics/performance?agent=${agent.identifier}`} className="flex-1">
            <Button variant="outline" size="sm" className="w-full">
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </Button>
          </Link>
          <Button variant="outline" size="sm" className="flex-1" onClick={onEdit}>
            <Settings className="h-4 w-4 mr-2" />
            Configurar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
