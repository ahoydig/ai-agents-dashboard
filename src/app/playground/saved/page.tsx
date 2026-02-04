"use client";

import { useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ArrowLeft, Play, Trash2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTestSessions, useDeleteTestSession } from "@/hooks/use-test-sessions";
import { useDiscoveredAgents } from "@/hooks/use-sessions";
import { SCENARIO_OPTIONS, type Scenario } from "@/types/playground";
import { toast } from "sonner";
import { FolderOpen } from "lucide-react";

export default function SavedSessionsPage() {
  const [agentFilter, setAgentFilter] = useState<string>("all");
  const [scenarioFilter, setScenarioFilter] = useState<string>("all");

  const { data: agents } = useDiscoveredAgents();
  const { data: sessions, isLoading } = useTestSessions({
    agentIdentifier: agentFilter === "all" ? undefined : agentFilter,
    scenario: scenarioFilter === "all" ? undefined : (scenarioFilter as Scenario),
  });
  const deleteSession = useDeleteTestSession();

  const handleDelete = async (id: string) => {
    try {
      await deleteSession.mutateAsync(id);
      toast.success("Sessão excluída");
    } catch (error) {
      toast.error("Erro ao excluir sessão");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/playground">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar ao Playground
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Sessões Salvas</h1>
            <p className="text-muted-foreground">
              Gerencie e re-execute sessões de teste
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="w-[200px]">
              <Select value={agentFilter} onValueChange={setAgentFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Agente" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os agentes</SelectItem>
                  {agents?.map((agent) => (
                    <SelectItem key={agent} value={agent}>
                      {agent}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-[200px]">
              <Select value={scenarioFilter} onValueChange={setScenarioFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Cenário" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os cenários</SelectItem>
                  {SCENARIO_OPTIONS.map((scenario) => (
                    <SelectItem key={scenario.value} value={scenario.value}>
                      {scenario.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sessions List */}
      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      ) : !sessions || sessions.length === 0 ? (
        <EmptyState
          icon={FolderOpen}
          title="Nenhuma sessão salva"
          description="Salve sessões do playground para poder re-executar e comparar resultados"
          action={
            <Link href="/playground">
              <Button>Ir para Playground</Button>
            </Link>
          }
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {sessions.map((session) => (
            <Card key={session.id} className="hover:border-primary/50 transition-colors">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-base">{session.name}</CardTitle>
                  {session.scenario && (
                    <Badge variant="outline">
                      {SCENARIO_OPTIONS.find((s) => s.value === session.scenario)?.label}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{session.agent_identifier}</Badge>
                    <span className="text-muted-foreground">
                      {session.timeline.length} mensagens
                    </span>
                  </div>
                  {session.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {session.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                  {session.notes && (
                    <p className="text-muted-foreground line-clamp-2">
                      {session.notes}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(session.updated_at), "dd/MM/yyyy 'às' HH:mm", {
                      locale: ptBR,
                    })}
                  </p>
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <Link
                    href={`/playground?load=${session.id}`}
                    className="flex-1"
                  >
                    <Button variant="outline" size="sm" className="w-full">
                      <Play className="h-4 w-4 mr-2" />
                      Carregar
                    </Button>
                  </Link>
                  {session.github_issue_url && (
                    <a
                      href={session.github_issue_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button variant="outline" size="icon">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </a>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(session.id)}
                    disabled={deleteSession.isPending}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
