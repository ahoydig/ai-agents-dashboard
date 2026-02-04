"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Wrench } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ToolCallItem } from "./tool-call-item";
import type { ToolCall } from "@/types/database";

interface ToolCallsListProps {
  toolCalls: ToolCall[];
}

export function ToolCallsList({ toolCalls }: ToolCallsListProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  if (toolCalls.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Wrench className="h-4 w-4" />
            Tool Calls (0)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Nenhuma tool call neste turn
          </p>
        </CardContent>
      </Card>
    );
  }

  const totalLatency = toolCalls.reduce((sum, tc) => sum + tc.latency_ms, 0);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <Wrench className="h-4 w-4" />
          Tool Calls ({toolCalls.length})
          <span className="text-sm font-normal text-muted-foreground">
            | {totalLatency}ms total
          </span>
        </CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? (
            <>
              <ChevronUp className="h-4 w-4 mr-1" />
              Colapsar
            </>
          ) : (
            <>
              <ChevronDown className="h-4 w-4 mr-1" />
              Expandir
            </>
          )}
        </Button>
      </CardHeader>
      {isExpanded && (
        <CardContent>
          <div className="space-y-2">
            {toolCalls.map((toolCall, index) => (
              <ToolCallItem key={toolCall.tool_call_id || index} toolCall={toolCall} />
            ))}
          </div>
        </CardContent>
      )}
    </Card>
  );
}
