"use client";

import { Shell } from "@/components/layout/Shell";
import { useAppStore } from "@/store/useAppStore";

export default function MetricsPage() {
  const { lang } = useAppStore();
  const isRtl = lang === "ar";

  return (
    <Shell>
      <div className="p-6 max-w-2xl">
        <h1 className="text-lg font-semibold mb-4">{isRtl ? "المقاييس" : "Metrics"}</h1>
        <div className="border border-[var(--border)] rounded-lg p-8 text-center">
          <p className="text-sm text-[var(--text-muted)]">
            {isRtl
              ? "لا توجد بيانات مقاييس. أضف DATABASE_URL لتفعيل تتبّع الطلبات."
              : "No metrics data. Add DATABASE_URL to enable request tracking."}
          </p>
          <p className="text-xs text-[var(--text-muted)] mt-2 font-mono" style={{ direction: "ltr" }}>
            DATABASE_URL=postgresql://...
          </p>
        </div>
      </div>
    </Shell>
  );
}
