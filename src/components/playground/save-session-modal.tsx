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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TagInput } from "./tag-input";
import { SCENARIO_OPTIONS, type Scenario, type PlaygroundConfig, type PlaygroundMessage } from "@/types/playground";

interface SaveSessionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  config: PlaygroundConfig;
  messages: PlaygroundMessage[];
  onSave: (data: {
    name: string;
    scenario?: Scenario;
    tags: string[];
    notes?: string;
  }) => void;
  isLoading?: boolean;
}

export function SaveSessionModal({
  open,
  onOpenChange,
  config,
  messages,
  onSave,
  isLoading,
}: SaveSessionModalProps) {
  const [name, setName] = useState("");
  const [scenario, setScenario] = useState<Scenario | "">("");
  const [tags, setTags] = useState<string[]>([]);
  const [notes, setNotes] = useState("");

  const handleSave = () => {
    if (!name.trim()) return;

    onSave({
      name: name.trim(),
      scenario: scenario || undefined,
      tags,
      notes: notes.trim() || undefined,
    });

    // Reset form
    setName("");
    setScenario("");
    setTags([]);
    setNotes("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Salvar Sessão</DialogTitle>
          <DialogDescription>
            Salve esta sessão para poder re-executar e comparar resultados
            posteriormente.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome da Sessão *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Teste agendamento segunda-feira"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="scenario">Cenário</Label>
            <Select
              value={scenario}
              onValueChange={(v) => setScenario(v as Scenario | "")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um cenário" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Nenhum</SelectItem>
                {SCENARIO_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Tags</Label>
            <TagInput
              value={tags}
              onChange={setTags}
              placeholder="Adicione tags..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notas</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Observações sobre esta sessão..."
              rows={3}
            />
          </div>

          <div className="rounded-lg bg-muted p-3 text-sm">
            <p className="font-medium">Resumo da sessão:</p>
            <ul className="mt-1 space-y-1 text-muted-foreground">
              <li>Agente: {config.agentIdentifier || "Não selecionado"}</li>
              <li>Modelo: {config.model}</li>
              <li>Mensagens: {messages.length}</li>
            </ul>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            disabled={!name.trim() || isLoading}
          >
            {isLoading ? "Salvando..." : "Salvar Sessão"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
