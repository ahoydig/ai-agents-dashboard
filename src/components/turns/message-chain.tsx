"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { JsonViewer } from "@/components/ui/json-viewer";
import { MessageSquare } from "lucide-react";
import type { MessageChainItem } from "@/types/database";

interface MessageChainProps {
  chain: MessageChainItem[];
}

export function MessageChain({ chain }: MessageChainProps) {
  if (chain.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <MessageSquare className="h-4 w-4" />
          Message Chain ({chain.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <JsonViewer
          data={chain}
          defaultExpanded={false}
          maxDepth={4}
          className="max-h-[400px] overflow-auto"
        />
      </CardContent>
    </Card>
  );
}
