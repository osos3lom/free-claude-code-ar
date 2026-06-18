"use client";

import { useEffect, useState } from "react";
import { Zap, Brain, Loader2 } from "lucide-react";
import { adminApi, type ConfigField } from "@/lib/api";
import { cn } from "@/lib/utils";

const REAL_CLAUDE: Record<string, string> = {
  MODEL: "open_router/anthropic/claude-sonnet-4-5",
  MODEL_OPUS: "open_router/anthropic/claude-opus-4-5",
  MODEL_SONNET: "open_router/anthropic/claude-sonnet-4-5",
  MODEL_HAIKU: "open_router/anthropic/claude-haiku-4-5",
};

const SAVE_KEY = "fcc_mode_a_models";
const MODEL_KEYS = ["MODEL", "MODEL_OPUS", "MODEL_SONNET", "MODEL_HAIKU"] as const;

type Mode = "free" | "claude";
type Status = "idle" | "applying" | "ok" | "error";

export function RoutingModeSwitch({
  fields,
  isRtl,
  onApplied,
}: {
  fields: ConfigField[];
  isRtl: boolean;
  onApplied: () => void;
}) {
  const [mode, setMode] = useState<Mode>("free");
  const [status, setStatus] = useState<Status>("idle");

  useEffect(() => {
    const modelField = fields.find((f) => f.key === "MODEL");
    setMode(
      modelField?.value?.startsWith("open_router/anthropic/") ? "claude" : "free",
    );
  }, [fields]);

  async function switchTo(target: Mode) {
    if (target === mode || status === "applying") return;
    setStatus("applying");
    try {
      if (target === "claude") {
        const saved: Record<string, string> = {};
        for (const key of MODEL_KEYS) {
          saved[key] = fields.find((f) => f.key === key)?.value ?? "";
        }
        localStorage.setItem(SAVE_KEY, JSON.stringify(saved));
        await adminApi.apply(REAL_CLAUDE);
      } else {
        const raw = localStorage.getItem(SAVE_KEY);
        const saved: Record<string, string> = raw ? JSON.parse(raw) : {};
        if (Object.keys(saved).length > 0) await adminApi.apply(saved);
      }
      setMode(target);
      setStatus("ok");
      onApplied();
      setTimeout(() => setStatus("idle"), 2000);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  }

  return (
    <div className="mb-6 p-4 rounded-lg border border-[var(--border)] bg-[var(--surface)]">
      <p className="text-[10px] uppercase tracking-wider font-semibold text-[var(--text-muted)] mb-3">
        {isRtl ? "وضع التشغيل" : "Routing Mode"}
      </p>

      <div className="grid grid-cols-2 gap-2">
        <ModeCard
          active={mode === "free"}
          disabled={status === "applying"}
          icon={<Zap className="w-3.5 h-3.5" />}
          title={isRtl ? "التوجيه الذكي" : "Smart Routing"}
          subtitle="Option A"
          description={
            isRtl
              ? "مزوّدون مجانيون لكل مستوى"
              : "Free providers per model tier"
          }
          onClick={() => switchTo("free")}
        />
        <ModeCard
          active={mode === "claude"}
          disabled={status === "applying"}
          icon={<Brain className="w-3.5 h-3.5" />}
          title={isRtl ? "Claude الحقيقي" : "Real Claude"}
          subtitle="Option B"
          description={
            isRtl
              ? "جميع الطلبات عبر Anthropic"
              : "All tiers via Anthropic on OpenRouter"
          }
          onClick={() => switchTo("claude")}
        />
      </div>

      {status !== "idle" && (
        <div className="mt-2.5 flex items-center gap-1.5">
          {status === "applying" && (
            <>
              <Loader2 className="w-3 h-3 animate-spin text-[var(--accent)]" />
              <span className="text-[11px] text-[var(--accent)]">
                {isRtl ? "جارٍ التطبيق..." : "Applying…"}
              </span>
            </>
          )}
          {status === "ok" && (
            <span className="text-[11px] text-[var(--ok)]">
              {isRtl ? "✓ تم التطبيق" : "✓ Applied"}
            </span>
          )}
          {status === "error" && (
            <span className="text-[11px] text-[var(--error)]">
              {isRtl ? "فشل التطبيق" : "Failed — check server logs"}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

function ModeCard({
  active,
  disabled,
  icon,
  title,
  subtitle,
  description,
  onClick,
}: {
  active: boolean;
  disabled: boolean;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "flex flex-col gap-1.5 p-3 rounded-lg border text-start transition-all duration-150",
        "focus-visible:outline-2 focus-visible:outline-[var(--accent)] focus-visible:outline-offset-2",
        active
          ? "border-[var(--accent)] bg-[var(--accent-dim)]"
          : "border-[var(--border)] bg-[var(--surface-raised)] hover:border-[var(--text-muted)]",
        disabled && "pointer-events-none opacity-50",
      )}
    >
      <div
        className={cn(
          "flex items-center gap-1.5 text-xs font-semibold",
          active ? "text-[var(--accent)]" : "text-[var(--text-secondary)]",
        )}
      >
        {icon}
        <span>{title}</span>
        <span className="ms-auto font-mono text-[9px] opacity-60">{subtitle}</span>
      </div>
      <p className="text-[10px] leading-snug text-[var(--text-muted)]">{description}</p>
    </button>
  );
}
