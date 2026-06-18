import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

interface Props {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
}

export function PageHeader({ title, description, actions, className }: Props) {
  return (
    <div className={cn("mb-6", className)}>
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="min-w-0">
          <h1 className="text-base font-semibold tracking-tight leading-none">{title}</h1>
          {description && (
            <p className="text-xs text-[var(--text-muted)] mt-1.5 leading-relaxed">{description}</p>
          )}
        </div>
        {actions && (
          <div className="flex items-center gap-2 shrink-0">{actions}</div>
        )}
      </div>
      <Separator />
    </div>
  );
}
