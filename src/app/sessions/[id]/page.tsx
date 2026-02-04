"use client";

import { use } from "react";
import { SessionHeader } from "@/components/sessions/session-header";
import { SessionTimeline } from "@/components/sessions/session-timeline";
import { useSession, useSessionTurns } from "@/hooks/use-sessions";

interface SessionDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function SessionDetailPage({ params }: SessionDetailPageProps) {
  const { id } = use(params);
  const { data: session, isLoading: sessionLoading } = useSession(id);
  const { data: turns, isLoading: turnsLoading } = useSessionTurns(id);

  // Calculate total cost from turns
  const totalCost =
    turns?.reduce((sum, turn) => sum + (turn.cost_usd ?? 0), 0) ?? 0;

  return (
    <div className="space-y-6">
      <SessionHeader
        session={session}
        isLoading={sessionLoading}
        totalCost={totalCost}
      />
      <SessionTimeline turns={turns} isLoading={turnsLoading} />
    </div>
  );
}
