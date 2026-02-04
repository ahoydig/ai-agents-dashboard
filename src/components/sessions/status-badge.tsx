import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type Status = "success" | "error" | "input_blocked" | "output_blocked";

interface StatusBadgeProps {
  status: Status;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const statusConfig: Record<Status, { label: string; variant: "default" | "destructive" | "outline" | "secondary" }> = {
    success: { label: "Sucesso", variant: "default" },
    error: { label: "Erro", variant: "destructive" },
    input_blocked: { label: "Input Bloqueado", variant: "secondary" },
    output_blocked: { label: "Output Bloqueado", variant: "secondary" },
  };

  const config = statusConfig[status] ?? { label: status, variant: "outline" as const };

  return (
    <Badge variant={config.variant} className={cn(className)}>
      {config.label}
    </Badge>
  );
}
