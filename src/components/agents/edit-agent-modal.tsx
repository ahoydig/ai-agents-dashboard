"use client";

import { useState, useEffect } from "react";
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
import { Switch } from "@/components/ui/switch";
import { AVAILABLE_MODELS, type AgentConfig } from "@/types/playground";

interface EditAgentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  agent?: AgentConfig;
  agentIdentifier: string;
  onSubmit: (data: Partial<AgentConfig> & { agent_identifier: string }) => void;
  isLoading?: boolean;
}

export function EditAgentModal({
  open,
  onOpenChange,
  agent,
  agentIdentifier,
  onSubmit,
  isLoading,
}: EditAgentModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [apiEndpoint, setApiEndpoint] = useState("");
  const [model, setModel] = useState("gpt-4");
  const [temperature, setTemperature] = useState(0.7);
  const [systemPrompt, setSystemPrompt] = useState("");
  const [isActive, setIsActive] = useState(true);

  // Populate form when agent changes
  useEffect(() => {
    if (agent) {
      setName(agent.name);
      setDescription(agent.description ?? "");
      setApiEndpoint(agent.api_endpoint);
      setModel(agent.default_model);
      setTemperature(agent.default_temperature);
      setSystemPrompt(agent.default_system_prompt ?? "");
      setIsActive(agent.status === "active");
    } else {
      // Default values for new config
      setName(agentIdentifier);
      setDescription("");
      setApiEndpoint("");
      setModel("gpt-4");
      setTemperature(0.7);
      setSystemPrompt("");
      setIsActive(true);
    }
  }, [agent, agentIdentifier]);

  const handleSubmit = () => {
    if (!name.trim()) return;

    onSubmit({
      agent_identifier: agentIdentifier,
      name: name.trim(),
      description: description.trim() || undefined,
      api_endpoint: apiEndpoint.trim(),
      default_model: model,
      default_system_prompt: systemPrompt.trim() || undefined,
      default_temperature: temperature,
      status: isActive ? "active" : "paused",
    });
  };

  const isValid = name.trim();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {agent ? "Editar Agente" : "Configurar Agente"}
          </DialogTitle>
          <DialogDescription>
            {agent
              ? `Editar configurações de ${agent.name}`
              : `Criar configuração para ${agentIdentifier}`}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="active">Status</Label>
              <p className="text-xs text-muted-foreground">
                {isActive ? "Agente ativo" : "Agente pausado"}
              </p>
            </div>
            <Switch
              id="active"
              checked={isActive}
              onCheckedChange={setIsActive}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Nome *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nome do agente"
            />
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
            <Label htmlFor="endpoint">Endpoint da API</Label>
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
            {isLoading ? "Salvando..." : "Salvar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
