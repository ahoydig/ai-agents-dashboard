"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { TestSession, Scenario } from "@/types/playground";

interface TestSessionsFilters {
  agentIdentifier?: string;
  scenario?: Scenario;
  tags?: string[];
}

export function useTestSessions(filters: TestSessionsFilters = {}) {
  return useQuery<TestSession[]>({
    queryKey: ["test-sessions", filters],
    queryFn: async () => {
      let query = supabase
        .schema("centerfisio")
        .from("test_sessions")
        .select("*")
        .order("updated_at", { ascending: false });

      if (filters.agentIdentifier) {
        query = query.eq("agent_identifier", filters.agentIdentifier);
      }

      if (filters.scenario) {
        query = query.eq("scenario", filters.scenario);
      }

      if (filters.tags && filters.tags.length > 0) {
        query = query.contains("tags", filters.tags);
      }

      const { data, error } = await query;

      if (error) {
        // Table might not exist yet
        if (error.code === "42P01") {
          return [];
        }
        throw error;
      }
      return (data ?? []) as TestSession[];
    },
  });
}

export function useTestSession(id: string) {
  return useQuery<TestSession | null>({
    queryKey: ["test-session", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .schema("centerfisio")
        .from("test_sessions")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        if (error.code === "PGRST116" || error.code === "42P01") {
          return null;
        }
        throw error;
      }
      return data as TestSession;
    },
    enabled: !!id,
  });
}

export function useCreateTestSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      session: Omit<TestSession, "id" | "created_at" | "updated_at">
    ) => {
      const { data, error } = await supabase
        .schema("centerfisio")
        .from("test_sessions")
        .insert(session)
        .select()
        .single();

      if (error) throw error;
      return data as TestSession;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["test-sessions"] });
    },
  });
}

export function useUpdateTestSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      ...updates
    }: Partial<TestSession> & { id: string }) => {
      const { data, error } = await supabase
        .schema("centerfisio")
        .from("test_sessions")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data as TestSession;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["test-sessions"] });
      queryClient.invalidateQueries({ queryKey: ["test-session", data.id] });
    },
  });
}

export function useDeleteTestSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .schema("centerfisio")
        .from("test_sessions")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["test-sessions"] });
    },
  });
}
