"use client";

import { Database } from "lucide-react";
import { Shell } from "@/components/layout/Shell";
import { PageHeader } from "@/components/layout/PageHeader";
import { useAppStore } from "@/store/useAppStore";

export default function MetricsPage() {
  const { lang } = useAppStore();
  const isRtl = lang === "ar";

  return (
    <Shell>
      <div className="p-6 max-w-2xl">
        <PageHeader
          title={isRtl ? "المقاييس" : "Metrics"}
          description={
            isRtl
              ? "تتبّع الطلبات والرموز والاستجابة عبر الزمن"
              : "Track requests, tokens, and response times over time"
          }
        />

        {/* Empty state */}
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-14 h-14 rounded-2xl bg-[var(--surface-raised)] flex items-center justify-center mb-5 shadow-sm">
            <Database className="w-6 h-6 text-[var(--text-muted)]" />
          </div>

          <h3 className="text-sm font-semibold mb-1.5">
            {isRtl ? "لا توجد بيانات بعد" : "No metrics yet"}
          </h3>

          <p className="text-xs text-[var(--text-muted)] max-w-[280px] leading-relaxed mb-5">
            {isRtl
              ? "أضف قاعدة بيانات PostgreSQL لتفعيل تتبّع الطلبات والرموز والأداء بمرور الوقت."
              : "Connect a PostgreSQL database to enable request tracking, token counts, and latency metrics over time."}
          </p>

          <div className="rounded-lg bg-[var(--surface-raised)] border border-[var(--border)] px-4 py-2.5">
            <p className="text-[11px] text-[var(--text-muted)] mb-1.5 font-medium uppercase tracking-wider">
              {isRtl ? "متغير البيئة" : "Environment variable"}
            </p>
            <code className="text-xs font-mono text-[var(--text-secondary)]" dir="ltr">
              DATABASE_URL=postgresql://user:pass@host/db
            </code>
          </div>
        </div>
      </div>
    </Shell>
  );
}
