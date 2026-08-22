import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MedBrief AI | AI-Powered Medical Record Consolidation & Clinical Briefing",
  description:
    "AI-powered medical record organization, clinical timeline reconstruction, and evidence-linked clinical briefing for patients and physicians.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full bg-slate-50 text-slate-900 flex flex-col font-sans">
        {children}
      </body>
    </html>
  );
}
