"use client";

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { RecentError } from "@/types/metrics";

export function useRecentErrors(limit: number = 5, agentIdentifier?: string) {
  return useQuery<RecentError[]>({
    queryKey: ["recent-errors", limit, agentIdentifier],
    queryFn: async () => {
      let query = supabase
        .schema("centerfisio")
        .from("agent_turns")
        .select("id, phone_number, agent_identifier, error_message, created_at, session_id")
        .eq("status", "error")
        .not("error_message", "is", null)
        .order("created_at", { ascending: false })
        .limit(limit);

      if (agentIdentifier) {
        query = query.eq("agent_identifier", agentIdentifier);
      }

      const { data, error } = await query;
      if (error) throw error;

      return (data ?? []) as RecentError[];
    },
    refetchInterval: 30000,
  });
}
