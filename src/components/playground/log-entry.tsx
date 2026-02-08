"use client";

import {
  Database,
  Shield,
  Wrench,
  Brain,
  ShieldCheck,
  CheckCircle,
  AlertTriangle,
  Clock,
  SkipForward,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { JsonViewer } from "@/components/ui/json-viewer";
import { useState } from "react";
import type { ExecutionLogEntry } from "@/types/playground";

interface LogEntryProps {
  log: ExecutionLogEntry;
  isLast?: boolean;
}

const stepConfig: Record<
  ExecutionLogEntry["step"],
  {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    color: string;
  }
> = {
  context: {
    icon: Database,
    label: "Context",
    color: "text-blue-500",
  },
  guardrail_input: {
    icon: Shield,
    label: "Input Guard",
    color: "text-yellow-500",
  },
  tool: {
    icon: Wrench,
    label: "Tool",
    color: "text-purple-500",
  },
  llm: {
    icon: Brain,
    label: "LLM",
    color: "text-green-500",
  },
  guardrail_output: {
    icon: ShieldCheck,
    label: "Output Guard",
    color: "text-yellow-500",
  },
  complete: {
    icon: CheckCircle,
    label: "Complete",
    color: "text-green-500",
  },
  error: {
    icon: AlertTriangle,
    label: "Error",
    color: "text-destructive",
  },
};

const statusIcons: Record<
  ExecutionLogEntry["status"],
  React.ComponentType<{ className?: string }>
> = {
  pending: Clock,
  success: CheckCircle,
  error: AlertTriangle,
  skipped: SkipForward,
};

const statusColors: Record<ExecutionLogEntry["status"], string> = {
  pending: "text-muted-foreground",
  success: "text-green-500",
  error: "text-destructive",
  skipped: "text-muted-foreground",
};

export function LogEntry({ log, isLast = false }: LogEntryProps) {
  const [isOpen, setIsOpen] = useState(false);
  const config = stepConfig[log.step];
  const StepIcon = config.icon;
  const StatusIcon = statusIcons[log.status];
  const hasDetails = log.details && Object.keys(log.details).length > 0;

  return (
    <div className="relative">
      {/* Timeline line */}
      {!isLast && (
        <div className="absolute left-[11px] top-6 bottom-0 w-0.5 bg-border" />
      )}

      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger
          className={cn(
            "flex items-start gap-3 w-full text-left p-1 rounded-md transition-colors",
            hasDetails && "hover:bg-muted/50 cursor-pointer",
            !hasDetails && "cursor-default"
          )}
          disabled={!hasDetails}
        >
          {/* Step icon */}
          <div
            className={cn(
              "flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center bg-background border",
              log.status === "error" && "border-destructive",
              log.status === "success" && "border-green-500/50",
              log.status === "pending" && "border-muted-foreground",
              log.status === "skipped" && "border-muted"
            )}
          >
            <StepIcon className={cn("h-3 w-3", config.color)} />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{log.message}</span>
              {hasDetails && (
                <span className="text-xs text-muted-foreground">
                  {isOpen ? "▼" : "▶"}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <StatusIcon className={cn("h-3 w-3", statusColors[log.status])} />
              <span
                className={cn(
                  "text-xs capitalize",
                  statusColors[log.status]
                )}
              >
                {log.status}
              </span>
              {log.duration_ms > 0 && (
                <>
                  <span className="text-xs text-muted-foreground">•</span>
                  <span className="text-xs text-muted-foreground">
                    {log.duration_ms >= 1000
                      ? `${(log.duration_ms / 1000).toFixed(2)}s`
                      : `${log.duration_ms}ms`}
                  </span>
                </>
              )}
            </div>
          </div>
        </CollapsibleTrigger>

        {hasDetails && (
          <CollapsibleContent className="ml-9 mt-2 mb-3">
            <div className="p-2 bg-muted/30 rounded-md border text-xs">
              <JsonViewer data={log.details!} defaultExpanded={true} showCopy={false} />
            </div>
          </CollapsibleContent>
        )}
      </Collapsible>
    </div>
  );
}
