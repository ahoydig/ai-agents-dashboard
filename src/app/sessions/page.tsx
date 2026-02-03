"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

export default function SessionsPage() {
  const [phone, setPhone] = useState("");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Sessões</h1>
        <p className="text-muted-foreground">Buscar e visualizar sessões de conversa</p>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle>Buscar por Telefone</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="Ex: 5581999999999"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="max-w-sm"
            />
            <Button>
              <Search className="h-4 w-4 mr-2" />
              Buscar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Resultados</CardTitle>
        </CardHeader>
        <CardContent className="h-[400px] flex items-center justify-center text-muted-foreground">
          Digite um número de telefone para buscar sessões
        </CardContent>
      </Card>
    </div>
  );
}
