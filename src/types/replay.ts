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
  // Optional overrides - if not provided, uses agent defaults
  model_override?: string;
  temperature_override?: number;
  system_prompt_override?: string;
}

export type ExecutionLogStep =
  | "context"
  | "guardrail_input"
  | "tool"
  | "llm"
  | "guardrail_output"
  | "complete"
  | "error";

export type ExecutionLogStatus = "pending" | "success" | "error" | "skipped";

export interface ExecutionLog {
  step: ExecutionLogStep;
  message: string;
  duration_ms: number;
  status: ExecutionLogStatus;
  details?: Record<string, unknown>;
}

export interface ConfigUsed {
  model: string;
  temperature: number;
  system_prompt: string;
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
  // New observability fields
  config_used?: ConfigUsed;
  execution_logs?: ExecutionLog[];
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
