"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { AVAILABLE_MODELS, type PlaygroundConfig } from "@/types/playground";

interface ConfigOverridesProps {
  config: PlaygroundConfig;
  onConfigChange: (updates: Partial<PlaygroundConfig>) => void;
  disabled?: boolean;
}

export function ConfigOverrides({
  config,
  onConfigChange,
  disabled,
}: ConfigOverridesProps) {
  const updateConfig = (updates: Partial<PlaygroundConfig>) => {
    onConfigChange(updates);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium">Overrides para Teste</h4>
        <span className="text-xs text-muted-foreground">
          (opcional - ignora padrões do agente)
        </span>
      </div>

      <Separator />

      {/* Model Override */}
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="model-override"
            checked={config.useModelOverride}
            onCheckedChange={(checked) =>
              updateConfig({ useModelOverride: checked as boolean })
            }
            disabled={disabled}
          />
          <Label
            htmlFor="model-override"
            className="text-sm font-normal cursor-pointer"
          >
            Usar outro modelo
          </Label>
        </div>

        {config.useModelOverride && (
          <Select
            value={config.model}
            onValueChange={(v) => updateConfig({ model: v })}
            disabled={disabled}
          >
            <SelectTrigger className={cn("ml-6", !config.useModelOverride && "opacity-50")}>
              <SelectValue placeholder="Selecione um modelo" />
            </SelectTrigger>
            <SelectContent>
              {AVAILABLE_MODELS.map((model) => (
                <SelectItem key={model.value} value={model.value}>
                  {model.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {/* Temperature Override */}
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="temp-override"
            checked={config.useTemperatureOverride}
            onCheckedChange={(checked) =>
              updateConfig({ useTemperatureOverride: checked as boolean })
            }
            disabled={disabled}
          />
          <Label
            htmlFor="temp-override"
            className="text-sm font-normal cursor-pointer"
          >
            Mudar temperatura
          </Label>
        </div>

        {config.useTemperatureOverride && (
          <div className="ml-6 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Temperatura</span>
              <span className="text-xs font-mono bg-muted px-2 py-0.5 rounded">
                {config.temperature.toFixed(2)}
              </span>
            </div>
            <Slider
              value={[config.temperature]}
              onValueChange={([v]) => updateConfig({ temperature: v })}
              min={0}
              max={2}
              step={0.05}
              disabled={disabled}
              className={cn(!config.useTemperatureOverride && "opacity-50")}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Preciso</span>
              <span>Criativo</span>
            </div>
          </div>
        )}
      </div>

      {/* System Prompt Override - hint only */}
      <div className="text-xs text-muted-foreground bg-muted/30 p-2 rounded">
        Para editar o system prompt, use a aba &quot;Prompt&quot; acima.
        O prompt do agente será usado por padrão.
      </div>
    </div>
  );
}
