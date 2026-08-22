"use client";

import * as React from "react";
import { PatientSidebar } from "@/components/patient/PatientSidebar";
import { AccessCodeCard } from "@/components/patient/AccessCodeCard";
import { ActiveAccessList } from "@/components/patient/ActiveAccessList";
import {
  getMyPatientProfile,
  getPatientAccessCodes,
  generateDoctorAccessCode,
  revokeDoctorAccess,
  USE_MOCK,
} from "@/lib/api";
import { mockDoctorAccess, mockPatient } from "@/data/mockData";
import { DoctorAccess, Patient } from "@/types/medical";
import { ShieldCheck, Info, Loader2 } from "lucide-react";

export default function PatientAccessPage() {
  const [patient, setPatient] = React.useState<Patient>(mockPatient);
  const [accessList, setAccessList] = React.useState<DoctorAccess[]>(mockDoctorAccess);
  const [currentCode, setCurrentCode] = React.useState("MED-7K29X");
  const [expiresAt, setExpiresAt] = React.useState("30 August 2026");
  const [isLoading, setIsLoading] = React.useState(!USE_MOCK);

  const loadAccessData = React.useCallback(async () => {
    if (USE_MOCK) return;
    try {
      setIsLoading(true);
      const pat = await getMyPatientProfile();
      setPatient(pat);

      const codes = await getPatientAccessCodes(pat.id);
      if (codes && codes.length > 0) {
        setAccessList(codes);
        const active = codes.find((c) => c.active);
        if (active) {
          setCurrentCode(active.accessCode);
          setExpiresAt(active.expiresAt);
        }
      }
    } catch (err) {
      console.warn("Using fallback access codes:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadAccessData();
  }, [loadAccessData]);

  const handleGenerateNewCode = async () => {
    try {
      const newAccess = await generateDoctorAccessCode(patient.id);
      setCurrentCode(newAccess.accessCode);
      setExpiresAt(newAccess.expiresAt);
      setAccessList((prev) => [newAccess, ...prev]);
    } catch (err: any) {
      alert(`Failed to generate code: ${err.message}`);
    }
  };

  const handleRevokeAccess = async (accessId: string) => {
    try {
      await revokeDoctorAccess(patient.id, accessId);
      setAccessList((prev) =>
        prev.map((item) =>
          item.id === accessId ? { ...item, active: false } : item
        )
      );
    } catch (err: any) {
      alert(`Failed to revoke access: ${err.message}`);
    }
  };

  const handleRevokeAll = async () => {
    const activeOnes = accessList.filter((a) => a.active);
    for (const a of activeOnes) {
      await revokeDoctorAccess(patient.id, a.id).catch(() => {});
    }
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

          {isLoading ? (
            <div className="flex items-center justify-center p-12 bg-white rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex items-center gap-3 text-sm text-slate-600 font-medium">
                <Loader2 className="w-5 h-5 text-[#0F9D94] animate-spin" />
                <span>Loading access control records...</span>
              </div>
            </div>
          ) : (
            <>
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
            </>
          )}

          <div className="flex items-center justify-center gap-2 text-xs text-slate-400 py-2">
            <ShieldCheck className="w-4 h-4 text-[#0F9D94]" />
            <span>All clinician queries and document views are audit-logged</span>
          </div>
        </main>
      </div>
    </div>
  );
}
