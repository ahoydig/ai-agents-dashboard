"use client";

import { useMutation } from "@tanstack/react-query";
import type { ReplayRequest, ReplayResponse } from "@/types/replay";
import type { PlaygroundConfig } from "@/types/playground";

export interface PlaygroundExecuteRequest {
  system_prompt: string;
  chat_history: { role: "user" | "assistant" | "system"; content: string }[];
  user_message: string;
  patient_context: Record<string, unknown>;
  crm_context: Record<string, unknown>;
  model: string;
  temperature: number;
  agent_identifier: string;
  // Override flags - send only if overriding agent defaults
  model_override?: string;
  temperature_override?: number;
  system_prompt_override?: string;
}

export function buildPlaygroundRequest(
  config: PlaygroundConfig,
  userMessage: string
): PlaygroundExecuteRequest {
  const request: PlaygroundExecuteRequest = {
    system_prompt: config.systemPrompt,
    chat_history: config.chatHistory,
    user_message: userMessage,
    patient_context: config.patientContext,
    crm_context: config.crmContext,
    model: config.model,
    temperature: config.temperature,
    agent_identifier: config.agentIdentifier,
  };

  // Add overrides only if explicitly set
  if (config.useModelOverride) {
    request.model_override = config.model;
  }

  if (config.useTemperatureOverride) {
    request.temperature_override = config.temperature;
  }

  if (config.useSystemPromptOverride) {
    request.system_prompt_override = config.systemPrompt;
  }

  return request;
}

async function executePlayground(request: ReplayRequest | PlaygroundExecuteRequest): Promise<ReplayResponse> {
  const response = await fetch("/api/playground/execute", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Execution failed");
  }

  return response.json();
}

export function usePlayground() {
  return useMutation({
    mutationFn: executePlayground,
  });
}
