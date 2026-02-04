"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AgentSelector } from "./agent-selector";
import { ModelSelector } from "./model-selector";
import { ModelParameters } from "./model-parameters";
import { EditableSystemPrompt } from "@/components/replay/editable-system-prompt";
import { EditableContext } from "@/components/replay/editable-context";
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
  const updateConfig = (updates: Partial<PlaygroundConfig>) => {
    onConfigChange({ ...config, ...updates });
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Configuração</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs defaultValue="basic">
          <TabsList className="w-full">
            <TabsTrigger value="basic" className="flex-1">
              Básico
            </TabsTrigger>
            <TabsTrigger value="prompt" className="flex-1">
              Prompt
            </TabsTrigger>
            <TabsTrigger value="context" className="flex-1">
              Context
            </TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4 mt-4">
            <AgentSelector
              value={config.agentIdentifier}
              onChange={(v) => updateConfig({ agentIdentifier: v })}
            />
            <ModelSelector
              value={config.model}
              onChange={(v) => updateConfig({ model: v })}
            />
            <ModelParameters
              temperature={config.temperature}
              maxTokens={config.maxTokens}
              onTemperatureChange={(v) => updateConfig({ temperature: v })}
              onMaxTokensChange={(v) => updateConfig({ maxTokens: v })}
            />
          </TabsContent>

          <TabsContent value="prompt" className="mt-4">
            <EditableSystemPrompt
              value={config.systemPrompt}
              onChange={(v) => updateConfig({ systemPrompt: v })}
            />
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
      </CardContent>
    </Card>
  );
}
