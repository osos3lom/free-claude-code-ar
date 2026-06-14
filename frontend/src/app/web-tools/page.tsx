"use client";

import { useEffect, useState } from "react";
import { Shell } from "@/components/layout/Shell";
import { ConfigForm } from "@/components/config/ConfigForm";
import { adminApi, type ConfigResponse } from "@/lib/api";
import { useAppStore } from "@/store/useAppStore";

export default function WebToolsPage() {
  const { lang } = useAppStore();
  const isRtl = lang === "ar";
  const [config, setConfig] = useState<ConfigResponse | null>(null);

  useEffect(() => {
    adminApi.getConfig().then(setConfig);
  }, []);

  if (!config) {
    return (
      <Shell>
        <div className="p-6 text-sm text-[var(--text-muted)]">
          {isRtl ? "جارٍ التحميل..." : "Loading…"}
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <div className="p-6 max-w-2xl">
        <h1 className="text-lg font-semibold mb-6">{isRtl ? "أدوات الويب" : "Web Tools"}</h1>
        <ConfigForm
          sections={config.sections}
          fields={config.fields}
          sectionFilter={["web_tools"]}
        />
      </div>
    </Shell>
  );
}
