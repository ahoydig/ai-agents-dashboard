import { NextRequest, NextResponse } from "next/server";
import type { ReplayResponse } from "@/types/replay";

const AGENTS_API_URL = process.env.AGENTS_API_URL;

// Mock response for development/testing when agent endpoint is unavailable
function generateMockResponse(body: Record<string, unknown>): ReplayResponse {
  const userMessage = (body.user_message as string) || "";
  const model = (body.model_override as string) || (body.model as string) || "gemini-3-flash";
  const temperature = (body.temperature_override as number) || (body.temperature as number) || 0.7;

  const mockToolCalls = userMessage.toLowerCase().includes("agend")
    ? [
        {
          name: "search_patient",
          args: { phone: "+5581999999999" },
          result: { found: true, name: "João Silva", id: "p-123" },
          latency_ms: 234,
          tool_call_id: "tc-1",
        },
        {
          name: "get_available_slots",
          args: { date: "2026-02-10", professional_id: "prof-1" },
          result: { slots: ["14:00", "15:00", "16:00"] },
          latency_ms: 156,
          tool_call_id: "tc-2",
        },
      ]
    : [];

  const toolLogs = mockToolCalls.map((tc) => ({
    step: "tool" as const,
    message: tc.name,
    duration_ms: tc.latency_ms,
    status: "success" as const,
    details: { args: tc.args, result: tc.result },
  }));

  const responses: Record<string, string> = {
    agend: "Claro! Posso ajudar com o agendamento. Encontrei horários disponíveis na segunda-feira: 14h, 15h e 16h. Qual horário prefere?",
    cancel: "Entendi, você gostaria de cancelar. Vou verificar sua consulta agendada. Posso confirmar o cancelamento?",
    default: `Olá! Sou o assistente CenterFisio. Posso ajudar com agendamentos, cancelamentos, informações sobre procedimentos e convênios. Como posso ajudar?`,
  };

  const matchedKey = Object.keys(responses).find((k) =>
    userMessage.toLowerCase().includes(k)
  );
  const finalResponse = responses[matchedKey || "default"];

  const tokensIn = Math.floor(800 + Math.random() * 600);
  const tokensOut = Math.floor(200 + Math.random() * 400);

  return {
    assistant_response: finalResponse,
    final_response: finalResponse,
    tool_calls: mockToolCalls,
    tokens: { input: tokensIn, output: tokensOut },
    cost_usd: parseFloat(((tokensIn * 0.000001 + tokensOut * 0.000002) * 1).toFixed(6)),
    latencies: {
      context_ms: 35 + Math.floor(Math.random() * 30),
      guardrail_input_ms: 80 + Math.floor(Math.random() * 60),
      guardrail_output_ms: 30 + Math.floor(Math.random() * 40),
      agent_ms: 600 + Math.floor(Math.random() * 500),
      total_ms: 0,
    },
    guardrails: {
      input_safe: true,
      output_safe: true,
      sanitized: false,
    },
    config_used: {
      model,
      temperature,
      system_prompt: "Você é um assistente de atendimento da CenterFisio...",
    },
    execution_logs: [
      {
        step: "context",
        message: "Contexto do paciente carregado",
        duration_ms: 35 + Math.floor(Math.random() * 30),
        status: "success",
        details: { patient_id: "p-123", crm_stage: "lead" },
      },
      {
        step: "guardrail_input",
        message: "Input validado com sucesso",
        duration_ms: 80 + Math.floor(Math.random() * 60),
        status: "success",
        details: { safe: true, reason: null, model: "gpt-4o-mini" },
      },
      ...toolLogs,
      {
        step: "llm",
        message: `Resposta gerada com ${model}`,
        duration_ms: 600 + Math.floor(Math.random() * 500),
        status: "success",
        details: { model, tokens_in: tokensIn, tokens_out: tokensOut },
      },
      {
        step: "guardrail_output",
        message: "Output validado com sucesso",
        duration_ms: 30 + Math.floor(Math.random() * 40),
        status: "success",
        details: { safe: true, sanitized: false },
      },
    ],
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Try real agent first
    if (AGENTS_API_URL) {
      try {
        const response = await fetch(`${AGENTS_API_URL}/playground/execute`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
          signal: AbortSignal.timeout(15000),
        });

        if (response.ok) {
          const data: ReplayResponse = await response.json();
          return NextResponse.json(data);
        }

        // Agent returned error - fall through to mock
        console.warn(
          `Agent API returned ${response.status}, falling back to mock`
        );
      } catch (fetchError) {
        // Agent unreachable - fall through to mock
        console.warn(
          "Agent API unreachable, falling back to mock:",
          fetchError instanceof Error ? fetchError.message : fetchError
        );
      }
    }

    // Fallback: mock response with realistic execution_logs
    const mockData = generateMockResponse(body);
    // Compute total latency from execution_logs
    mockData.latencies.total_ms = mockData.execution_logs!.reduce(
      (sum, log) => sum + log.duration_ms,
      0
    );

    return NextResponse.json(mockData);
  } catch (error) {
    console.error("Playground execution error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
