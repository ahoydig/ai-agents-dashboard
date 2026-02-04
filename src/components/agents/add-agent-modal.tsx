"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AVAILABLE_MODELS } from "@/types/playground";

interface AddAgentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: {
    agent_identifier: string;
    name: string;
    description?: string;
    api_endpoint: string;
    default_model: string;
    default_system_prompt?: string;
    default_temperature: number;
    status: "active" | "paused" | "error";
  }) => void;
  isLoading?: boolean;
}

export function AddAgentModal({
  open,
  onOpenChange,
  onSubmit,
  isLoading,
}: AddAgentModalProps) {
  const [identifier, setIdentifier] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [apiEndpoint, setApiEndpoint] = useState("");
  const [model, setModel] = useState("gpt-4");
  const [temperature, setTemperature] = useState(0.7);
  const [systemPrompt, setSystemPrompt] = useState("");

  const handleSubmit = () => {
    if (!identifier.trim() || !name.trim() || !apiEndpoint.trim()) return;

    onSubmit({
      agent_identifier: identifier.trim(),
      name: name.trim(),
      description: description.trim() || undefined,
      api_endpoint: apiEndpoint.trim(),
      default_model: model,
      default_system_prompt: systemPrompt.trim() || undefined,
      default_temperature: temperature,
      status: "active",
    });

    // Reset form
    setIdentifier("");
    setName("");
    setDescription("");
    setApiEndpoint("");
    setModel("gpt-4");
    setTemperature(0.7);
    setSystemPrompt("");
  };

  const isValid = identifier.trim() && name.trim() && apiEndpoint.trim();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Agente</DialogTitle>
          <DialogDescription>
            Configure um novo agente de IA para monitorar
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="identifier">Identificador *</Label>
              <Input
                id="identifier"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="meu-agente"
                pattern="[a-z0-9-]+"
              />
              <p className="text-xs text-muted-foreground">
                Apenas letras minúsculas, números e hífens
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Nome *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Meu Agente"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descrição do agente..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="endpoint">Endpoint da API *</Label>
            <Input
              id="endpoint"
              value={apiEndpoint}
              onChange={(e) => setApiEndpoint(e.target.value)}
              placeholder="https://api.exemplo.com/agent"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Modelo Padrão</Label>
              <Select value={model} onValueChange={setModel}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {AVAILABLE_MODELS.map((m) => (
                    <SelectItem key={m.value} value={m.value}>
                      {m.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Temperature: {temperature.toFixed(1)}</Label>
              <Slider
                value={[temperature]}
                onValueChange={([v]) => setTemperature(v ?? 0.7)}
                min={0}
                max={2}
                step={0.1}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="prompt">System Prompt Padrão</Label>
            <Textarea
              id="prompt"
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              placeholder="Instruções padrão para o agente..."
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={!isValid || isLoading}>
            {isLoading ? "Salvando..." : "Adicionar Agente"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
