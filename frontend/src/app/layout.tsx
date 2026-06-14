import type { Metadata } from "next";
import "./globals.css";
import { DirectionSync } from "@/components/layout/DirectionSync";

export const metadata: Metadata = {
  title: "Free Claude Code",
  description: "Server control panel",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body className="h-full">
        <DirectionSync />
        {children}
      </body>
    </html>
  );
}
