"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Play, RefreshCw, Edit2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ReplayPanel } from "@/components/replay/replay-panel";
import { DiffViewer } from "@/components/replay/diff-viewer";
import { MetricsComparison } from "@/components/replay/metrics-comparison";
import { EditableContext } from "@/components/replay/editable-context";
import { EditableSystemPrompt } from "@/components/replay/editable-system-prompt";
import { useAgentTurn } from "@/hooks/use-agent-turns";
import { useReplay } from "@/hooks/use-replay";
import type { ReplayResponse } from "@/types/replay";
import { toast } from "sonner";

interface ReplayPageProps {
  params: Promise<{ id: string }>;
}

export default function ReplayPage({ params }: ReplayPageProps) {
  const { id } = use(params);
  const { data: turn, isLoading: turnLoading } = useAgentTurn(id);
  const replay = useReplay();

  const [mode, setMode] = useState<"view" | "edit">("view");
  const [replayResult, setReplayResult] = useState<ReplayResponse | null>(null);

  // Editable config state
  const [systemPrompt, setSystemPrompt] = useState("");
  const [patientContext, setPatientContext] = useState<Record<string, unknown>>(
    {}
  );
  const [crmContext, setCrmContext] = useState<Record<string, unknown>>({});

  // Initialize config from turn
  useEffect(() => {
    if (turn) {
      setSystemPrompt(turn.system_prompt ?? "");
      setPatientContext(turn.patient_context_snapshot ?? {});
      setCrmContext(turn.crm_context_snapshot ?? {});
    }
  }, [turn]);

  const handleReset = () => {
    if (turn) {
      setSystemPrompt(turn.system_prompt ?? "");
      setPatientContext(turn.patient_context_snapshot ?? {});
      setCrmContext(turn.crm_context_snapshot ?? {});
    }
    setReplayResult(null);
    toast.info("Configuração resetada para o original");
  };

  const handleExecuteReplay = async () => {
    if (!turn) return;

    try {
      const result = await replay.mutateAsync({
        system_prompt: systemPrompt,
        chat_history: turn.chat_history ?? [],
        user_message: turn.user_message,
        patient_context: patientContext,
        crm_context: crmContext,
        model: turn.model_used ?? "gpt-4",
        temperature: 0.7,
        agent_identifier: turn.agent_identifier,
      });
      setReplayResult(result);
      toast.success("Replay executado com sucesso");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Erro ao executar replay"
      );
    }
  };

  if (turnLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-16 w-full" />
        <div className="grid gap-4 md:grid-cols-2">
          <Skeleton className="h-[300px]" />
          <Skeleton className="h-[300px]" />
        </div>
      </div>
    );
  }

  if (!turn) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <p className="text-muted-foreground">Turn não encontrado</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Link href={`/turns/${id}`}>
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar ao Turn
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">Replay Turn #{turn.turn_number}</h1>
            <Badge variant="outline">{turn.agent_identifier}</Badge>
          </div>
          <p className="text-sm text-muted-foreground font-mono">{turn.id}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleReset}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset
          </Button>
          <Button
            variant="outline"
            onClick={() => setMode(mode === "view" ? "edit" : "view")}
          >
            {mode === "view" ? (
              <>
                <Edit2 className="h-4 w-4 mr-2" />
                Editar Config
              </>
            ) : (
              <>
                <Eye className="h-4 w-4 mr-2" />
                Ver Diff
              </>
            )}
          </Button>
          <Button onClick={handleExecuteReplay} disabled={replay.isPending}>
            {replay.isPending ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Executando...
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Executar Replay
              </>
            )}
          </Button>
        </div>
      </div>

      <Tabs value={mode} onValueChange={(v) => setMode(v as "view" | "edit")}>
        <TabsList>
          <TabsTrigger value="view">Comparação</TabsTrigger>
          <TabsTrigger value="edit">Editar Configuração</TabsTrigger>
        </TabsList>

        <TabsContent value="view" className="space-y-6 mt-6">
          {/* Original vs Replay */}
          <div className="grid gap-4 md:grid-cols-2">
            <ReplayPanel
              title="Resposta Original"
              response={turn.final_response ?? turn.assistant_response ?? ""}
              tokens={{
                input: turn.tokens_input,
                output: turn.tokens_output,
              }}
              cost={turn.cost_usd ?? 0}
              latency={turn.latency_total_ms ?? 0}
              isOriginal
            />
            <ReplayPanel
              title="Resposta do Replay"
              response={
                replayResult?.final_response ??
                replayResult?.assistant_response ??
                "Execute o replay para ver o resultado"
              }
              tokens={
                replayResult
                  ? {
                      input: replayResult.tokens.input,
                      output: replayResult.tokens.output,
                    }
                  : undefined
              }
              cost={replayResult?.cost_usd}
              latency={replayResult?.latencies.total_ms}
            />
          </div>

          {/* Diff */}
          {replayResult && (
            <>
              <DiffViewer
                original={turn.final_response ?? turn.assistant_response ?? ""}
                replay={
                  replayResult.final_response ?? replayResult.assistant_response
                }
              />

              {/* Metrics Comparison */}
              <MetricsComparison
                original={{
                  tokensIn: turn.tokens_input,
                  tokensOut: turn.tokens_output,
                  cost: turn.cost_usd ?? 0,
                  latency: turn.latency_total_ms ?? 0,
                }}
                replay={{
                  tokensIn: replayResult.tokens.input,
                  tokensOut: replayResult.tokens.output,
                  cost: replayResult.cost_usd,
                  latency: replayResult.latencies.total_ms,
                }}
              />
            </>
          )}
        </TabsContent>

        <TabsContent value="edit" className="space-y-6 mt-6">
          {/* System Prompt */}
          <EditableSystemPrompt
            value={systemPrompt}
            onChange={setSystemPrompt}
          />

          {/* Contexts */}
          <div className="grid gap-4 md:grid-cols-2">
            <EditableContext
              title="Patient Context"
              value={patientContext}
              onChange={setPatientContext}
            />
            <EditableContext
              title="CRM Context"
              value={crmContext}
              onChange={setCrmContext}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
