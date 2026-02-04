"use client";

import { useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TimelineMessage } from "./timeline-message";
import type { AgentTurn } from "@/types/database";

interface SessionTimelineProps {
  turns?: AgentTurn[];
  isLoading?: boolean;
}

export function SessionTimeline({ turns, isLoading }: SessionTimelineProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when turns change
  useEffect(() => {
    if (scrollRef.current && turns && turns.length > 0) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [turns]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Timeline da Conversa</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-20 w-3/4" />
                <Skeleton className="h-20 w-3/4 ml-auto" />
              </div>
            ))}
          </div>
        ) : !turns || turns.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground">
            Nenhuma mensagem encontrada
          </div>
        ) : (
          <ScrollArea className="h-[600px]" ref={scrollRef}>
            <div className="space-y-6 pr-4">
              {turns.map((turn) => (
                <TimelineMessage key={turn.id} turn={turn} />
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
