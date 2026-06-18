"use client";

import { useEffect, useState } from "react";
import { Shell } from "@/components/layout/Shell";
import { PageHeader } from "@/components/layout/PageHeader";
import { ConfigForm } from "@/components/config/ConfigForm";
import { SkeletonForm } from "@/components/shared/Skeleton";
import { adminApi, type ConfigResponse } from "@/lib/api";
import { useAppStore } from "@/store/useAppStore";

export default function VoicePage() {
  const { lang } = useAppStore();
  const isRtl = lang === "ar";
  const [config, setConfig] = useState<ConfigResponse | null>(null);

  useEffect(() => {
    adminApi.getConfig().then(setConfig);
  }, []);

  return (
    <Shell>
      <div className="p-6 max-w-2xl">
        <PageHeader
          title={isRtl ? "الصوت" : "Voice"}
          description={
            isRtl
              ? "إعداد تحويل النص إلى كلام والكلام إلى نص"
              : "Configure text-to-speech and speech-to-text settings"
          }
        />
        {!config ? <SkeletonForm /> : (
          <ConfigForm
            sections={config.sections}
            fields={config.fields}
            sectionFilter={["voice"]}
          />
        )}
      </div>
    </Shell>
  );
}
