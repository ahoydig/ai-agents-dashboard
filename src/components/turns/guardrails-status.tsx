"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Check, X, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface GuardrailsStatusProps {
  inputSafe: boolean;
  inputReason?: string | null;
  inputModel?: string | null;
  outputSafe: boolean;
  outputReason?: string | null;
  outputModel?: string | null;
  outputSanitized: boolean;
}

export function GuardrailsStatus({
  inputSafe,
  inputReason,
  inputModel,
  outputSafe,
  outputReason,
  outputModel,
  outputSanitized,
}: GuardrailsStatusProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <Shield className="h-4 w-4" />
          Guardrails
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2">
          {/* Input Guardrail */}
          <div
            className={cn(
              "p-3 rounded-lg border",
              inputSafe ? "border-green-500/30" : "border-red-500/30"
            )}
          >
            <div className="flex items-center gap-2 mb-2">
              {inputSafe ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <X className="h-4 w-4 text-red-500" />
              )}
              <p className="font-medium">Input</p>
            </div>
            <p
              className={cn(
                "text-sm",
                inputSafe ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
              )}
            >
              {inputSafe ? "Seguro" : "Bloqueado"}
            </p>
            {inputReason && (
              <p className="text-xs text-muted-foreground mt-1">
                {inputReason}
              </p>
            )}
            {inputModel && (
              <p className="text-xs text-muted-foreground mt-1">
                Modelo: {inputModel}
              </p>
            )}
          </div>

          {/* Output Guardrail */}
          <div
            className={cn(
              "p-3 rounded-lg border",
              outputSafe ? "border-green-500/30" : "border-red-500/30"
            )}
          >
            <div className="flex items-center gap-2 mb-2">
              {outputSafe ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <X className="h-4 w-4 text-red-500" />
              )}
              <p className="font-medium">Output</p>
              {outputSanitized && (
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
              )}
            </div>
            <p
              className={cn(
                "text-sm",
                outputSafe
                  ? outputSanitized
                    ? "text-yellow-600 dark:text-yellow-400"
                    : "text-green-600 dark:text-green-400"
                  : "text-red-600 dark:text-red-400"
              )}
            >
              {outputSafe
                ? outputSanitized
                  ? "Sanitizado"
                  : "Seguro"
                : "Bloqueado"}
            </p>
            {outputReason && (
              <p className="text-xs text-muted-foreground mt-1">
                {outputReason}
              </p>
            )}
            {outputModel && (
              <p className="text-xs text-muted-foreground mt-1">
                Modelo: {outputModel}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
