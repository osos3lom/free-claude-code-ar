"use client";

import { useEffect, useState } from "react";
import { Shell } from "@/components/layout/Shell";
import { PageHeader } from "@/components/layout/PageHeader";
import { ConfigForm } from "@/components/config/ConfigForm";
import { SkeletonForm } from "@/components/shared/Skeleton";
import { adminApi, type ConfigResponse } from "@/lib/api";
import { useAppStore } from "@/store/useAppStore";

export default function MessagingPage() {
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
          title={isRtl ? "المراسلة" : "Messaging"}
          description={
            isRtl
              ? "إعداد بوتات المراسلة كـ Telegram وSlack"
              : "Configure messaging bots like Telegram and Slack"
          }
        />
        {!config ? <SkeletonForm /> : (
          <ConfigForm
            sections={config.sections}
            fields={config.fields}
            sectionFilter={["messaging"]}
          />
        )}
      </div>
    </Shell>
  );
}
