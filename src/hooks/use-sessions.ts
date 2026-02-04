"use client";

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { ConversationSession, AgentTurn } from "@/types/database";

export interface SessionsFilters {
  phone?: string;
  status?: "all" | "success" | "error" | "blocked";
  agentIdentifier?: string;
  dateFrom?: Date;
  dateTo?: Date;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export function useSessions(
  filters: SessionsFilters = {},
  page: number = 1,
  pageSize: number = 20
) {
  return useQuery<PaginatedResult<ConversationSession>>({
    queryKey: ["sessions", filters, page, pageSize],
    queryFn: async () => {
      let query = supabase
        .schema("centerfisio")
        .from("conversation_sessions")
        .select("*", { count: "exact" });

      // Apply filters
      if (filters.phone) {
        query = query.ilike("phone_number", `%${filters.phone}%`);
      }

      if (filters.agentIdentifier) {
        query = query.contains("agents_used", [filters.agentIdentifier]);
      }

      if (filters.dateFrom) {
        query = query.gte("created_at", filters.dateFrom.toISOString());
      }

      if (filters.dateTo) {
        query = query.lte("created_at", filters.dateTo.toISOString());
      }

      // Apply pagination
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      query = query
        .order("created_at", { ascending: false })
        .range(from, to);

      const { data, count, error } = await query;

      if (error) throw error;

      return {
        data: (data ?? []) as ConversationSession[],
        total: count ?? 0,
        page,
        pageSize,
        totalPages: Math.ceil((count ?? 0) / pageSize),
      };
    },
  });
}

export function useSession(id: string) {
  return useQuery<ConversationSession>({
    queryKey: ["session", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .schema("centerfisio")
        .from("conversation_sessions")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data as ConversationSession;
    },
    enabled: !!id,
  });
}

export function useSessionTurns(sessionId: string) {
  return useQuery<AgentTurn[]>({
    queryKey: ["session-turns", sessionId],
    queryFn: async () => {
      const { data, error } = await supabase
        .schema("centerfisio")
        .from("agent_turns")
        .select("*")
        .eq("session_id", sessionId)
        .order("turn_number", { ascending: true });

      if (error) throw error;
      return (data ?? []) as AgentTurn[];
    },
    enabled: !!sessionId,
  });
}

export function useDiscoveredAgents() {
  return useQuery<string[]>({
    queryKey: ["discovered-agents"],
    queryFn: async () => {
      const { data, error } = await supabase
        .schema("centerfisio")
        .from("agent_turns")
        .select("agent_identifier")
        .limit(1000);

      if (error) throw error;

      const agents = new Set<string>();
      for (const turn of data ?? []) {
        if (turn.agent_identifier) {
          agents.add(turn.agent_identifier);
        }
      }
      return Array.from(agents).sort();
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
}
