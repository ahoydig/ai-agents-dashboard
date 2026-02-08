"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FileText, Edit, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

interface EditableSystemPromptProps {
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
}

export function EditableSystemPrompt({
  value,
  onChange,
  readOnly = false,
}: EditableSystemPromptProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between text-base">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            System Prompt
          </div>
          {readOnly ? (
            <div className="flex items-center gap-1 text-xs text-muted-foreground font-normal">
              <Lock className="h-3 w-3" />
              Padrão do agente
            </div>
          ) : (
            <div className="flex items-center gap-1 text-xs text-muted-foreground font-normal">
              <Edit className="h-3 w-3" />
              Editável
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={cn(
            "font-mono text-xs h-[300px]",
            readOnly && "bg-muted/50 cursor-not-allowed"
          )}
          placeholder="System prompt..."
          readOnly={readOnly}
        />
        {readOnly && value && (
          <Button
            variant="outline"
            size="sm"
            className="mt-2"
            onClick={() => onChange(value)}
          >
            <Edit className="h-3 w-3 mr-1" />
            Editar para personalizar
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
