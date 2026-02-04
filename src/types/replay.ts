import type { ChatMessage, ToolCall } from "./database";

export interface ReplayRequest {
  system_prompt: string;
  chat_history: ChatMessage[];
  user_message: string;
  patient_context: Record<string, unknown>;
  crm_context: Record<string, unknown>;
  model: string;
  temperature: number;
  agent_identifier: string;
}

export interface ReplayResponse {
  assistant_response: string;
  final_response: string;
  tool_calls: ToolCall[];
  tokens: {
    input: number;
    output: number;
  };
  cost_usd: number;
  latencies: {
    context_ms: number;
    guardrail_input_ms: number;
    guardrail_output_ms: number;
    agent_ms: number;
    total_ms: number;
  };
  guardrails: {
    input_safe: boolean;
    output_safe: boolean;
    sanitized: boolean;
  };
  error?: string;
}

export interface ReplayConfig {
  systemPrompt: string;
  chatHistory: ChatMessage[];
  userMessage: string;
  patientContext: Record<string, unknown>;
  crmContext: Record<string, unknown>;
  model: string;
  temperature: number;
  agentIdentifier: string;
}

export interface ReplayComparison {
  original: {
    response: string;
    tokens: { input: number; output: number };
    cost: number;
    latency: number;
  };
  replay: {
    response: string;
    tokens: { input: number; output: number };
    cost: number;
    latency: number;
  };
  diffPercentage: number;
}
