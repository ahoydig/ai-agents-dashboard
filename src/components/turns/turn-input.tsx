"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CopyButton } from "@/components/ui/copy-button";
import { User } from "lucide-react";

interface TurnInputProps {
  message: string;
}

export function TurnInput({ message }: TurnInputProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <User className="h-4 w-4" />
          Mensagem do Usuário
        </CardTitle>
        <CopyButton value={message} />
      </CardHeader>
      <CardContent>
        <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
          <p className="text-sm whitespace-pre-wrap">{message}</p>
        </div>
      </CardContent>
    </Card>
  );
}
