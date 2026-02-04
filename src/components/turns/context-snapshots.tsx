"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { JsonViewer } from "@/components/ui/json-viewer";
import { User, Building } from "lucide-react";

interface ContextSnapshotsProps {
  patientContext?: Record<string, unknown> | null;
  crmContext?: Record<string, unknown> | null;
}

export function ContextSnapshots({
  patientContext,
  crmContext,
}: ContextSnapshotsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <User className="h-4 w-4" />
            Patient Context
          </CardTitle>
        </CardHeader>
        <CardContent>
          {patientContext ? (
            <JsonViewer
              data={patientContext}
              defaultExpanded={false}
              maxDepth={3}
              className="max-h-[300px] overflow-auto"
            />
          ) : (
            <p className="text-sm text-muted-foreground italic">
              Sem context de paciente
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <Building className="h-4 w-4" />
            CRM Context
          </CardTitle>
        </CardHeader>
        <CardContent>
          {crmContext ? (
            <JsonViewer
              data={crmContext}
              defaultExpanded={false}
              maxDepth={3}
              className="max-h-[300px] overflow-auto"
            />
          ) : (
            <p className="text-sm text-muted-foreground italic">
              Sem context CRM
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
