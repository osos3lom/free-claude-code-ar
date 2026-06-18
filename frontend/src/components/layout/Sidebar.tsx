"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Plug,
  Sliders,
  MessageSquare,
  Mic,
  Globe,
  BarChart3,
  Languages,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/useAppStore";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const NAV_ITEMS = [
  { key: "dashboard",  href: "/dashboard", labelAr: "لوحة التحكم",  labelEn: "Dashboard",    Icon: LayoutDashboard },
  { key: "providers",  href: "/providers",  labelAr: "المزوّدون",    labelEn: "Providers",     Icon: Plug            },
  { key: "models",     href: "/models",     labelAr: "إعداد النماذج", labelEn: "Model Config",  Icon: Sliders         },
  { key: "messaging",  href: "/messaging",  labelAr: "المراسلة",     labelEn: "Messaging",     Icon: MessageSquare   },
  { key: "voice",      href: "/voice",      labelAr: "الصوت",        labelEn: "Voice",         Icon: Mic             },
  { key: "webTools",   href: "/web-tools",  labelAr: "أدوات الويب",  labelEn: "Web Tools",     Icon: Globe           },
  { key: "metrics",    href: "/metrics",    labelAr: "المقاييس",     labelEn: "Metrics",       Icon: BarChart3       },
] as const;

interface SidebarProps {
  onNavigate?: () => void;
}

export function Sidebar({ onNavigate }: SidebarProps = {}) {
  const pathname = usePathname();
  const { lang, setLang } = useAppStore();
  const isRtl = lang === "ar";

  function isActive(href: string) {
    if (href === "/dashboard") return pathname === "/" || pathname === "/dashboard";
    return pathname === href || pathname.startsWith(href + "/");
  }

  return (
    <aside className="w-56 shrink-0 flex flex-col border-e border-[var(--border)] bg-[var(--surface)]">
      {/* Logo */}
      <div className="h-14 px-4 flex items-center gap-2.5 border-b border-[var(--border)] shrink-0">
        <div className="w-7 h-7 rounded-lg bg-[var(--accent)] text-white text-[11px] font-bold flex items-center justify-center shrink-0 shadow-sm">
          FC
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold leading-tight truncate">Free Claude Code</p>
          <p className="text-[11px] text-[var(--text-muted)] leading-tight">
            {isRtl ? "تحكّم الخادم" : "Server Control"}
          </p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-2 px-2 space-y-0.5">
        {NAV_ITEMS.map(({ key, href, labelAr, labelEn, Icon }) => {
          const active = isActive(href);
          return (
            <Link
              key={key}
              href={href}
              onClick={onNavigate}
              className={cn(
                "group flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-all duration-150",
                active
                  ? "bg-[var(--accent-dim)] text-[var(--accent)] font-medium"
                  : "text-[var(--text-secondary)] hover:bg-[var(--surface-raised)] hover:text-[var(--foreground)]",
              )}
            >
              <Icon
                className={cn(
                  "w-4 h-4 shrink-0 transition-colors",
                  active
                    ? "text-[var(--accent)]"
                    : "text-[var(--text-muted)] group-hover:text-[var(--foreground)]",
                )}
              />
              <span className="truncate">{isRtl ? labelAr : labelEn}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="shrink-0 px-2 py-2 border-t border-[var(--border)]">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setLang(isRtl ? "en" : "ar")}
          className="w-full justify-start gap-2.5 px-3 text-xs text-[var(--text-muted)] hover:text-[var(--foreground)]"
        >
          <Languages className="w-3.5 h-3.5 shrink-0" />
          {isRtl ? "English" : "عربي"}
        </Button>
      </div>
    </aside>
  );
}
