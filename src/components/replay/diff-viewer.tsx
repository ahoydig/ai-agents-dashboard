"use client";

import { useMemo } from "react";
import { diff_match_patch } from "diff-match-patch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface DiffViewerProps {
  original: string;
  replay: string;
  className?: string;
}

export function DiffViewer({ original, replay, className }: DiffViewerProps) {
  const { diffHtml, diffPercentage } = useMemo(() => {
    const dmp = new diff_match_patch();
    const diffs = dmp.diff_main(original, replay);
    dmp.diff_cleanupSemantic(diffs);

    let totalChars = 0;
    let changedChars = 0;

    const html = diffs
      .map(([operation, text]) => {
        totalChars += text.length;
        if (operation === -1) {
          changedChars += text.length;
          return `<span class="bg-red-500/30 line-through">${escapeHtml(text)}</span>`;
        }
        if (operation === 1) {
          changedChars += text.length;
          return `<span class="bg-green-500/30">${escapeHtml(text)}</span>`;
        }
        return escapeHtml(text);
      })
      .join("");

    const percentage = totalChars > 0 ? (changedChars / totalChars) * 100 : 0;

    return { diffHtml: html, diffPercentage: percentage };
  }, [original, replay]);

  const isSignificant = diffPercentage > 10;

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          Comparação (Diff)
        </CardTitle>
        <div className="flex items-center gap-2">
          {isSignificant ? (
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          ) : (
            <Check className="h-4 w-4 text-green-500" />
          )}
          <Badge variant={isSignificant ? "secondary" : "outline"}>
            {diffPercentage.toFixed(1)}% diferença
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {diffPercentage === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            As respostas são idênticas
          </p>
        ) : (
          <div
            className="p-3 rounded-lg bg-muted text-sm whitespace-pre-wrap font-mono"
            dangerouslySetInnerHTML={{ __html: diffHtml }}
          />
        )}
        <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded bg-red-500/30" />
            <span>Removido</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded bg-green-500/30" />
            <span>Adicionado</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function calculateDiffPercentage(original: string, replay: string): number {
  const dmp = new diff_match_patch();
  const diffs = dmp.diff_main(original, replay);

  let totalChars = 0;
  let changedChars = 0;

  for (const [operation, text] of diffs) {
    totalChars += text.length;
    if (operation !== 0) {
      changedChars += text.length;
    }
  }

  return totalChars > 0 ? (changedChars / totalChars) * 100 : 0;
}
