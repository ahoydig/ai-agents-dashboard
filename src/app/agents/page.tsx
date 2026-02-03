import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const agents = [
  {
    id: "centerfisio",
    name: "CenterFisio",
    description: "Agente de agendamento para clínica de fisioterapia",
    status: "active",
  },
];

export default function AgentsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Agentes</h1>
        <p className="text-muted-foreground">Agentes configurados na plataforma</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {agents.map((agent) => (
          <Card key={agent.id} className="cursor-pointer hover:border-primary/50 transition-colors">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{agent.name}</CardTitle>
                <Badge variant={agent.status === "active" ? "default" : "secondary"}>
                  {agent.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{agent.description}</p>
              <p className="text-xs text-muted-foreground mt-2 font-mono">ID: {agent.id}</p>
            </CardContent>
          </Card>
        ))}

        {/* Add new agent card */}
        <Card className="border-dashed cursor-pointer hover:border-primary/50 transition-colors">
          <CardContent className="h-full flex items-center justify-center py-8">
            <p className="text-muted-foreground">+ Adicionar Agente</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
