"use client";

import { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import { Shell } from "@/components/layout/Shell";
import { PageHeader } from "@/components/layout/PageHeader";
import { ProviderCard } from "@/components/providers/ProviderCard";
import { ConfigForm } from "@/components/config/ConfigForm";
import { SkeletonCards, SkeletonForm } from "@/components/shared/Skeleton";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
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

  const localStatusMap = Object.fromEntries(localStatus.map((l) => [l.provider_id, l]));

  const enrichedProviders = config
    ? config.provider_status.map((p) => {
        const local = localStatusMap[p.provider_id];
        return local ? { ...p, status: local.status, label: local.label } : p;
      })
    : [];

  return (
    <Shell>
      <div className="p-6 max-w-4xl">
        <PageHeader
          title={isRtl ? "المزوّدون" : "Providers"}
          description={
            isRtl
              ? "إدارة مزوّدي النماذج واختبار الاتصال"
              : "Manage AI model providers and test connectivity"
          }
          actions={
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={loadingRefresh || !config}
              className="gap-1.5 h-8 text-xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loadingRefresh ? "animate-spin" : ""}`} />
              {loadingRefresh
                ? isRtl ? "جارٍ التحديث…" : "Refreshing…"
                : isRtl ? "تحديث النماذج" : "Refresh models"}
            </Button>
          }
        />

        {!config ? (
          <SkeletonCards count={6} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
            {enrichedProviders.map((p) => (
              <ProviderCard key={p.provider_id} provider={p} lang={lang} />
            ))}
          </div>
        )}

        <Separator className="my-6" />

        <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-4">
          {isRtl ? "إعدادات المزوّدين" : "Provider Settings"}
        </h2>

        {!config ? (
          <SkeletonForm />
        ) : (
          <ConfigForm
            sections={config.sections}
            fields={config.fields}
            sectionFilter={["providers"]}
          />
        )}
      </div>
    </Shell>
  );
}
