"use client";

import { useRef, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage } from "./chat-message";
import { EmptyState } from "@/components/ui/empty-state";
import { MessageSquare } from "lucide-react";
import type { PlaygroundMessage } from "@/types/playground";

interface ChatTimelineProps {
  messages: PlaygroundMessage[];
}

export function ChatTimeline({ messages }: ChatTimelineProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  if (messages.length === 0) {
    return (
      <EmptyState
        icon={MessageSquare}
        title="Nenhuma mensagem"
        description="Digite uma mensagem para iniciar a conversa"
        className="h-full"
      />
    );
  }

  return (
    <ScrollArea className="h-full" ref={scrollRef}>
      <div className="space-y-4 p-4">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
      </div>
    </ScrollArea>
  );
}
