"use client";

import * as React from "react";
import Link from "next/link";
import { PatientSidebar } from "@/components/patient/PatientSidebar";
import { DashboardStats } from "@/components/patient/DashboardStats";
import { DocumentList } from "@/components/patient/DocumentList";
import { Button } from "@/components/ui/Button";
import {
  getMyPatientProfile,
  getPatientDocuments,
  getPatientAccessCodes,
  USE_MOCK,
} from "@/lib/api";
import { Patient, MedicalDocument, DoctorAccess } from "@/types/medical";
import { mockPatient, mockDocuments, mockDoctorAccess } from "@/data/mockData";
import {
  UploadCloud,
  ArrowRight,
  ShieldCheck,
  KeyRound,
  Clock,
  Sparkles,
  Loader2,
} from "lucide-react";

export default function PatientDashboardPage() {
  const [patient, setPatient] = React.useState<Patient>(mockPatient);
  const [documents, setDocuments] = React.useState<MedicalDocument[]>(mockDocuments);
  const [accessList, setAccessList] = React.useState<DoctorAccess[]>(mockDoctorAccess);
  const [isLoading, setIsLoading] = React.useState(!USE_MOCK);

  const loadData = React.useCallback(async () => {
    if (USE_MOCK) return;
    try {
      setIsLoading(true);
      const pat = await getMyPatientProfile();
      setPatient(pat);

      const [docs, codes] = await Promise.all([
        getPatientDocuments(pat.id).catch(() => []),
        getPatientAccessCodes(pat.id).catch(() => []),
      ]);

      if (docs.length > 0) setDocuments(docs);
      if (codes.length > 0) setAccessList(codes);
    } catch (err) {
      console.warn("Could not fetch live patient data:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  const activeAccess = accessList.find((a) => a.active);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex">
      {/* Sidebar */}
      <PatientSidebar />

      {/* Main Content Area */}
      <div className="flex-1 md:pl-60 lg:pl-64 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="bg-white border-b border-slate-200/80 sticky top-0 z-20 px-4 sm:px-8 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shadow-2xs">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#0F172A] tracking-tight">
              My Medical Records
            </h1>
            <p className="text-xs text-slate-500 mt-0.5 font-normal">
              Consolidated medical history for {patient.name} ({patient.age}y, {patient.gender})
            </p>
          </div>
          <div className="flex items-center gap-2.5">
            <Link href="/patient/history">
              <Button variant="outline" size="sm" className="font-medium">
                <Clock className="w-4 h-4" />
                <span>View Timeline</span>
              </Button>
            </Link>
            <Link href="/patient/upload">
              <Button size="sm" className="font-semibold shadow-xs">
                <UploadCloud className="w-4 h-4" />
                <span>Upload Documents</span>
              </Button>
            </Link>
          </div>
        </header>

        {/* Dashboard Body */}
        <main className="p-4 sm:p-8 max-w-7xl w-full mx-auto space-y-6">
          {isLoading ? (
            <div className="flex items-center justify-center p-12 bg-white rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex items-center gap-3 text-sm text-slate-600 font-medium">
                <Loader2 className="w-5 h-5 text-[#0F9D94] animate-spin" />
                <span>Loading medical dashboard records...</span>
              </div>
            </div>
          ) : (
            <>
              {/* Summary Stats Cards */}
              <DashboardStats />

              {/* Quick Doctor Access Banner */}
              <div className="bg-[#0F172A] rounded-2xl p-6 sm:p-7 text-white shadow-md border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 relative overflow-hidden">
                <div className="absolute right-0 top-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

                <div className="space-y-2 max-w-xl relative z-10">
                  <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-slate-800 text-cyan-300 text-xs font-semibold border border-slate-700">
                    <KeyRound className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Active Doctor Authorization</span>
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold tracking-tight">
                    {activeAccess ? (
                      <>1 Active Doctor Access: {activeAccess.doctorName}</>
                    ) : (
                      <>Share Your Records With a Doctor</>
                    )}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                    {activeAccess ? (
                      <>
                        Access Code <code className="bg-slate-800 text-cyan-300 px-2.5 py-1 rounded-md font-mono font-bold tracking-wider text-xs border border-slate-700">{activeAccess.accessCode}</code> is valid until {activeAccess.expiresAt}. Your doctor can review clinical briefings and ask questions.
                      </>
                    ) : (
                      <>Generate a temporary code to grant your clinician time-limited access.</>
                    )}
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0 relative z-10">
                  <Link href="/patient/access">
                    <Button
                      variant="subtle"
                      size="sm"
                      className="bg-white text-slate-900 hover:bg-slate-100 font-bold border-0 h-10 px-4"
                    >
                      <span>Manage Access</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Grid Layout: Recent Documents & Snapshot */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left 2 Cols: Recent Documents */}
                <div className="lg:col-span-2 space-y-3.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-base font-bold text-[#0F172A]">
                        Recent Documents
                      </h2>
                      <p className="text-xs text-slate-500">
                        Showing latest uploaded prescriptions, reports &amp; summaries
                      </p>
                    </div>
                    <Link
                      href="/patient/upload"
                      className="text-xs font-bold text-[#0F9D94] hover:text-[#0D8B83] flex items-center gap-1"
                    >
                      <span>Upload More</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  <DocumentList documents={documents} limit={5} />
                </div>

                {/* Right 1 Col: Quick Medical Snapshot */}
                <div className="space-y-4">
                  <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
                    <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                      <div className="w-8 h-8 rounded-xl bg-teal-50 text-[#0F9D94] flex items-center justify-center shadow-2xs">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <h3 className="font-bold text-sm text-[#0F172A]">
                        Medical Summary Snapshot
                      </h3>
                    </div>

                    <div className="space-y-3 text-xs text-slate-600">
                      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100/90">
                        <span className="font-bold text-slate-900 block mb-1">
                          Major Diagnoses
                        </span>
                        <ul className="list-disc list-inside text-slate-600 space-y-0.5">
                          <li>Type 2 Diabetes (2022)</li>
                          <li>Essential Hypertension (2024)</li>
                        </ul>
                      </div>

                      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100/90">
                        <span className="font-bold text-slate-900 block mb-1">
                          Active Medications
                        </span>
                        <p className="text-slate-600 leading-relaxed">
                          Metformin (dosage review flagged), Telmisartan 40mg, Atorvastatin 10mg
                        </p>
                      </div>

                      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100/90">
                        <span className="font-bold text-slate-900 block mb-1">
                          Latest Biomarker
                        </span>
                        <p className="text-slate-700 font-medium">
                          HbA1c: <span className="text-amber-800 font-bold">7.4%</span> (12 Jun 2025)
                        </p>
                      </div>
                    </div>

                    <div className="pt-2">
                      <Link href="/patient/history">
                        <Button variant="outline" size="sm" className="w-full text-xs font-semibold">
                          <span>View Full History &amp; Timeline</span>
                          <ArrowRight className="w-3.5 h-3.5 ml-1" />
                        </Button>
                      </Link>
                    </div>
                  </div>

                  {/* Safety card */}
                  <div className="bg-slate-100/70 rounded-2xl p-4 border border-slate-200/80 text-[11px] text-slate-500 leading-relaxed shadow-2xs">
                    <div className="flex items-center gap-1.5 font-bold text-slate-700 mb-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#0F9D94]" />
                      <span>Clinical Disclaimer</span>
                    </div>
                    MedBrief AI organizes documents for review. It does not replace medical advice from your physician.
                  </div>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
