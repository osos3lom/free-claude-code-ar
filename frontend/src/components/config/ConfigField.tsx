"use client";

import { cn } from "@/lib/utils";
import type { ConfigField as ConfigFieldSpec } from "@/lib/api";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const MASKED = "********";

interface Props {
  field: ConfigFieldSpec;
  lang: "ar" | "en";
  overrideValue?: string;
  onChange: (key: string, value: string) => void;
}

export function ConfigField({ field, lang, overrideValue, onChange }: Props) {
  const value = overrideValue !== undefined ? overrideValue : field.value;
  const isRtl = lang === "ar";

  const labelClass = "text-xs text-[var(--text-muted)] mb-1 flex items-center gap-1.5";
  const inputClass = cn(
    "w-full bg-[var(--surface-raised)] border border-[var(--border)] rounded px-3 py-1.5 text-sm",
    "focus:outline-none focus:border-[var(--accent)] transition-colors",
    field.locked && "opacity-50 cursor-not-allowed",
  );

  function handleChange(newValue: string) {
    if (!field.locked) onChange(field.key, newValue);
  }

  const label = field.label;

  const sourceTag = (
    <span className="text-[10px] px-1 rounded bg-[var(--surface)] text-[var(--text-muted)]">
      {field.source}
    </span>
  );

  if (field.type === "boolean") {
    const checked = value === "true";
    return (
      <div className="flex items-center justify-between py-2">
        <div>
          <span className="text-sm">{label}</span>
          {field.description && (
            <p className="text-xs text-[var(--text-muted)] mt-0.5">{field.description}</p>
          )}
        </div>
        {/* dir=ltr so thumb translation stays correct regardless of page RTL direction */}
        <div dir="ltr">
          <Switch
            checked={checked}
            disabled={field.locked}
            onCheckedChange={(c) => handleChange(c ? "true" : "false")}
          />
        </div>
      </div>
    );
  }

  if (field.type === "tri_boolean") {
    const opts = ["", "true", "false"];
    const labels = isRtl
      ? { "": "وراثة", true: "مفعّل", false: "معطّل" }
      : { "": "Inherit", true: "Enabled", false: "Disabled" };
    return (
      <div className="py-2">
        <p className={labelClass}>
          {label} {sourceTag}
        </p>
        <div className="flex gap-1.5">
          {opts.map((opt) => (
            <Button
              key={opt}
              type="button"
              variant="outline"
              size="sm"
              disabled={field.locked}
              onClick={() => handleChange(opt)}
              className={cn(
                "text-xs h-7 px-3",
                value === opt
                  ? "border-[var(--accent)] bg-[var(--accent-dim)] text-[var(--accent)]"
                  : "border-[var(--border)] text-[var(--text-muted)]",
              )}
            >
              {labels[opt as keyof typeof labels]}
            </Button>
          ))}
        </div>
        {field.description && (
          <p className="text-xs text-[var(--text-muted)] mt-1">{field.description}</p>
        )}
      </div>
    );
  }

  if (field.type === "select") {
    return (
      <div className="py-2">
        <p className={labelClass}>
          {label} {sourceTag}
        </p>
        <div dir="ltr">
          <Select value={value} disabled={field.locked} onValueChange={handleChange}>
            <SelectTrigger className="h-8 text-sm bg-[var(--surface-raised)] border-[var(--border)] focus:ring-[var(--accent)]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {field.options.map((opt) => (
                <SelectItem key={opt} value={opt}>
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {field.description && (
          <p className="text-xs text-[var(--text-muted)] mt-1">{field.description}</p>
        )}
      </div>
    );
  }

  if (field.type === "textarea") {
    return (
      <div className="py-2">
        <p className={labelClass}>
          {label} {sourceTag}
        </p>
        <textarea
          value={value}
          disabled={field.locked}
          onChange={(e) => handleChange(e.target.value)}
          rows={3}
          className={cn(inputClass, "resize-y")}
          style={{ direction: "ltr" }}
        />
        {field.description && (
          <p className="text-xs text-[var(--text-muted)] mt-1">{field.description}</p>
        )}
      </div>
    );
  }

  const isSecret = field.type === "secret";
  const placeholder = isSecret
    ? value === MASKED
      ? isRtl
        ? "مهيأ — أدخل قيمة جديدة للاستبدال"
        : "Configured – enter new value to replace"
      : isRtl
        ? "غير مهيأ"
        : "Not configured"
    : "";

  return (
    <div className="py-2">
      <p className={labelClass}>
        {label} {sourceTag}
        {field.restart_required && (
          <span className="text-[10px] text-[var(--warn)] px-1 rounded border border-[var(--warn)]">
            {isRtl ? "يتطلب إعادة تشغيل" : "restart"}
          </span>
        )}
      </p>
      <input
        type={isSecret ? "password" : field.type === "number" ? "number" : "text"}
        value={value === MASKED ? "" : value}
        placeholder={placeholder || field.key.toLowerCase()}
        disabled={field.locked}
        onChange={(e) => handleChange(e.target.value)}
        className={inputClass}
        style={{ direction: "ltr" }}
        autoComplete="off"
      />
      {field.description && (
        <p className="text-xs text-[var(--text-muted)] mt-1">{field.description}</p>
      )}
    </div>
  );
}
