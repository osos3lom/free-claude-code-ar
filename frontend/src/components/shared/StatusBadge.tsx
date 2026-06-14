import { cn } from "@/lib/utils";

type StatusValue = "configured" | "missing_key" | "reachable" | "offline" | "missing_url" | "unknown";

interface Props {
  status: StatusValue | string;
  label?: string;
}

const COLOR_MAP: Record<string, string> = {
  configured: "text-[var(--ok)] border-[var(--ok)] bg-[rgba(62,207,142,0.1)]",
  reachable: "text-[var(--ok)] border-[var(--ok)] bg-[rgba(62,207,142,0.1)]",
  missing_key: "text-[var(--warn)] border-[var(--warn)] bg-[rgba(245,158,11,0.1)]",
  missing_url: "text-[var(--warn)] border-[var(--warn)] bg-[rgba(245,158,11,0.1)]",
  offline: "text-[var(--error)] border-[var(--error)] bg-[rgba(239,68,68,0.1)]",
  unknown: "text-[var(--text-muted)] border-[var(--border)] bg-transparent",
};

export function StatusBadge({ status, label }: Props) {
  const colorClass = COLOR_MAP[status] ?? COLOR_MAP.unknown;
  return (
    <span className={cn("text-[10px] px-2 py-0.5 rounded-full border font-medium", colorClass)}>
      {label ?? status}
    </span>
  );
}
