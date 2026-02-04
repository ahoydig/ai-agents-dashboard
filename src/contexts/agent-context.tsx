"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

interface AgentContextValue {
  selectedAgent: string | null;
  setSelectedAgent: (agent: string | null) => void;
  clearSelection: () => void;
}

const AgentContext = createContext<AgentContextValue | undefined>(undefined);

const AGENT_PARAM = "agent";

export function AgentProvider({ children }: { children: ReactNode }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [selectedAgent, setSelectedAgentState] = useState<string | null>(null);

  // Sync from URL on mount
  useEffect(() => {
    const agentFromUrl = searchParams.get(AGENT_PARAM);
    if (agentFromUrl) {
      setSelectedAgentState(agentFromUrl);
    }
  }, [searchParams]);

  const setSelectedAgent = useCallback(
    (agent: string | null) => {
      setSelectedAgentState(agent);

      // Update URL
      const params = new URLSearchParams(searchParams.toString());
      if (agent) {
        params.set(AGENT_PARAM, agent);
      } else {
        params.delete(AGENT_PARAM);
      }
      const newUrl = params.toString()
        ? `${pathname}?${params.toString()}`
        : pathname;
      router.push(newUrl);
    },
    [searchParams, pathname, router]
  );

  const clearSelection = useCallback(() => {
    setSelectedAgent(null);
  }, [setSelectedAgent]);

  return (
    <AgentContext.Provider
      value={{ selectedAgent, setSelectedAgent, clearSelection }}
    >
      {children}
    </AgentContext.Provider>
  );
}

export function useAgentContext() {
  const context = useContext(AgentContext);
  if (context === undefined) {
    throw new Error("useAgentContext must be used within an AgentProvider");
  }
  return context;
}
