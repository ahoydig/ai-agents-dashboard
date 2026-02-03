"use client";

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { ConversationSession } from "@/types/database";

export function useSessions(phone?: string, limit = 20) {
  return useQuery<ConversationSession[]>({
    queryKey: ["sessions", phone, limit],
    queryFn: async () => {
      let query = supabase
        .schema("centerfisio")
        .from("conversation_sessions")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(limit);

      if (phone) {
        query = query.eq("phone_number", phone);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as ConversationSession[];
    },
    enabled: !!phone,
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
