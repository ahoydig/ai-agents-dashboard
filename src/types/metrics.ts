export interface DashboardMetrics {
  totalTurns: number;
  activeSessions: number;
  averageLatency: number;
  totalCost: number;
  errorRate: number;
  successRate: number;
  turnsWithErrors: number;
  turnsBlocked: number;
}

export interface TurnsOverTime {
  timestamp: string;
  count: number;
  errors: number;
}

export interface AgentDistribution {
  agent: string;
  count: number;
  percentage: number;
}

export interface RecentError {
  id: string;
  phone_number: string;
  agent_identifier: string;
  error_message: string;
  created_at: string;
  session_id: string | null;
}

export type Period = "24h" | "7d" | "30d";

export function getPeriodInterval(period: Period): string {
  switch (period) {
    case "24h":
      return "24 hours";
    case "7d":
      return "7 days";
    case "30d":
      return "30 days";
  }
}

export function getPeriodLabel(period: Period): string {
  switch (period) {
    case "24h":
      return "Últimas 24h";
    case "7d":
      return "Últimos 7 dias";
    case "30d":
      return "Últimos 30 dias";
  }
}
