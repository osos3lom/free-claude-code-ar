import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Free Claude Code",
  description: "Server control panel",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body className="h-full">{children}</body>
    </html>
  );
}
