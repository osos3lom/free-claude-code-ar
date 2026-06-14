"use client";

import { useState } from "react";
import { adminApi, type ConfigField, type ConfigSection } from "@/lib/api";
import { useAppStore } from "@/store/useAppStore";
import { ConfigField as ConfigFieldComp } from "./ConfigField";
import { cn } from "@/lib/utils";

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
    <div className="flex flex-col gap-6">
      {visibleSections.map((section) => {
        const sectionFields = fieldsBySection[section.id] ?? [];
        if (sectionFields.length === 0) return null;
        return (
          <section key={section.id} className="border border-[var(--border)] rounded-lg p-4">
            <h3 className="text-sm font-semibold mb-0.5">{section.label}</h3>
            {section.description && (
              <p className="text-xs text-[var(--text-muted)] mb-3">{section.description}</p>
            )}
            <div className="divide-y divide-[var(--border)]">
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
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-xs text-[var(--text-muted)] hover:text-[var(--foreground)] text-start"
        >
          {showAdvanced
            ? isRtl ? "إخفاء المتقدّم" : "Hide advanced"
            : isRtl ? "إظهار المتقدّم" : "Show advanced"}
        </button>
      )}

      {message && (
        <div
          className={cn(
            "text-sm px-3 py-2 rounded",
            message.type === "ok" && "text-[var(--ok)] bg-[rgba(62,207,142,0.1)]",
            message.type === "error" && "text-[var(--error)] bg-[rgba(239,68,68,0.1)]",
            message.type === "warn" && "text-[var(--warn)] bg-[rgba(245,158,11,0.1)]",
          )}
        >
          {message.text}
        </div>
      )}

      {envPreview && (
        <details className="text-xs">
          <summary className="cursor-pointer text-[var(--text-muted)] hover:text-[var(--foreground)]">
            {isRtl ? "معاينة ملف .env" : ".env preview"}
          </summary>
          <pre className="mt-2 p-3 bg-[var(--surface)] rounded overflow-x-auto text-[var(--text-secondary)] whitespace-pre-wrap" style={{ direction: "ltr" }}>
            {envPreview}
          </pre>
        </details>
      )}

      <div className="flex items-center justify-between border-t border-[var(--border)] pt-4">
        <span className="text-sm text-[var(--text-muted)]">
          {dirtyCount === 0
            ? isRtl ? "لا تغييرات" : "No changes"
            : dirtyCount === 1
              ? isRtl ? "تغيير واحد غير محفوظ" : "1 unsaved change"
              : isRtl ? `${dirtyCount} تغييرات غير محفوظة` : `${dirtyCount} unsaved changes`}
        </span>
        <div className="flex gap-2">
          <button
            type="button"
            disabled={dirtyCount === 0 || loading !== null}
            onClick={handleValidate}
            className="px-4 py-1.5 text-sm rounded border border-[var(--border)] hover:border-[var(--accent)] disabled:opacity-40 transition-colors"
          >
            {loading === "validate"
              ? isRtl ? "جارٍ..." : "..."
              : isRtl ? "تحقّق" : "Validate"}
          </button>
          <button
            type="button"
            disabled={dirtyCount === 0 || loading !== null}
            onClick={handleApply}
            className="px-4 py-1.5 text-sm rounded bg-[var(--accent)] text-white hover:opacity-90 disabled:opacity-40 transition-opacity"
          >
            {loading === "apply"
              ? isRtl ? "جارٍ..." : "..."
              : isRtl ? "تطبيق" : "Apply"}
          </button>
        </div>
      </div>
    </div>
  );
}
