"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, Check, X, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { JsonViewer } from "@/components/ui/json-viewer";
import { cn } from "@/lib/utils";
import type { ToolCall } from "@/types/database";

interface ToolCallItemProps {
  toolCall: ToolCall;
}

export function ToolCallItem({ toolCall }: ToolCallItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const isSuccess = toolCall.result !== null && toolCall.result !== undefined;

  return (
    <div className="border rounded-lg overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-3 hover:bg-muted/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          {isExpanded ? (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          )}
          <span className="font-mono text-sm font-medium">{toolCall.name}</span>
          {isSuccess ? (
            <Check className="h-4 w-4 text-green-500" />
          ) : (
            <X className="h-4 w-4 text-red-500" />
          )}
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            <Clock className="h-3 w-3 mr-1" />
            {toolCall.latency_ms}ms
          </Badge>
        </div>
      </button>

      {isExpanded && (
        <div className="border-t p-3 space-y-4">
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2">
              Argumentos
            </p>
            <JsonViewer
              data={toolCall.args}
              defaultExpanded={true}
              maxDepth={3}
            />
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2">
              Resultado
            </p>
            {toolCall.result !== null && toolCall.result !== undefined ? (
              <JsonViewer
                data={toolCall.result}
                defaultExpanded={false}
                maxDepth={3}
              />
            ) : (
              <p className="text-sm text-muted-foreground italic">Sem resultado</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
