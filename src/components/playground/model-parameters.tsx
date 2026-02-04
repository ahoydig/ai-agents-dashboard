"use client";

import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ModelParametersProps {
  temperature: number;
  maxTokens?: number;
  onTemperatureChange: (value: number) => void;
  onMaxTokensChange: (value: number | undefined) => void;
}

export function ModelParameters({
  temperature,
  maxTokens,
  onTemperatureChange,
  onMaxTokensChange,
}: ModelParametersProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Temperatura</Label>
          <span className="text-sm text-muted-foreground">
            {temperature.toFixed(1)}
          </span>
        </div>
        <Slider
          value={[temperature]}
          onValueChange={([v]) => v !== undefined && onTemperatureChange(v)}
          min={0}
          max={2}
          step={0.1}
        />
        <p className="text-xs text-muted-foreground">
          Valores mais altos = mais criatividade, valores mais baixos = mais
          determinístico
        </p>
      </div>

      <div className="space-y-2">
        <Label>Max Tokens (opcional)</Label>
        <Input
          type="number"
          value={maxTokens ?? ""}
          onChange={(e) =>
            onMaxTokensChange(
              e.target.value ? parseInt(e.target.value, 10) : undefined
            )
          }
          placeholder="Limite de tokens de resposta"
          min={1}
          max={4096}
        />
      </div>
    </div>
  );
}
