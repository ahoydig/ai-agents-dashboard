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
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";
import type { PlaygroundConfig, PlaygroundMessage } from "@/types/playground";

interface CreateIssueModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  config: PlaygroundConfig;
  messages: PlaygroundMessage[];
  sessionName?: string;
  onCreateIssue: (data: {
    title: string;
    body: string;
    labels: string[];
  }) => Promise<{ url: string }>;
  isLoading?: boolean;
}

function generateIssueBody(
  config: PlaygroundConfig,
  messages: PlaygroundMessage[],
  additionalContext: string
): string {
  const lastError = messages.find((m) => m.error);
  const errorInfo = lastError
    ? `\n\n## Erro Observado\n\n\`\`\`\n${lastError.error}\n\`\`\``
    : "";

  const conversationSummary = messages
    .slice(-6)
    .map(
      (m) =>
        `**${m.role === "user" ? "Usuário" : "Agente"}:** ${m.content.slice(0, 200)}${m.content.length > 200 ? "..." : ""}`
    )
    .join("\n\n");

  return `## Contexto

**Agente:** \`${config.agentIdentifier}\`
**Modelo:** \`${config.model}\`
**Temperature:** \`${config.temperature}\`

## Conversa (últimas mensagens)

${conversationSummary}
${errorInfo}

## Configuração

<details>
<summary>System Prompt</summary>

\`\`\`
${config.systemPrompt || "(vazio)"}
\`\`\`

</details>

<details>
<summary>Patient Context</summary>

\`\`\`json
${JSON.stringify(config.patientContext, null, 2)}
\`\`\`

</details>

<details>
<summary>CRM Context</summary>

\`\`\`json
${JSON.stringify(config.crmContext, null, 2)}
\`\`\`

</details>

## Contexto Adicional

${additionalContext || "Nenhum contexto adicional fornecido."}

---

*Issue criada automaticamente pelo AI Agents Dashboard*
`;
}

export function CreateIssueModal({
  open,
  onOpenChange,
  config,
  messages,
  sessionName,
  onCreateIssue,
  isLoading,
}: CreateIssueModalProps) {
  const [title, setTitle] = useState(
    sessionName ? `[Playground] ${sessionName}` : "[Playground] "
  );
  const [additionalContext, setAdditionalContext] = useState("");
  const [labels, setLabels] = useState<string[]>(["playground", "bug"]);
  const [createdUrl, setCreatedUrl] = useState<string | null>(null);

  const handleCreate = async () => {
    if (!title.trim()) return;

    try {
      const body = generateIssueBody(config, messages, additionalContext);
      const result = await onCreateIssue({
        title: title.trim(),
        body,
        labels,
      });
      setCreatedUrl(result.url);
    } catch (error) {
      console.error("Failed to create issue:", error);
    }
  };

  const toggleLabel = (label: string) => {
    if (labels.includes(label)) {
      setLabels(labels.filter((l) => l !== label));
    } else {
      setLabels([...labels, label]);
    }
  };

  const availableLabels = [
    "bug",
    "playground",
    "regression",
    "edge-case",
    "enhancement",
    "urgent",
  ];

  if (createdUrl) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Issue Criada!</DialogTitle>
            <DialogDescription>
              A issue foi criada com sucesso no GitHub.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <a
              href={createdUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-primary hover:underline"
            >
              <ExternalLink className="h-4 w-4" />
              Abrir Issue no GitHub
            </a>
          </div>

          <DialogFooter>
            <Button
              onClick={() => {
                setCreatedUrl(null);
                onOpenChange(false);
              }}
            >
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Criar Issue no GitHub</DialogTitle>
          <DialogDescription>
            Crie uma issue com os detalhes desta sessão para tracking e
            debugging.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="[Playground] Descreva o problema..."
            />
          </div>

          <div className="space-y-2">
            <Label>Labels</Label>
            <div className="flex flex-wrap gap-2">
              {availableLabels.map((label) => (
                <Badge
                  key={label}
                  variant={labels.includes(label) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => toggleLabel(label)}
                >
                  {label}
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="context">Contexto Adicional</Label>
            <Textarea
              id="context"
              value={additionalContext}
              onChange={(e) => setAdditionalContext(e.target.value)}
              placeholder="Descreva o comportamento esperado vs observado..."
              rows={4}
            />
          </div>

          <div className="rounded-lg bg-muted p-3 text-sm">
            <p className="font-medium">A issue incluirá:</p>
            <ul className="mt-1 list-inside list-disc space-y-1 text-muted-foreground">
              <li>Configuração do agente</li>
              <li>Últimas {Math.min(6, messages.length)} mensagens</li>
              <li>Contextos (patient/CRM)</li>
              <li>System prompt</li>
              {messages.some((m) => m.error) && (
                <li className="text-destructive">Mensagens de erro</li>
              )}
            </ul>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleCreate} disabled={!title.trim() || isLoading}>
            {isLoading ? "Criando..." : "Criar Issue"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
