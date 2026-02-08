"use client";

import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AgentSelector } from "./agent-selector";
import { AgentConfigDisplay } from "./agent-config-display";
import { ConfigOverrides } from "./config-overrides";
import { EditableSystemPrompt } from "@/components/replay/editable-system-prompt";
import { EditableContext } from "@/components/replay/editable-context";
import { useAgentConfig } from "@/hooks/use-agent-configs";
import { User, Building } from "lucide-react";
import type { PlaygroundConfig } from "@/types/playground";

interface PlaygroundConfigPanelProps {
  config: PlaygroundConfig;
  onConfigChange: (config: PlaygroundConfig) => void;
}

export function PlaygroundConfigPanel({
  config,
  onConfigChange,
}: PlaygroundConfigPanelProps) {
  const { data: agentConfig, isLoading: isLoadingConfig } = useAgentConfig(
    config.agentIdentifier
  );

  const updateConfig = (updates: Partial<PlaygroundConfig>) => {
    onConfigChange({ ...config, ...updates });
  };

  // Auto-populate config from agent defaults when agent is selected
  useEffect(() => {
    if (agentConfig) {
      const updates: Partial<PlaygroundConfig> = {};

      // Only set model if not overriding
      if (!config.useModelOverride) {
        updates.model = agentConfig.default_model;
      }

      // Only set temperature if not overriding
      if (!config.useTemperatureOverride) {
        updates.temperature = agentConfig.default_temperature;
      }

      // Only set system prompt if not overriding and agent has one
      if (!config.useSystemPromptOverride && agentConfig.default_system_prompt) {
        updates.systemPrompt = agentConfig.default_system_prompt;
      }

      if (Object.keys(updates).length > 0) {
        onConfigChange({ ...config, ...updates });
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [agentConfig]);

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2 flex-shrink-0">
        <CardTitle className="text-base">Configuração</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 min-h-0 p-0">
        <ScrollArea className="h-full px-6 pb-6">
          <Tabs defaultValue="agent" className="w-full">
            <TabsList className="w-full">
              <TabsTrigger value="agent" className="flex-1">
                Agente
              </TabsTrigger>
              <TabsTrigger value="prompt" className="flex-1">
                Prompt
              </TabsTrigger>
              <TabsTrigger value="context" className="flex-1">
                Context
              </TabsTrigger>
            </TabsList>

            <TabsContent value="agent" className="space-y-4 mt-4">
              {/* Agent Selector */}
              <AgentSelector
                value={config.agentIdentifier}
                onChange={(v) => updateConfig({ agentIdentifier: v })}
              />

              {/* Agent Config Display (read-only) */}
              {config.agentIdentifier && (
                <AgentConfigDisplay
                  config={agentConfig}
                  isLoading={isLoadingConfig}
                />
              )}

              {/* Config Overrides */}
              {config.agentIdentifier && (
                <ConfigOverrides
                  config={config}
                  onConfigChange={updateConfig}
                  disabled={!config.agentIdentifier}
                />
              )}
            </TabsContent>

            <TabsContent value="prompt" className="mt-4">
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">
                  {config.useSystemPromptOverride
                    ? "Editando system prompt personalizado"
                    : "Exibindo system prompt do agente (read-only)"}
                </p>
                <EditableSystemPrompt
                  value={config.systemPrompt}
                  onChange={(v) => updateConfig({ systemPrompt: v, useSystemPromptOverride: true })}
                  readOnly={!config.useSystemPromptOverride}
                />
              </div>
            </TabsContent>

            <TabsContent value="context" className="space-y-4 mt-4">
              <EditableContext
                title="Patient Context"
                value={config.patientContext}
                onChange={(v) => updateConfig({ patientContext: v })}
                icon={<User className="h-4 w-4" />}
              />
              <EditableContext
                title="CRM Context"
                value={config.crmContext}
                onChange={(v) => updateConfig({ crmContext: v })}
                icon={<Building className="h-4 w-4" />}
              />
            </TabsContent>
          </Tabs>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
