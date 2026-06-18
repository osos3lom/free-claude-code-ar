import type { Metadata } from "next";
import { Fira_Code } from "next/font/google";
import "./globals.css";
import { DirectionSync } from "@/components/layout/DirectionSync";

// Fira Code: self-hosted via next/font → zero FOUT, no external link
// Used for model names, provider IDs, API keys (always LTR/ASCII)
const firaCode = Fira_Code({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Free Claude Code",
  description: "Server control panel",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className={`dark ${firaCode.variable}`}>
      <body className="h-full">
        <DirectionSync />
        {children}
      </body>
    </html>
  );
}
