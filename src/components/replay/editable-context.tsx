"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Check, AlertTriangle } from "lucide-react";

interface EditableContextProps {
  title: string;
  value: Record<string, unknown>;
  onChange: (value: Record<string, unknown>) => void;
  icon?: React.ReactNode;
}

export function EditableContext({
  title,
  value,
  onChange,
  icon,
}: EditableContextProps) {
  const [text, setText] = useState(() => JSON.stringify(value, null, 2));
  const [error, setError] = useState<string | null>(null);
  const [isValid, setIsValid] = useState(true);

  const handleTextChange = (newText: string) => {
    setText(newText);
    try {
      const parsed = JSON.parse(newText);
      setError(null);
      setIsValid(true);
      onChange(parsed);
    } catch {
      setError("JSON inválido");
      setIsValid(false);
    }
  };

  const handleFormat = () => {
    try {
      const parsed = JSON.parse(text);
      setText(JSON.stringify(parsed, null, 2));
      setError(null);
      setIsValid(true);
    } catch {
      setError("Não foi possível formatar: JSON inválido");
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          {icon}
          {title}
          {isValid ? (
            <Check className="h-4 w-4 text-green-500" />
          ) : (
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          )}
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={handleFormat}>
          Formatar
        </Button>
      </CardHeader>
      <CardContent>
        <Textarea
          value={text}
          onChange={(e) => handleTextChange(e.target.value)}
          className="font-mono text-xs h-[200px]"
        />
        {error && (
          <Alert variant="destructive" className="mt-2">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
