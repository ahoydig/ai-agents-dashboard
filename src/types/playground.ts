import type { ChatMessage, ToolCall } from "./database";

export type Scenario = "happy_path" | "edge_case" | "expected_error" | "regression";

export interface TestSession {
  id: string;
  name: string;
  scenario?: Scenario;
  tags: string[];
  notes?: string;
  agent_identifier: string;
  config: PlaygroundConfig;
  timeline: PlaygroundMessage[];
  github_issue_url?: string;
  created_at: string;
  updated_at: string;
}

export interface AgentConfig {
  id: string;
  agent_identifier: string;
  name: string;
  description?: string;
  api_endpoint: string;
  default_model: string;
  default_system_prompt?: string;
  default_temperature: number;
  status: "active" | "paused" | "error";
  created_at: string;
  updated_at: string;
}

export interface PlaygroundConfig {
  agentIdentifier: string;
  model: string;
  systemPrompt: string;
  temperature: number;
  maxTokens?: number;
  patientContext: Record<string, unknown>;
  crmContext: Record<string, unknown>;
  chatHistory: ChatMessage[];
}

export interface PlaygroundMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  metrics?: {
    tokensIn: number;
    tokensOut: number;
    cost: number;
    latency: number;
  };
  toolCalls?: ToolCall[];
  error?: string;
}

export interface ExecutionLog {
  id: string;
  type:
    | "context"
    | "guardrail_input"
    | "tool"
    | "llm"
    | "guardrail_output"
    | "complete"
    | "error";
  message: string;
  latencyMs?: number;
  status: "pending" | "success" | "error";
  details?: Record<string, unknown>;
  timestamp: string;
}

export interface PlaygroundState {
  // Config
  config: PlaygroundConfig;
  // Messages
  messages: PlaygroundMessage[];
  logs: ExecutionLog[];
  // Status
  isExecuting: boolean;
  error: string | null;
}

export const AVAILABLE_MODELS = [
  { value: "gpt-4", label: "GPT-4" },
  { value: "gpt-4-turbo", label: "GPT-4 Turbo" },
  { value: "gpt-4o", label: "GPT-4o" },
  { value: "gpt-4o-mini", label: "GPT-4o Mini" },
  { value: "gpt-3.5-turbo", label: "GPT-3.5 Turbo" },
  { value: "claude-3-opus", label: "Claude 3 Opus" },
  { value: "claude-3-sonnet", label: "Claude 3 Sonnet" },
  { value: "claude-3-haiku", label: "Claude 3 Haiku" },
] as const;

export const SCENARIO_OPTIONS = [
  { value: "happy_path", label: "Happy Path" },
  { value: "edge_case", label: "Edge Case" },
  { value: "expected_error", label: "Erro Esperado" },
  { value: "regression", label: "Regressão" },
] as const;
