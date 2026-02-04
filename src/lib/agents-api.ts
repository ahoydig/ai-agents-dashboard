import type { ReplayRequest, ReplayResponse } from "@/types/replay";

const AGENTS_API_URL = process.env.NEXT_PUBLIC_AGENTS_API_URL || process.env.AGENTS_API_URL;

export async function executeReplay(request: ReplayRequest): Promise<ReplayResponse> {
  if (!AGENTS_API_URL) {
    throw new Error("AGENTS_API_URL is not configured");
  }

  const response = await fetch(`${AGENTS_API_URL}/replay`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Replay failed: ${error}`);
  }

  return response.json();
}

export async function executePlayground(request: ReplayRequest): Promise<ReplayResponse> {
  if (!AGENTS_API_URL) {
    throw new Error("AGENTS_API_URL is not configured");
  }

  const response = await fetch(`${AGENTS_API_URL}/playground/execute`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Playground execution failed: ${error}`);
  }

  return response.json();
}
