"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/ui/copy-button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface SystemPromptViewerProps {
  systemPrompt: string;
}

export function SystemPromptViewer({ systemPrompt }: SystemPromptViewerProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <FileText className="h-4 w-4" />
          System Prompt
        </CardTitle>
        <div className="flex items-center gap-2">
          <CopyButton value={systemPrompt} />
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
        </div>
      </CardHeader>
      {isExpanded && (
        <CardContent>
          <ScrollArea className="h-[300px]">
            <pre className="text-xs font-mono whitespace-pre-wrap p-3 rounded-lg bg-muted">
              {systemPrompt}
            </pre>
          </ScrollArea>
        </CardContent>
      )}
    </Card>
  );
}
