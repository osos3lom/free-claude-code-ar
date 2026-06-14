"use client";

import { useEffect, useState } from "react";
import { Shell } from "@/components/layout/Shell";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { adminApi, type AdminStatus } from "@/lib/api";
import { useAppStore } from "@/store/useAppStore";

export default function DashboardPage() {
  const { lang } = useAppStore();
  const isRtl = lang === "ar";
  const [status, setStatus] = useState<AdminStatus | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    adminApi
      .getStatus()
      .then(setStatus)
      .catch(() => setError(isRtl ? "تعذّر الاتصال بالخادم" : "Failed to connect to server"));
  }, [isRtl]);

  return (
    <Shell>
      <div className="p-6 max-w-2xl">
        <h1 className="text-lg font-semibold mb-4">{isRtl ? "لوحة التحكم" : "Dashboard"}</h1>

        {error && (
          <div className="text-sm text-[var(--error)] bg-[rgba(239,68,68,0.1)] px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {!status && !error && (
          <p className="text-sm text-[var(--text-muted)]">
            {isRtl ? "جارٍ تحميل الحالة" : "Loading status…"}
          </p>
        )}

        {status && (
          <div className="space-y-4">
            <div className="border border-[var(--border)] rounded-lg p-4 grid grid-cols-2 gap-3">
              <Stat label={isRtl ? "الحالة" : "Status"} value={isRtl ? "يعمل" : "Running"} ok />
              <Stat label={isRtl ? "المضيف" : "Host"} value={status.host} mono />
              <Stat label={isRtl ? "المنفذ" : "Port"} value={String(status.port)} mono />
              <Stat label={isRtl ? "المزوّد" : "Provider"} value={status.provider} mono />
              <div className="col-span-2">
                <Stat
                  label={isRtl ? "النموذج" : "Model"}
                  value={status.model}
                  mono
                />
              </div>
            </div>

            {status.pending_fields.length > 0 && (
              <div className="border border-[var(--warn)] rounded-lg p-4">
                <p className="text-sm font-medium text-[var(--warn)] mb-2">
                  {isRtl ? "حقول تتطلب إعادة تشغيل" : "Fields requiring restart"}
                </p>
                <ul className="space-y-1">
                  {status.pending_fields.map((f) => (
                    <li key={f} className="text-xs text-[var(--text-secondary)]" style={{ direction: "ltr" }}>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="border border-[var(--border)] rounded-lg p-4">
              <p className="text-sm font-medium mb-3">
                {isRtl ? "حالة المزوّدين" : "Provider Status"}
              </p>
              <div className="grid grid-cols-2 gap-2">
                {status.provider_status.map((p) => (
                  <div key={p.provider_id} className="flex items-center justify-between">
                    <span className="text-xs text-[var(--text-secondary)]">{p.provider_id}</span>
                    <StatusBadge status={p.status} label={p.label} />
                  </div>
                ))}
              </div>
            </div>

            {Object.keys(status.cached_models).length > 0 && (
              <div className="border border-[var(--border)] rounded-lg p-4">
                <p className="text-sm font-medium mb-2">
                  {isRtl ? "النماذج المخزّنة مؤقتاً" : "Cached Models"}
                </p>
                {Object.entries(status.cached_models).map(([pid, models]) => (
                  <div key={pid} className="mb-2">
                    <p className="text-xs font-medium text-[var(--text-muted)]">{pid}</p>
                    <p className="text-xs text-[var(--text-secondary)]">
                      {models.slice(0, 3).join(", ")}
                      {models.length > 3 ? ` +${models.length - 3}` : ""}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </Shell>
  );
}

function Stat({
  label,
  value,
  ok,
  mono,
}: {
  label: string;
  value: string;
  ok?: boolean;
  mono?: boolean;
}) {
  return (
    <div>
      <p className="text-xs text-[var(--text-muted)]">{label}</p>
      <p
        className={`text-sm mt-0.5 ${ok ? "text-[var(--ok)]" : "text-[var(--foreground)]"} ${mono ? "font-mono" : ""}`}
        style={mono ? { direction: "ltr" } : {}}
      >
        {value}
      </p>
    </div>
  );
}
