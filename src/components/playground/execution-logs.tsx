"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { LogEntry } from "./log-entry";
import type { ExecutionLogEntry } from "@/types/playground";

interface ExecutionLogsProps {
  logs: ExecutionLogEntry[];
  className?: string;
  defaultExpanded?: boolean;
}

export function ExecutionLogs({
  logs,
  className,
  defaultExpanded = false,
}: ExecutionLogsProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  if (!logs || logs.length === 0) {
    return null;
  }

  const totalDuration = logs.reduce((sum, log) => sum + (log.duration_ms || 0), 0);
  const hasErrors = logs.some((log) => log.status === "error");
  const successCount = logs.filter((log) => log.status === "success").length;
  const toolCalls = logs.filter((log) => log.step === "tool");

  return (
    <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
      <CollapsibleTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "w-full justify-between h-auto py-2 px-3 mt-2",
            "bg-muted/30 hover:bg-muted/50 border border-border/50",
            hasErrors && "border-destructive/30 bg-destructive/5",
            className
          )}
        >
          <div className="flex items-center gap-2">
            <Activity className={cn("h-4 w-4", hasErrors ? "text-destructive" : "text-muted-foreground")} />
            <span className="text-xs font-medium">
              Execution Logs ({logs.length} steps)
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            {toolCalls.length > 0 && (
              <span>{toolCalls.length} tool{toolCalls.length !== 1 ? "s" : ""}</span>
            )}
            <span
              className={cn(
                hasErrors ? "text-destructive" : "text-green-500"
              )}
            >
              {successCount}/{logs.length} ok
            </span>
            <span>
              {totalDuration >= 1000
                ? `${(totalDuration / 1000).toFixed(2)}s`
                : `${totalDuration}ms`}
            </span>
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </div>
        </Button>
      </CollapsibleTrigger>

      <CollapsibleContent>
        <div className="mt-2 p-3 bg-muted/20 rounded-md border border-border/50 space-y-1">
          {logs.map((log, index) => (
            <LogEntry
              key={`${log.step}-${index}`}
              log={log}
              isLast={index === logs.length - 1}
            />
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
