"use client";

import { useEffect, useState } from "react";
import { Server, Cpu, Plug, Network, AlertTriangle } from "lucide-react";
import { Shell } from "@/components/layout/Shell";
import { PageHeader } from "@/components/layout/PageHeader";
import { SkeletonDashboard } from "@/components/shared/Skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { adminApi, type AdminStatus } from "@/lib/api";
import { useAppStore } from "@/store/useAppStore";
import { cn } from "@/lib/utils";

// Real-Time Monitoring colour map (skill: --live-indicator, --critical-color, --warn)
const STATUS_COLOR: Record<string, { dot: string; text: string; label: string }> = {
  configured:  { dot: "bg-[var(--ok)]",   text: "text-[var(--ok)]",   label: "Configured"   },
  reachable:   { dot: "bg-[var(--ok)]",   text: "text-[var(--ok)]",   label: "Reachable"    },
  missing_key: { dot: "bg-[var(--warn)]", text: "text-[var(--warn)]", label: "Missing key"  },
  missing_url: { dot: "bg-[var(--warn)]", text: "text-[var(--warn)]", label: "Missing URL"  },
  offline:     { dot: "bg-[var(--error)]",text: "text-[var(--error)]",label: "Offline"      },
};

export default function DashboardPage() {
  const { lang } = useAppStore();
  const isRtl = lang === "ar";
  const [status, setStatus] = useState<AdminStatus | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    adminApi
      .getStatus()
      .then(setStatus)
      .catch(() =>
        setError(isRtl ? "تعذّر الاتصال بالخادم" : "Failed to connect to server"),
      );
  }, [isRtl]);

  return (
    <Shell>
      <div className="p-4 md:p-6 max-w-2xl">
        <PageHeader
          title={isRtl ? "لوحة التحكم" : "Dashboard"}
          description={isRtl ? "حالة الخادم ومعلوماته" : "Live server status and configuration snapshot"}
        />

        {error && (
          <Alert className="mb-4 border-[var(--error)] bg-[rgba(239,68,68,0.08)] text-[var(--error)]">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {!status && !error && <SkeletonDashboard />}

        {status && (
          <div className="space-y-3">
            {/* ── Status + key stats ────────────────────── */}
            <Card>
              <CardContent className="p-4">
                {/* Live running indicator (Real-Time Monitoring pattern) */}
                <div className="flex items-center gap-2.5 mb-4 pb-3.5 border-b border-[var(--border)]">
                  <span className="relative flex h-2.5 w-2.5 shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--ok)] opacity-50" />
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[var(--ok)]" />
                  </span>
                  <span className="text-xs font-semibold text-[var(--ok)] uppercase tracking-wider">
                    {isRtl ? "الخادم يعمل" : "Server running"}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                  <StatCell icon={<Network className="w-3.5 h-3.5" />} label={isRtl ? "المضيف" : "Host"} value={`${status.host}:${status.port}`} />
                  <StatCell icon={<Plug    className="w-3.5 h-3.5" />} label={isRtl ? "المزوّد" : "Provider"} value={status.provider} />
                  <div className="col-span-2">
                    <StatCell icon={<Cpu className="w-3.5 h-3.5" />} label={isRtl ? "النموذج النشط" : "Active model"} value={status.model} />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* ── Restart warning ───────────────────────── */}
            {status.pending_fields.length > 0 && (
              <Card className="border-[var(--warn)]">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-3.5 h-3.5 text-[var(--warn)] shrink-0" />
                    <p className="text-xs font-semibold text-[var(--warn)] uppercase tracking-wider">
                      {isRtl ? "يتطلب إعادة تشغيل" : "Restart required"}
                    </p>
                  </div>
                  <ul className="space-y-0.5 ps-5">
                    {status.pending_fields.map((f) => (
                      <li key={f} className="text-xs text-[var(--text-secondary)] list-disc font-mono" dir="ltr">{f}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* ── Provider status — Real-Time Monitoring grid ─ */}
            <Card>
              <CardHeader className="px-4 pt-4 pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                    {isRtl ? "حالة المزوّدين" : "Provider Status"}
                  </CardTitle>
                  {/* Live refresh dot */}
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--info)] opacity-60" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[var(--info)]" />
                  </span>
                </div>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                  {status.provider_status.map((p) => {
                    const s = STATUS_COLOR[p.status] ?? { dot: "bg-[var(--text-muted)]", text: "text-[var(--text-muted)]", label: p.label };
                    return (
                      <div key={p.provider_id} className="flex items-center gap-2 min-w-0" dir="ltr">
                        <StatusDot colorClass={s.dot} status={p.status} />
                        <span className="text-[11px] font-mono text-[var(--text-secondary)] truncate flex-1">
                          {p.provider_id}
                        </span>
                        <span className={cn("text-[10px] font-medium shrink-0", s.text)}>
                          {p.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* ── Cached models ────────────────────────────── */}
            {Object.keys(status.cached_models).length > 0 && (
              <Card>
                <CardHeader className="px-4 pt-4 pb-2">
                  <CardTitle className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                    {isRtl ? "النماذج المخزّنة" : "Cached Models"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-4 pb-4 space-y-2.5">
                  {Object.entries(status.cached_models).map(([pid, models]) => (
                    <div key={pid} dir="ltr">
                      <p className="text-[11px] font-mono font-semibold text-[var(--text-secondary)] mb-0.5">{pid}</p>
                      <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">
                        {models.slice(0, 3).join(", ")}
                        {models.length > 3 && (
                          <span className="ms-1.5 inline-flex items-center px-1.5 py-0.5 rounded-full bg-[var(--surface-raised)] text-[10px] font-medium text-[var(--text-muted)]">
                            +{models.length - 3}
                          </span>
                        )}
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </Shell>
  );
}

/* ── Status dot with pulse for live states ── */
function StatusDot({ colorClass, status }: { colorClass: string; status: string }) {
  const isLive = status === "configured" || status === "reachable";
  return (
    <span className="relative flex h-2 w-2 shrink-0">
      {isLive && (
        <span className={cn("animate-ping absolute inline-flex h-full w-full rounded-full opacity-40", colorClass)} />
      )}
      <span className={cn("relative inline-flex h-2 w-2 rounded-full", colorClass)} />
    </span>
  );
}

/* ── Stat cell with icon label ── */
function StatCell({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div>
      <div className="flex items-center gap-1.5 text-[var(--text-muted)] mb-1">
        {icon}
        <span className="text-[10px] uppercase tracking-wider font-semibold">{label}</span>
      </div>
      <p className="text-sm font-mono text-[var(--foreground)] truncate" dir="ltr">{value}</p>
    </div>
  );
}
