"use client";

import * as React from "react";
import { PatientSidebar } from "@/components/patient/PatientSidebar";
import { AccessCodeCard } from "@/components/patient/AccessCodeCard";
import { ActiveAccessList } from "@/components/patient/ActiveAccessList";
import { mockDoctorAccess } from "@/data/mockData";
import { DoctorAccess } from "@/types/medical";
import { ShieldCheck, Info } from "lucide-react";

export default function PatientAccessPage() {
  const [accessList, setAccessList] = React.useState<DoctorAccess[]>(mockDoctorAccess);
  const [currentCode, setCurrentCode] = React.useState("MED-7K29X");
  const [expiresAt, setExpiresAt] = React.useState("30 August 2026");

  const handleGenerateNewCode = () => {
    const chars = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
    let newCode = "MED-";
    for (let i = 0; i < 5; i++) {
      newCode += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCurrentCode(newCode);
    setExpiresAt("30 September 2026");
  };

  const handleRevokeAccess = (accessId: string) => {
    setAccessList((prev) =>
      prev.map((item) =>
        item.id === accessId ? { ...item, active: false } : item
      )
    );
  };

  const handleRevokeAll = () => {
    setAccessList((prev) => prev.map((item) => ({ ...item, active: false })));
    setCurrentCode("");
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex">
      {/* Sidebar */}
      <PatientSidebar />

      {/* Main Content Area */}
      <div className="flex-1 md:pl-60 lg:pl-64 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="bg-white border-b border-slate-200/80 sticky top-0 z-20 px-4 sm:px-8 py-4 shadow-2xs">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#0F172A] tracking-tight">
              Doctor Access Management
            </h1>
            <p className="text-xs text-slate-500 mt-0.5 font-normal">
              Control which doctors can view your medical briefings and chronological history
            </p>
          </div>
        </header>

        {/* Content Body */}
        <main className="p-4 sm:p-8 max-w-5xl w-full mx-auto space-y-6">
          {/* Security Banner */}
          <div className="bg-teal-50/70 border border-teal-200/80 rounded-2xl p-4 sm:p-5 flex items-start gap-3 text-xs text-teal-950 shadow-2xs">
            <Info className="w-4 h-4 text-[#0F9D94] shrink-0 mt-0.5" />
            <div className="leading-relaxed font-normal">
              <strong className="font-semibold text-teal-900">Patient-Controlled Access:</strong> You hold full authority over your data. Doctors only receive temporary access while their code is valid. Revoking access terminates their session immediately.
            </div>
          </div>

          <AccessCodeCard
            accessCode={currentCode}
            expiresAt={expiresAt}
            onGenerateNewCode={handleGenerateNewCode}
            onRevokeAll={handleRevokeAll}
          />

          <ActiveAccessList
            accessList={accessList}
            onRevokeAccess={handleRevokeAccess}
          />

          <div className="flex items-center justify-center gap-2 text-xs text-slate-400 py-2">
            <ShieldCheck className="w-4 h-4 text-[#0F9D94]" />
            <span>All clinician queries and document views are audit-logged</span>
          </div>
        </main>
      </div>
    </div>
  );
}
