"use client";

import { useCallback, useEffect, useState } from "react";
import { Shell } from "@/components/layout/Shell";
import { PageHeader } from "@/components/layout/PageHeader";
import { ConfigForm } from "@/components/config/ConfigForm";
import { SkeletonForm } from "@/components/shared/Skeleton";
import { RoutingModeSwitch } from "@/components/models/RoutingModeSwitch";
import { adminApi, type ConfigResponse } from "@/lib/api";
import { useAppStore } from "@/store/useAppStore";

export default function ModelsPage() {
  const { lang } = useAppStore();
  const isRtl = lang === "ar";
  const [config, setConfig] = useState<ConfigResponse | null>(null);

  const loadConfig = useCallback(() => {
    adminApi.getConfig().then(setConfig);
  }, []);

  useEffect(() => {
    loadConfig();
  }, [loadConfig]);

  return (
    <Shell>
      <div className="p-6 max-w-2xl">
        <PageHeader
          title={isRtl ? "إعداد النماذج" : "Model Config"}
          description={
            isRtl
              ? "اختر النموذج الافتراضي وإعدادات التفكير"
              : "Configure the default model and thinking parameters"
          }
        />
        {!config ? (
          <SkeletonForm />
        ) : (
          <>
            <RoutingModeSwitch
              fields={config.fields}
              isRtl={isRtl}
              onApplied={loadConfig}
            />
            <ConfigForm
              sections={config.sections}
              fields={config.fields}
              sectionFilter={["models", "thinking"]}
            />
          </>
        )}
      </div>
    </Shell>
  );
}
