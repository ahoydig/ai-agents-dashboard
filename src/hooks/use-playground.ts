"use client";

import { useMutation } from "@tanstack/react-query";
import type { ReplayRequest, ReplayResponse } from "@/types/replay";

async function executePlayground(request: ReplayRequest): Promise<ReplayResponse> {
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
