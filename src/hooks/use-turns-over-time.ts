"use client";

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { TurnsOverTime, Period } from "@/types/metrics";
import { startOfHour, startOfDay, format, subHours, subDays } from "date-fns";

function getTimeSlots(period: Period): { slots: Date[]; formatStr: string } {
  const now = new Date();
  const slots: Date[] = [];

  switch (period) {
    case "24h":
      // Hourly for last 24 hours
      for (let i = 23; i >= 0; i--) {
        slots.push(startOfHour(subHours(now, i)));
      }
      return { slots, formatStr: "HH:mm" };
    case "7d":
      // Daily for last 7 days
      for (let i = 6; i >= 0; i--) {
        slots.push(startOfDay(subDays(now, i)));
      }
      return { slots, formatStr: "EEE" };
    case "30d":
      // Daily for last 30 days
      for (let i = 29; i >= 0; i--) {
        slots.push(startOfDay(subDays(now, i)));
      }
      return { slots, formatStr: "dd/MM" };
  }
}

export function useTurnsOverTime(period: Period = "24h", agentIdentifier?: string) {
  return useQuery<TurnsOverTime[]>({
    queryKey: ["turns-over-time", period, agentIdentifier],
    queryFn: async () => {
      const { slots, formatStr } = getTimeSlots(period);
      const since = slots[0]?.toISOString() ?? new Date().toISOString();

      let query = supabase
        .schema("centerfisio")
        .from("agent_turns")
        .select("created_at, status")
        .gte("created_at", since)
        .order("created_at", { ascending: true });

      if (agentIdentifier) {
        query = query.eq("agent_identifier", agentIdentifier);
      }

      const { data, error } = await query;
      if (error) throw error;

      // Group by time slot
      const grouped = new Map<string, { count: number; errors: number }>();

      for (const slot of slots) {
        const key = format(slot, formatStr);
        grouped.set(key, { count: 0, errors: 0 });
      }

      for (const turn of data ?? []) {
        const turnDate = new Date(turn.created_at);
        let slot: Date;

        if (period === "24h") {
          slot = startOfHour(turnDate);
        } else {
          slot = startOfDay(turnDate);
        }

        const key = format(slot, formatStr);
        const current = grouped.get(key);
        if (current) {
          current.count++;
          if (turn.status === "error") {
            current.errors++;
          }
        }
      }

      return Array.from(grouped.entries()).map(([timestamp, { count, errors }]) => ({
        timestamp,
        count,
        errors,
      }));
    },
    refetchInterval: 30000,
  });
}
