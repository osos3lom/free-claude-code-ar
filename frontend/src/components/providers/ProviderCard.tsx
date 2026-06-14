"use client";

import { useState } from "react";
import { adminApi, type ProviderStatus } from "@/lib/api";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { cn } from "@/lib/utils";

interface Props {
  provider: ProviderStatus;
  cachedModels?: string[];
  lang: "ar" | "en";
}

export function ProviderCard({ provider, cachedModels, lang }: Props) {
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    ok: boolean;
    models?: string[];
    error_type?: string;
  } | null>(null);

  const isRtl = lang === "ar";

  async function handleTest() {
    setTesting(true);
    setTestResult(null);
    try {
      const result = await adminApi.testProvider(provider.provider_id);
      setTestResult(result);
    } catch {
      setTestResult({ ok: false, error_type: "NetworkError" });
    } finally {
      setTesting(false);
    }
  }

  const modelCount = testResult?.models?.length ?? cachedModels?.length ?? 0;
  const models = testResult?.models ?? cachedModels ?? [];

  return (
    <div className="border border-[var(--border)] rounded-lg p-3 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{provider.provider_id}</span>
        <StatusBadge status={provider.status} label={provider.label} />
      </div>

      {provider.kind === "local" && provider.base_url && (
        <p className="text-xs text-[var(--text-muted)]" style={{ direction: "ltr" }}>
          {provider.base_url}
        </p>
      )}

      {testResult && (
        <div
          className={cn(
            "text-xs px-2 py-1 rounded",
            testResult.ok
              ? "text-[var(--ok)] bg-[rgba(62,207,142,0.1)]"
              : "text-[var(--error)] bg-[rgba(239,68,68,0.1)]",
          )}
        >
          {testResult.ok
            ? modelCount === 0
              ? isRtl ? "لا نماذج" : "No models"
              : isRtl ? `${modelCount} نموذج` : `${modelCount} models`
            : testResult.error_type ?? "Error"}
        </div>
      )}

      {models.length > 0 && (
        <details className="text-xs">
          <summary className="cursor-pointer text-[var(--text-muted)]">
            {isRtl ? `${models.length} نموذج` : `${models.length} models`}
          </summary>
          <ul className="mt-1 space-y-0.5 ps-2">
            {models.slice(0, 20).map((m) => (
              <li key={m} className="text-[var(--text-secondary)]" style={{ direction: "ltr" }}>
                {m}
              </li>
            ))}
            {models.length > 20 && (
              <li className="text-[var(--text-muted)]">+{models.length - 20} more</li>
            )}
          </ul>
        </details>
      )}

      <button
        type="button"
        onClick={handleTest}
        disabled={testing}
        className="text-xs px-3 py-1 rounded border border-[var(--border)] hover:border-[var(--accent)] disabled:opacity-40 transition-colors self-end"
      >
        {testing ? (isRtl ? "جارٍ الاختبار" : "Testing…") : isRtl ? "اختبار" : "Test"}
      </button>
    </div>
  );
}
