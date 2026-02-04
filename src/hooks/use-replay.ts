"use client";

import { useMutation } from "@tanstack/react-query";
import type { ReplayRequest, ReplayResponse } from "@/types/replay";

async function executeReplay(request: ReplayRequest): Promise<ReplayResponse> {
  const response = await fetch("/api/replay", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Replay failed");
  }

  return response.json();
}

export function useReplay() {
  return useMutation({
    mutationFn: executeReplay,
  });
}
