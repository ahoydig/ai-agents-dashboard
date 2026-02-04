"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { FileText } from "lucide-react";

interface EditableSystemPromptProps {
  value: string;
  onChange: (value: string) => void;
}

export function EditableSystemPrompt({
  value,
  onChange,
}: EditableSystemPromptProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <FileText className="h-4 w-4" />
          System Prompt
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="font-mono text-xs h-[300px]"
          placeholder="System prompt..."
        />
      </CardContent>
    </Card>
  );
}
