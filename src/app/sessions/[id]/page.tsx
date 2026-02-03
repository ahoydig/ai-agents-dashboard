import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SessionDetailPageProps {
  params: { id: string };
}

export default function SessionDetailPage({ params }: SessionDetailPageProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Sessão</h1>
        <p className="text-muted-foreground font-mono">{params.id}</p>
      </div>

      {/* Timeline placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Timeline</CardTitle>
        </CardHeader>
        <CardContent className="h-[600px] flex items-center justify-center text-muted-foreground">
          Timeline da sessão (implementar)
        </CardContent>
      </Card>
    </div>
  );
}
