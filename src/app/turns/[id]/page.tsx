import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface TurnDetailPageProps {
  params: { id: string };
}

export default function TurnDetailPage({ params }: TurnDetailPageProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Turn Detail</h1>
          <p className="text-muted-foreground font-mono text-sm">{params.id}</p>
        </div>
        <Badge variant="outline">success</Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Input/Output */}
        <Card>
          <CardHeader>
            <CardTitle>Mensagem do Usuário</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Carregando...</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Resposta do Agente</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Carregando...</p>
          </CardContent>
        </Card>

        {/* Tool Calls */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Tool Calls</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Carregando...</p>
          </CardContent>
        </Card>

        {/* Context Snapshots */}
        <Card>
          <CardHeader>
            <CardTitle>Patient Context</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-xs overflow-auto max-h-[200px] text-muted-foreground">
              Carregando...
            </pre>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>CRM Context</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-xs overflow-auto max-h-[200px] text-muted-foreground">
              Carregando...
            </pre>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
