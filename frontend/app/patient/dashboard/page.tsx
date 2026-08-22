import * as React from "react";
import Link from "next/link";
import { PatientSidebar } from "@/components/patient/PatientSidebar";
import { DashboardStats } from "@/components/patient/DashboardStats";
import { DocumentList } from "@/components/patient/DocumentList";
import { Button } from "@/components/ui/Button";
import { mockDocuments, mockDoctorAccess, mockPatient } from "@/data/mockData";
import {
  UploadCloud,
  ArrowRight,
  ShieldCheck,
  KeyRound,
  FileText,
  Clock,
  Sparkles,
  Stethoscope,
} from "lucide-react";

export default function PatientDashboardPage() {
  const activeAccess = mockDoctorAccess.find((a) => a.active);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <PatientSidebar />

      {/* Main Content Area */}
      <div className="flex-1 md:pl-60 lg:pl-64 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="bg-white border-b border-slate-200 sticky top-0 z-20 px-4 sm:px-8 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              My Medical Records
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Consolidated medical history for {mockPatient.name} ({mockPatient.age}y, {mockPatient.gender})
            </p>
          </div>
          <div className="flex items-center gap-2.5">
            <Link href="/patient/history">
              <Button variant="outline" size="sm">
                <Clock className="w-4 h-4" />
                <span>View Timeline</span>
              </Button>
            </Link>
            <Link href="/patient/upload">
              <Button size="sm">
                <UploadCloud className="w-4 h-4" />
                <span>Upload Documents</span>
              </Button>
            </Link>
          </div>
        </header>

        {/* Dashboard Body */}
        <main className="p-4 sm:p-8 max-w-7xl w-full mx-auto space-y-6">
          {/* Summary Stats Cards */}
          <DashboardStats />

          {/* Quick Doctor Access Banner */}
          <div className="bg-gradient-to-r from-teal-900 to-slate-900 rounded-2xl p-6 text-white shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
            <div className="space-y-1.5 max-w-xl">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-800/80 text-teal-200 text-[11px] font-semibold border border-teal-700">
                <KeyRound className="w-3 h-3" />
                <span>Active Doctor Authorization</span>
              </div>
              <h2 className="text-lg font-bold tracking-tight">
                {activeAccess ? (
                  <>1 Active Doctor Access: {activeAccess.doctorName}</>
                ) : (
                  <>Share Your Records With a Doctor</>
                )}
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                {activeAccess ? (
                  <>
                    Access Code <code className="bg-teal-950 px-2 py-0.5 rounded text-teal-300 font-mono font-bold tracking-wider">{activeAccess.accessCode}</code> is valid until {activeAccess.expiresAt}. Your doctor can review clinical briefings and ask questions.
                  </>
                ) : (
                  <>Generate a temporary 4-digit or alphanumeric code to grant your clinician time-limited access.</>
                )}
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <Link href="/patient/access">
                <Button
                  variant="subtle"
                  size="sm"
                  className="bg-white text-slate-900 hover:bg-slate-100 font-semibold"
                >
                  <span>Manage Doctor Access</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Grid Layout: Recent Documents & AI Briefing Preview */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Recent Documents */}
            <div className="lg:col-span-2 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-semibold text-slate-900">
                    Recent Documents
                  </h2>
                  <p className="text-xs text-slate-500">
                    Showing latest uploaded prescriptions, reports, and summaries
                  </p>
                </div>
                <Link
                  href="/patient/upload"
                  className="text-xs font-semibold text-teal-600 hover:text-teal-700 flex items-center gap-1"
                >
                  <span>Upload More</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <DocumentList documents={mockDocuments} limit={5} />
            </div>

            {/* Right 1 Col: Quick Medical Snapshot */}
            <div className="space-y-4">
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <h3 className="font-semibold text-sm text-slate-900">
                    Medical Summary Snapshot
                  </h3>
                </div>

                <div className="space-y-3 text-xs text-slate-600">
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                    <span className="font-semibold text-slate-800 block mb-0.5">
                      Major Diagnoses
                    </span>
                    <ul className="list-disc list-inside text-slate-600 space-y-0.5">
                      <li>Type 2 Diabetes (2022)</li>
                      <li>Essential Hypertension (2024)</li>
                    </ul>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                    <span className="font-semibold text-slate-800 block mb-0.5">
                      Active Medications
                    </span>
                    <p className="text-slate-600">
                      Metformin (dosage review required), Telmisartan 40mg, Atorvastatin 10mg
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                    <span className="font-semibold text-slate-800 block mb-0.5">
                      Latest Lab Marker
                    </span>
                    <p className="text-slate-600 font-medium">
                      HbA1c: <span className="text-amber-700 font-semibold">7.4%</span> (12 Jun 2025)
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100">
                  <Link href="/patient/history">
                    <Button variant="outline" size="sm" className="w-full text-xs">
                      <span>View Full History &amp; Timeline</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Safety card */}
              <div className="bg-slate-100/70 rounded-xl p-4 border border-slate-200/80 text-[11px] text-slate-500 leading-relaxed">
                <div className="flex items-center gap-1.5 font-semibold text-slate-700 mb-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                  <span>Clinical Disclaimer</span>
                </div>
                MedBrief AI organizes documents for review. It does not replace medical advice from your physician.
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
