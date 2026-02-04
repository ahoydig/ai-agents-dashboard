"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AgentCard } from "@/components/agents/agent-card";
import { AddAgentModal } from "@/components/agents/add-agent-modal";
import { EditAgentModal } from "@/components/agents/edit-agent-modal";
import { useAgents, type AgentWithConfig } from "@/hooks/use-agents";
import { useCreateAgentConfig, useUpdateAgentConfig } from "@/hooks/use-agent-configs";
import { toast } from "sonner";

export default function AgentsPage() {
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<AgentWithConfig | null>(null);

  const { data: agents, isLoading } = useAgents();
  const createConfig = useCreateAgentConfig();
  const updateConfig = useUpdateAgentConfig();

  const handleAddAgent = async (data: Parameters<typeof createConfig.mutateAsync>[0]) => {
    try {
      await createConfig.mutateAsync(data);
      setAddModalOpen(false);
      toast.success("Agente adicionado");
    } catch (error) {
      toast.error("Erro ao adicionar agente");
    }
  };

  const handleEditAgent = async (data: Parameters<typeof updateConfig.mutateAsync>[0]) => {
    try {
      await updateConfig.mutateAsync(data);
      setEditModalOpen(false);
      setSelectedAgent(null);
      toast.success("Agente atualizado");
    } catch (error) {
      toast.error("Erro ao atualizar agente");
    }
  };

  const openEditModal = (agent: AgentWithConfig) => {
    setSelectedAgent(agent);
    setEditModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Agentes</h1>
          <p className="text-muted-foreground">
            Gerencie os agentes configurados na plataforma
          </p>
        </div>
        <Button onClick={() => setAddModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Agente
        </Button>
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-64" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {agents?.map((agent) => (
            <AgentCard
              key={agent.identifier}
              agent={agent}
              onEdit={() => openEditModal(agent)}
            />
          ))}

          {/* Add new agent card */}
          <Card
            className="border-dashed cursor-pointer hover:border-primary/50 transition-colors"
            onClick={() => setAddModalOpen(true)}
          >
            <CardContent className="h-full flex items-center justify-center py-8 min-h-[200px]">
              <div className="text-center text-muted-foreground">
                <Plus className="h-8 w-8 mx-auto mb-2" />
                <p>Adicionar Agente</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <AddAgentModal
        open={addModalOpen}
        onOpenChange={setAddModalOpen}
        onSubmit={handleAddAgent}
        isLoading={createConfig.isPending}
      />

      {selectedAgent && (
        <EditAgentModal
          open={editModalOpen}
          onOpenChange={(open) => {
            setEditModalOpen(open);
            if (!open) setSelectedAgent(null);
          }}
          agent={selectedAgent.config}
          agentIdentifier={selectedAgent.identifier}
          onSubmit={handleEditAgent}
          isLoading={updateConfig.isPending}
        />
      )}
    </div>
  );
}
