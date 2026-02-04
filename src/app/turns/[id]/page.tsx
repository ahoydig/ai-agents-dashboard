"use client";

import { use } from "react";
import { TurnHeader } from "@/components/turns/turn-header";
import { TurnInput } from "@/components/turns/turn-input";
import { TurnOutput } from "@/components/turns/turn-output";
import { ToolCallsList } from "@/components/turns/tool-calls-list";
import { ContextSnapshots } from "@/components/turns/context-snapshots";
import { TurnMetrics } from "@/components/turns/turn-metrics";
import { GuardrailsStatus } from "@/components/turns/guardrails-status";
import { TurnErrors } from "@/components/turns/turn-errors";
import { MessageChain } from "@/components/turns/message-chain";
import { SystemPromptViewer } from "@/components/turns/system-prompt-viewer";
import { Skeleton } from "@/components/ui/skeleton";
import { useAgentTurn } from "@/hooks/use-agent-turns";

interface TurnDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function TurnDetailPage({ params }: TurnDetailPageProps) {
  const { id } = use(params);
  const { data: turn, isLoading } = useAgentTurn(id);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-24 w-full" />
        <div className="grid gap-4 md:grid-cols-2">
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
        </div>
        <Skeleton className="h-64" />
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
      <TurnHeader turn={turn} isLoading={isLoading} />

      {/* Input/Output */}
      <div className="grid gap-4 md:grid-cols-2">
        <TurnInput message={turn.user_message} />
        <TurnOutput
          assistantResponse={turn.assistant_response}
          finalResponse={turn.final_response}
          status={turn.status}
          errorMessage={turn.error_message}
        />
      </div>

      {/* Errors (if any) */}
      <TurnErrors
        errorMessage={turn.error_message}
        errorTraceback={turn.error_traceback}
      />

      {/* Tool Calls */}
      <ToolCallsList toolCalls={turn.tool_calls} />

      {/* Metrics and Guardrails */}
      <div className="grid gap-4 md:grid-cols-2">
        <TurnMetrics
          tokensInput={turn.tokens_input}
          tokensOutput={turn.tokens_output}
          costUsd={turn.cost_usd}
          latencyContextMs={turn.latency_context_ms}
          latencyGuardrailInputMs={turn.latency_guardrail_input_ms}
          latencyAgentMs={turn.latency_agent_ms}
          latencyGuardrailOutputMs={turn.latency_guardrail_output_ms}
          latencyTotalMs={turn.latency_total_ms}
        />
        <GuardrailsStatus
          inputSafe={turn.guardrail_input_safe}
          inputReason={turn.guardrail_input_reason}
          inputModel={turn.guardrail_input_model}
          outputSafe={turn.guardrail_output_safe}
          outputReason={turn.guardrail_output_reason}
          outputModel={turn.guardrail_output_model}
          outputSanitized={turn.guardrail_output_sanitized}
        />
      </div>

      {/* Context Snapshots */}
      <ContextSnapshots
        patientContext={turn.patient_context_snapshot}
        crmContext={turn.crm_context_snapshot}
      />

      {/* System Prompt */}
      {turn.system_prompt && (
        <SystemPromptViewer systemPrompt={turn.system_prompt} />
      )}

      {/* Message Chain */}
      {turn.message_chain && turn.message_chain.length > 0 && (
        <MessageChain chain={turn.message_chain} />
      )}
    </div>
  );
}
