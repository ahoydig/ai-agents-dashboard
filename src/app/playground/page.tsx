"use client";

import { useState, useCallback, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Trash2, Save, FolderOpen, Github, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlaygroundConfigPanel } from "@/components/playground/playground-config";
import { ChatTimeline } from "@/components/playground/chat-timeline";
import { ChatInput } from "@/components/playground/chat-input";
import { SaveSessionModal } from "@/components/playground/save-session-modal";
import { CreateIssueModal } from "@/components/playground/create-issue-modal";
import { usePlayground } from "@/hooks/use-playground";
import { useTestSession, useCreateTestSession, useUpdateTestSession } from "@/hooks/use-test-sessions";
import { toast } from "sonner";
import type { PlaygroundConfig, PlaygroundMessage, Scenario } from "@/types/playground";
import Link from "next/link";

const defaultConfig: PlaygroundConfig = {
  agentIdentifier: "",
  model: "gpt-4",
  systemPrompt: "",
  temperature: 0.7,
  patientContext: {},
  crmContext: {},
  chatHistory: [],
};

export default function PlaygroundPage() {
  const searchParams = useSearchParams();
  const loadSessionId = searchParams.get("load");

  const [config, setConfig] = useState<PlaygroundConfig>(defaultConfig);
  const [messages, setMessages] = useState<PlaygroundMessage[]>([]);
  const [showConfig, setShowConfig] = useState(true);
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [issueModalOpen, setIssueModalOpen] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

  const playground = usePlayground();
  const createSession = useCreateTestSession();
  const updateSession = useUpdateTestSession();
  const { data: loadedSession } = useTestSession(loadSessionId || "");

  // Load session from URL param
  useEffect(() => {
    if (loadedSession) {
      setConfig(loadedSession.config);
      setMessages(loadedSession.timeline);
      setCurrentSessionId(loadedSession.id);
      toast.success(`Sessão "${loadedSession.name}" carregada`);
    }
  }, [loadedSession]);

  const handleSendMessage = useCallback(
    async (content: string) => {
      if (!config.agentIdentifier) {
        toast.error("Selecione um agente primeiro");
        return;
      }

      const userMessage: PlaygroundMessage = {
        id: crypto.randomUUID(),
        role: "user",
        content,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, userMessage]);

      // Update chat history
      const updatedHistory = [
        ...config.chatHistory,
        { role: "user" as const, content },
      ];

      try {
        const result = await playground.mutateAsync({
          system_prompt: config.systemPrompt,
          chat_history: config.chatHistory,
          user_message: content,
          patient_context: config.patientContext,
          crm_context: config.crmContext,
          model: config.model,
          temperature: config.temperature,
          agent_identifier: config.agentIdentifier,
        });

        const assistantMessage: PlaygroundMessage = {
          id: crypto.randomUUID(),
          role: "assistant",
          content: result.final_response || result.assistant_response,
          timestamp: new Date().toISOString(),
          metrics: {
            tokensIn: result.tokens.input,
            tokensOut: result.tokens.output,
            cost: result.cost_usd,
            latency: result.latencies.total_ms,
          },
          toolCalls: result.tool_calls,
        };

        setMessages((prev) => [...prev, assistantMessage]);

        // Update config with new chat history
        setConfig((prev) => ({
          ...prev,
          chatHistory: [
            ...updatedHistory,
            {
              role: "assistant" as const,
              content: result.final_response || result.assistant_response,
            },
          ],
        }));
      } catch (error) {
        const errorMessage: PlaygroundMessage = {
          id: crypto.randomUUID(),
          role: "assistant",
          content: "",
          timestamp: new Date().toISOString(),
          error: error instanceof Error ? error.message : "Erro desconhecido",
        };

        setMessages((prev) => [...prev, errorMessage]);
        toast.error("Erro ao executar mensagem");
      }
    },
    [config, playground]
  );

  const handleClearChat = () => {
    setMessages([]);
    setConfig((prev) => ({ ...prev, chatHistory: [] }));
    setCurrentSessionId(null);
    toast.info("Chat limpo");
  };

  const handleSaveSession = async (data: {
    name: string;
    scenario?: Scenario;
    tags: string[];
    notes?: string;
  }) => {
    try {
      if (currentSessionId) {
        // Update existing session
        await updateSession.mutateAsync({
          id: currentSessionId,
          ...data,
          config,
          timeline: messages,
        });
        toast.success("Sessão atualizada");
      } else {
        // Create new session
        const newSession = await createSession.mutateAsync({
          ...data,
          agent_identifier: config.agentIdentifier,
          config,
          timeline: messages,
        });
        setCurrentSessionId(newSession.id);
        toast.success("Sessão salva");
      }
      setSaveModalOpen(false);
    } catch (error) {
      toast.error("Erro ao salvar sessão");
    }
  };

  const handleCreateIssue = async (data: {
    title: string;
    body: string;
    labels: string[];
  }) => {
    const response = await fetch("/api/github/issue", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: data.title,
        labels: data.labels,
        agentIdentifier: config.agentIdentifier,
        model: config.model,
        temperature: config.temperature,
        systemPrompt: config.systemPrompt,
        patientContext: config.patientContext,
        crmContext: config.crmContext,
        conversation: messages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
        error: messages.find((m) => m.error)?.error,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to create issue");
    }

    const result = await response.json();

    // Update session with issue URL if we have a session
    if (currentSessionId) {
      await updateSession.mutateAsync({
        id: currentSessionId,
        github_issue_url: result.url,
      });
    }

    return result;
  };

  const canSave = config.agentIdentifier && messages.length > 0;

  return (
    <div className="h-[calc(100vh-theme(spacing.12))] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-3xl font-bold">Playground</h1>
          <p className="text-muted-foreground">
            Teste seus agentes em tempo real
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/playground/saved">
            <Button variant="outline">
              <FolderOpen className="h-4 w-4 mr-2" />
              Sessões Salvas
            </Button>
          </Link>
          <Button variant="outline" onClick={handleClearChat}>
            <Trash2 className="h-4 w-4 mr-2" />
            Limpar Chat
          </Button>
          <Button
            variant="outline"
            onClick={() => setSaveModalOpen(true)}
            disabled={!canSave}
          >
            <Save className="h-4 w-4 mr-2" />
            {currentSessionId ? "Atualizar Sessão" : "Salvar Sessão"}
          </Button>
          <Button
            variant="outline"
            onClick={() => setIssueModalOpen(true)}
            disabled={!canSave}
          >
            <Github className="h-4 w-4 mr-2" />
            Criar Issue
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex gap-4 min-h-0">
        {/* Config Panel */}
        {showConfig && (
          <div className="w-[400px] flex-shrink-0">
            <PlaygroundConfigPanel
              config={config}
              onConfigChange={setConfig}
            />
          </div>
        )}

        {/* Toggle Config Button */}
        <Button
          variant="ghost"
          size="sm"
          className="self-center"
          onClick={() => setShowConfig(!showConfig)}
        >
          {showConfig ? (
            <ChevronLeft className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </Button>

        {/* Chat Panel */}
        <Card className="flex-1 flex flex-col min-h-0">
          <CardHeader className="pb-2 flex-shrink-0">
            <CardTitle className="flex items-center justify-between text-base">
              <span>Chat</span>
              {config.agentIdentifier && (
                <span className="text-sm font-normal text-muted-foreground">
                  {config.agentIdentifier} | {config.model}
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col min-h-0 pb-4">
            <div className="flex-1 min-h-0 border rounded-lg mb-4">
              <ChatTimeline messages={messages} />
            </div>
            <ChatInput
              onSend={handleSendMessage}
              disabled={!config.agentIdentifier}
              isLoading={playground.isPending}
            />
          </CardContent>
        </Card>
      </div>

      {/* Modals */}
      <SaveSessionModal
        open={saveModalOpen}
        onOpenChange={setSaveModalOpen}
        config={config}
        messages={messages}
        onSave={handleSaveSession}
        isLoading={createSession.isPending || updateSession.isPending}
      />

      <CreateIssueModal
        open={issueModalOpen}
        onOpenChange={setIssueModalOpen}
        config={config}
        messages={messages}
        onCreateIssue={handleCreateIssue}
      />
    </div>
  );
}
