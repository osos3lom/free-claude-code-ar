"use client";

import { useState } from "react";
import { Cloud, Server, CheckCircle2, AlertTriangle, XCircle, HelpCircle, Loader2 } from "lucide-react";
import { adminApi, type ProviderStatus } from "@/lib/api";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface Props {
  provider: ProviderStatus;
  cachedModels?: string[];
  lang: "ar" | "en";
}

const STATUS_ICON: Record<string, React.ReactNode> = {
  configured: <CheckCircle2 className="w-3.5 h-3.5 text-[var(--ok)]" />,
  reachable:  <CheckCircle2 className="w-3.5 h-3.5 text-[var(--ok)]" />,
  missing_key: <AlertTriangle className="w-3.5 h-3.5 text-[var(--warn)]" />,
  missing_url: <AlertTriangle className="w-3.5 h-3.5 text-[var(--warn)]" />,
  offline:     <XCircle className="w-3.5 h-3.5 text-[var(--error)]" />,
};

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
  const statusIcon = STATUS_ICON[provider.status] ?? <HelpCircle className="w-3.5 h-3.5 text-[var(--text-muted)]" />;
  const KindIcon = provider.kind === "local" ? Server : Cloud;

  return (
    <Card className="group cursor-default transition-all duration-200 hover:shadow-lg hover:shadow-black/30 hover:border-[var(--border)] hover:-translate-y-px">
      <CardContent className="p-3.5 flex flex-col gap-2.5">
        {/* Header row */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-1.5 min-w-0">
            {statusIcon}
            <span className="text-sm font-medium truncate" dir="ltr">
              {provider.provider_id}
            </span>
          </div>
          <StatusBadge status={provider.status} label={provider.label} />
        </div>

        {/* Kind + URL row */}
        <div className="flex items-center gap-1.5 text-[var(--text-muted)]">
          <KindIcon className="w-3 h-3 shrink-0" />
          <span className="text-[11px]">
            {provider.kind === "local"
              ? isRtl ? "محلّي" : "Local"
              : isRtl ? "سحابي" : "Remote"}
          </span>
          {provider.base_url && (
            <>
              <span className="text-[var(--border)]">·</span>
              <span className="text-[11px] font-mono truncate" dir="ltr">
                {provider.base_url}
              </span>
            </>
          )}
        </div>

        {/* Test result */}
        {testResult && (
          <div
            className={cn(
              "text-xs px-2.5 py-1.5 rounded-md",
              testResult.ok
                ? "text-[var(--ok)] bg-[rgba(62,207,142,0.1)]"
                : "text-[var(--error)] bg-[rgba(239,68,68,0.1)]",
            )}
            dir="ltr"
          >
            {testResult.ok
              ? modelCount === 0
                ? isRtl ? "لا نماذج" : "No models found"
                : isRtl ? `✓ ${modelCount} نموذج` : `✓ ${modelCount} models`
              : testResult.error_type ?? "Error"}
          </div>
        )}

        {/* Model list (collapsible) */}
        {models.length > 0 && (
          <details className="text-xs group/details">
            <summary className="cursor-pointer select-none text-[var(--text-muted)] hover:text-[var(--foreground)] transition-colors list-none flex items-center gap-1">
              <span className="text-[10px] bg-[var(--surface-raised)] px-1.5 py-0.5 rounded-full font-medium">
                {models.length}
              </span>
              {isRtl ? "نموذج متاح" : "models available"}
            </summary>
            <ul className="mt-1.5 space-y-0.5 max-h-32 overflow-y-auto">
              {models.slice(0, 20).map((m) => (
                <li
                  key={m}
                  className="text-[11px] text-[var(--text-secondary)] font-mono truncate"
                  dir="ltr"
                >
                  {m}
                </li>
              ))}
              {models.length > 20 && (
                <li className="text-[11px] text-[var(--text-muted)]">
                  +{models.length - 20} more
                </li>
              )}
            </ul>
          </details>
        )}

        {/* Actions */}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleTest}
          disabled={testing}
          className="self-end h-7 text-xs gap-1.5"
        >
          {testing && <Loader2 className="w-3 h-3 animate-spin" />}
          {testing
            ? isRtl ? "جارٍ الاختبار" : "Testing…"
            : isRtl ? "اختبار الاتصال" : "Test connection"}
        </Button>
      </CardContent>
    </Card>
  );
}
