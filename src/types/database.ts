// Auto-generated types for Supabase tables
// Run: npx supabase gen types typescript --project-id <project-id> > src/types/database.ts

export interface Database {
  centerfisio: {
    Tables: {
      agent_turns: {
        Row: AgentTurn;
        Insert: Omit<AgentTurn, "id" | "created_at" | "updated_at">;
        Update: Partial<AgentTurn>;
      };
      conversation_sessions: {
        Row: ConversationSession;
        Insert: Omit<ConversationSession, "id" | "created_at" | "updated_at">;
        Update: Partial<ConversationSession>;
      };
    };
  };
}

export interface AgentTurn {
  id: string;
  session_id: string | null;
  agent_execution_id: string | null;
  phone_number: string;
  turn_number: number;
  agent_type: string;
  agent_identifier: string;
  routing_reason: string | null;
  raw_webhook_payload: Record<string, unknown> | null;
  patient_context_snapshot: Record<string, unknown> | null;
  crm_context_snapshot: Record<string, unknown> | null;
  system_prompt: string | null;
  chat_history: ChatMessage[];
  stage_at_turn: string | null;
  qualification_data: Record<string, unknown> | null;
  user_message: string;
  assistant_response: string | null;
  output_structured: Record<string, unknown> | null;
  final_response: string | null;
  message_chain: MessageChainItem[];
  tool_calls: ToolCall[];
  model_used: string | null;
  tokens_input: number;
  tokens_output: number;
  cost_usd: number | null;
  fallback_attempts: FallbackAttempt[] | null;
  latency_context_ms: number | null;
  latency_guardrail_input_ms: number | null;
  latency_agent_ms: number | null;
  latency_guardrail_output_ms: number | null;
  latency_total_ms: number | null;
  guardrail_input_safe: boolean;
  guardrail_input_reason: string | null;
  guardrail_input_model: string | null;
  guardrail_output_safe: boolean;
  guardrail_output_reason: string | null;
  guardrail_output_model: string | null;
  guardrail_output_sanitized: boolean;
  status: "success" | "error" | "input_blocked" | "output_blocked";
  error_message: string | null;
  error_traceback: string | null;
  created_at: string;
  updated_at: string;
}

export interface ConversationSession {
  id: string;
  phone_number: string;
  started_at: string | null;
  ended_at: string | null;
  message_count: number;
  total_tokens: number;
  agents_used: string[];
  pipeline_stage_start: string | null;
  pipeline_stage_end: string | null;
  outcome: string | null;
  escalated: boolean;
  escalation_reason: string | null;
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface MessageChainItem {
  role: string;
  content?: string;
  tool_calls?: ToolCallReference[];
  tool_result?: unknown;
}

export interface ToolCall {
  name: string;
  args: Record<string, unknown>;
  result: unknown;
  latency_ms: number;
  tool_call_id: string;
}

export interface ToolCallReference {
  id: string;
  name: string;
  arguments: string;
}

export interface FallbackAttempt {
  model: string;
  error: string;
  latency_ms: number;
}
