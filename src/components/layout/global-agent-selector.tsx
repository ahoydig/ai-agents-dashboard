"use client";

import { X, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAgentContext } from "@/contexts/agent-context";
import { useDiscoveredAgents } from "@/hooks/use-sessions";

export function GlobalAgentSelector() {
  const { selectedAgent, setSelectedAgent, clearSelection } = useAgentContext();
  const { data: agents = [] } = useDiscoveredAgents();

  if (agents.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      <Bot className="h-4 w-4 text-muted-foreground" />
      <Select
        value={selectedAgent ?? "all"}
        onValueChange={(value) =>
          setSelectedAgent(value === "all" ? null : value)
        }
      >
        <SelectTrigger className="w-[180px] h-8">
          <SelectValue placeholder="Todos os agentes" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos os agentes</SelectItem>
          {agents.map((agent) => (
            <SelectItem key={agent} value={agent}>
              {agent}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {selectedAgent && (
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={clearSelection}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Limpar filtro</span>
        </Button>
      )}
    </div>
  );
}
