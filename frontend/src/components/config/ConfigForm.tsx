"use client";

import { useState } from "react";
import { adminApi, type ConfigField, type ConfigSection } from "@/lib/api";
import { useAppStore } from "@/store/useAppStore";
import { ConfigField as ConfigFieldComp } from "./ConfigField";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Props {
  sections: ConfigSection[];
  fields: ConfigField[];
  sectionFilter?: string[];
  onApplied?: () => void;
}

export function ConfigForm({ sections, fields, sectionFilter, onApplied }: Props) {
  const { lang, pendingValues, updatePendingValue, resetPendingValues, dirtyCount } =
    useAppStore();
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "error" | "warn"; text: string } | null>(
    null,
  );
  const [envPreview, setEnvPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState<"validate" | "apply" | null>(null);
  const isRtl = lang === "ar";

  const visibleSections = sectionFilter
    ? sections.filter((s) => sectionFilter.includes(s.id))
    : sections.filter((s) => !s.advanced || showAdvanced);

  const fieldsBySection = Object.fromEntries(
    sections.map((s) => [
      s.id,
      fields.filter(
        (f) => f.section === s.id && (showAdvanced || !f.advanced),
      ),
    ]),
  );

  async function handleValidate() {
    setLoading("validate");
    setMessage(null);
    try {
      const result = await adminApi.validate(pendingValues);
      setEnvPreview(result.env_preview);
      if (result.valid) {
        setMessage({ type: "ok", text: isRtl ? "شكل الإعداد صالح" : "Config shape is valid" });
      } else {
        setMessage({ type: "error", text: result.errors.join(", ") });
      }
    } catch {
      setMessage({ type: "error", text: isRtl ? "فشل التحقق" : "Validation failed" });
    } finally {
      setLoading(null);
    }
  }

  async function handleApply() {
    setLoading("apply");
    setMessage(null);
    try {
      const result = await adminApi.apply(pendingValues);
      if (!result.applied) {
        setMessage({ type: "error", text: result.errors.join(", ") });
        return;
      }
      resetPendingValues();
      setEnvPreview(null);
      if (result.restart?.required) {
        if (result.restart.automatic) {
          setMessage({
            type: "warn",
            text: isRtl ? "تم التطبيق. جارٍ إعادة تشغيل الخادم..." : "Applied. Restarting server...",
          });
        } else {
          setMessage({
            type: "warn",
            text: isRtl
              ? `تم التطبيق. أعد تشغيل fcc-server لاستخدام: ${result.pending_fields.join(", ")}`
              : `Applied. Restart fcc-server to apply: ${result.pending_fields.join(", ")}`,
          });
        }
      } else {
        setMessage({ type: "ok", text: isRtl ? "تم التطبيق" : "Applied" });
      }
      onApplied?.();
    } catch {
      setMessage({ type: "error", text: isRtl ? "فشل التطبيق" : "Apply failed" });
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="flex flex-col gap-5 pb-24">
      {visibleSections.map((section) => {
        const sectionFields = fieldsBySection[section.id] ?? [];
        if (sectionFields.length === 0) return null;
        return (
          <section key={section.id} className="rounded-lg border border-[var(--border)]">
            <div className="px-4 pt-3.5 pb-2.5 border-b border-[var(--border)] bg-[var(--surface)] rounded-t-lg">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                {section.label}
              </h3>
              {section.description && (
                <p className="text-xs text-[var(--text-muted)] mt-0.5 font-normal normal-case tracking-normal">
                  {section.description}
                </p>
              )}
            </div>
            <div className="divide-y divide-[var(--border)] px-4">
              {sectionFields.map((field) => (
                <ConfigFieldComp
                  key={field.key}
                  field={field}
                  lang={lang}
                  overrideValue={pendingValues[field.key]}
                  onChange={updatePendingValue}
                />
              ))}
            </div>
          </section>
        );
      })}

      {!sectionFilter && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-xs text-[var(--text-muted)] hover:text-[var(--foreground)] self-start px-0 h-auto"
        >
          {showAdvanced
            ? isRtl ? "إخفاء المتقدّم" : "Hide advanced"
            : isRtl ? "إظهار المتقدّم" : "Show advanced"}
        </Button>
      )}

      {envPreview && (
        <details className="text-xs">
          <summary className="cursor-pointer text-[var(--text-muted)] hover:text-[var(--foreground)]">
            {isRtl ? "معاينة ملف .env" : ".env preview"}
          </summary>
          <pre className="mt-2 p-3 bg-[var(--surface)] rounded-lg overflow-x-auto text-[var(--text-secondary)] whitespace-pre-wrap" style={{ direction: "ltr" }}>
            {envPreview}
          </pre>
        </details>
      )}

      {/* Sticky action bar — sticks to bottom of the main scroll container, not the viewport */}
      <div className="sticky bottom-0 z-10 pt-2 pb-4">
        <div className={cn(
            "flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 shadow-lg shadow-black/30 transition-all duration-200",
            dirtyCount === 0 ? "opacity-60" : "opacity-100",
          )}>
            <div className="flex items-center gap-2.5">
              {message ? (
                <span className={cn(
                  "text-xs",
                  message.type === "ok" && "text-[var(--ok)]",
                  message.type === "error" && "text-[var(--error)]",
                  message.type === "warn" && "text-[var(--warn)]",
                )}>
                  {message.text}
                </span>
              ) : (
                <span className="text-xs text-[var(--text-muted)]">
                  {dirtyCount === 0
                    ? isRtl ? "لا تغييرات" : "No changes"
                    : dirtyCount === 1
                      ? isRtl ? "تغيير واحد غير محفوظ" : "1 unsaved change"
                      : isRtl ? `${dirtyCount} تغييرات غير محفوظة` : `${dirtyCount} unsaved changes`}
                </span>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={dirtyCount === 0 || loading !== null}
                onClick={handleValidate}
                className="h-7 text-xs"
              >
                {loading === "validate"
                  ? isRtl ? "جارٍ..." : "…"
                  : isRtl ? "تحقّق" : "Validate"}
              </Button>
              <Button
                type="button"
                size="sm"
                disabled={dirtyCount === 0 || loading !== null}
                onClick={handleApply}
                className="h-7 text-xs"
              >
                {loading === "apply"
                  ? isRtl ? "جارٍ..." : "…"
                  : isRtl ? "تطبيق" : "Apply"}
              </Button>
            </div>
          </div>
      </div>
    </div>
  );
}
