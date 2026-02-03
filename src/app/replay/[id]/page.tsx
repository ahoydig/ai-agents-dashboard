import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, RefreshCw } from "lucide-react";

interface ReplayPageProps {
  params: { id: string };
}

export default function ReplayPage({ params }: ReplayPageProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Session Replay</h1>
          <p className="text-muted-foreground font-mono text-sm">{params.id}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset
          </Button>
          <Button>
            <Play className="h-4 w-4 mr-2" />
            Replay Turn
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Original */}
        <Card>
          <CardHeader>
            <CardTitle>Resposta Original</CardTitle>
          </CardHeader>
          <CardContent className="h-[400px]">
            <p className="text-muted-foreground">Carregando resposta original...</p>
          </CardContent>
        </Card>

        {/* Replay */}
        <Card>
          <CardHeader>
            <CardTitle>Replay (Nova Execução)</CardTitle>
          </CardHeader>
          <CardContent className="h-[400px]">
            <p className="text-muted-foreground">Clique em "Replay Turn" para executar</p>
          </CardContent>
        </Card>
      </div>

      {/* Diff */}
      <Card>
        <CardHeader>
          <CardTitle>Comparação (Diff)</CardTitle>
        </CardHeader>
        <CardContent className="h-[200px] flex items-center justify-center text-muted-foreground">
          Execute o replay para ver a comparação
        </CardContent>
      </Card>
    </div>
  );
}
