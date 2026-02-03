"use client";

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { AgentTurn } from "@/types/database";

export function useAgentTurns(phone?: string, limit = 20) {
  return useQuery<AgentTurn[]>({
    queryKey: ["agent-turns", phone, limit],
    queryFn: async () => {
      let query = supabase
        .schema("centerfisio")
        .from("agent_turns")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(limit);

      if (phone) {
        query = query.eq("phone_number", phone);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as AgentTurn[];
    },
    enabled: !!phone,
  });
}

export function useAgentTurn(id: string) {
  return useQuery<AgentTurn>({
    queryKey: ["agent-turn", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .schema("centerfisio")
        .from("agent_turns")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data as AgentTurn;
    },
    enabled: !!id,
  });
}
