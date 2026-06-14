"use client";

import { useEffect } from "react";
import { useAppStore } from "@/store/useAppStore";

export function DirectionSync() {
  const { lang } = useAppStore();
  useEffect(() => {
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = lang;
  }, [lang]);
  return null;
}
