"use client";

import { useEffect, useState } from "react";
import { Shell } from "@/components/layout/Shell";
import { ProviderCard } from "@/components/providers/ProviderCard";
import { ConfigForm } from "@/components/config/ConfigForm";
import { adminApi, type ConfigResponse, type LocalProviderCheck } from "@/lib/api";
import { useAppStore } from "@/store/useAppStore";

export default function ProvidersPage() {
  const { lang } = useAppStore();
  const isRtl = lang === "ar";
  const [config, setConfig] = useState<ConfigResponse | null>(null);
  const [localStatus, setLocalStatus] = useState<LocalProviderCheck[]>([]);
  const [loadingRefresh, setLoadingRefresh] = useState(false);

  useEffect(() => {
    adminApi.getConfig().then(setConfig);
    adminApi.getLocalStatus().then((r) => setLocalStatus(r.providers));
  }, []);

  async function handleRefresh() {
    setLoadingRefresh(true);
    await adminApi.refreshModels();
    const updated = await adminApi.getConfig();
    setConfig(updated);
    setLoadingRefresh(false);
  }

  if (!config) {
    return (
      <Shell>
        <div className="p-6 text-sm text-[var(--text-muted)]">
          {isRtl ? "جارٍ التحميل..." : "Loading…"}
        </div>
      </Shell>
    );
  }

  const localStatusMap = Object.fromEntries(localStatus.map((l) => [l.provider_id, l]));

  const enrichedProviders = config.provider_status.map((p) => {
    const local = localStatusMap[p.provider_id];
    if (local) {
      return { ...p, status: local.status, label: local.label };
    }
    return p;
  });

  return (
    <Shell>
      <div className="p-6 max-w-4xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-lg font-semibold">{isRtl ? "المزوّدون" : "Providers"}</h1>
          <button
            type="button"
            onClick={handleRefresh}
            disabled={loadingRefresh}
            className="text-xs px-3 py-1.5 rounded border border-[var(--border)] hover:border-[var(--accent)] disabled:opacity-40 transition-colors"
          >
            {loadingRefresh
              ? isRtl ? "جارٍ التحديث..." : "Refreshing…"
              : isRtl ? "تحديث النماذج" : "Refresh models"}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
          {enrichedProviders.map((p) => (
            <ProviderCard key={p.provider_id} provider={p} lang={lang} />
          ))}
        </div>

        <h2 className="text-base font-semibold mb-4">
          {isRtl ? "إعدادات المزوّدين" : "Provider Settings"}
        </h2>
        <ConfigForm
          sections={config.sections}
          fields={config.fields}
          sectionFilter={["providers"]}
        />
      </div>
    </Shell>
  );
}
