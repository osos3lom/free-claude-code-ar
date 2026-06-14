"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/useAppStore";

const NAV_ITEMS = [
  { key: "dashboard", href: "/", labelAr: "لوحة التحكم", labelEn: "Dashboard" },
  { key: "providers", href: "/providers", labelAr: "المزوّدون", labelEn: "Providers" },
  { key: "models", href: "/models", labelAr: "إعداد النماذج", labelEn: "Model Config" },
  { key: "messaging", href: "/messaging", labelAr: "المراسلة", labelEn: "Messaging" },
  { key: "voice", href: "/voice", labelAr: "الصوت", labelEn: "Voice" },
  { key: "webTools", href: "/web-tools", labelAr: "أدوات الويب", labelEn: "Web Tools" },
  { key: "metrics", href: "/metrics", labelAr: "المقاييس", labelEn: "Metrics" },
] as const;

export function Sidebar() {
  const pathname = usePathname();
  const { lang, setLang } = useAppStore();

  return (
    <aside className="w-52 shrink-0 flex flex-col border-e border-[var(--border)] bg-[var(--surface)]">
      <div className="p-4 border-b border-[var(--border)]">
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded bg-[var(--accent)] text-white text-xs font-bold flex items-center justify-center"
            aria-hidden="true"
          >
            FC
          </div>
          <div>
            <p className="text-sm font-semibold leading-tight">Free Claude Code</p>
            <p className="text-xs text-[var(--text-muted)]">
              {lang === "ar" ? "تحكّم الخادم" : "Server Control"}
            </p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-2 space-y-0.5">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.key}
              href={item.href}
              className={cn(
                "flex items-center px-3 py-2 rounded text-sm transition-colors",
                isActive
                  ? "bg-[var(--accent-dim)] text-[var(--accent)] font-medium"
                  : "text-[var(--text-secondary)] hover:bg-[var(--surface-raised)] hover:text-[var(--foreground)]",
              )}
            >
              {lang === "ar" ? item.labelAr : item.labelEn}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-[var(--border)]">
        <button
          type="button"
          onClick={() => setLang(lang === "ar" ? "en" : "ar")}
          className="w-full text-xs text-[var(--text-muted)] hover:text-[var(--foreground)] py-1 transition-colors"
        >
          {lang === "ar" ? "English" : "عربي"}
        </button>
      </div>
    </aside>
  );
}
