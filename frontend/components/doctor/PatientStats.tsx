import * as React from "react";
import { Patient } from "@/types/medical";
import { FileText, CalendarDays, AlertTriangle } from "lucide-react";

interface PatientStatsProps {
  patient: Patient;
}

export function PatientStats({ patient }: PatientStatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3.5 hover:border-slate-300 transition-all">
        <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100 text-[#0F9D94] flex items-center justify-center shrink-0 shadow-2xs">
          <FileText className="w-5 h-5" />
        </div>
        <div>
          <div className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">
            Consolidated Documents
          </div>
          <div className="text-lg font-bold text-[#0F172A] mt-0.5">
            {patient.documentCount} Uploaded Files
          </div>
        </div>
      </div>

      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3.5 hover:border-slate-300 transition-all">
        <div className="w-10 h-10 rounded-xl bg-cyan-50 border border-cyan-100 text-cyan-700 flex items-center justify-center shrink-0 shadow-2xs">
          <CalendarDays className="w-5 h-5" />
        </div>
        <div>
          <div className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">
            Longitudinal Timeline
          </div>
          <div className="text-lg font-bold text-[#0F172A] mt-0.5">
            {patient.medicalEventCount} Events (2022–2026)
          </div>
        </div>
      </div>

      <div className="bg-white p-5 rounded-2xl border border-amber-200/90 bg-amber-50/20 shadow-xs flex items-center gap-3.5 hover:border-amber-300 transition-all">
        <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 shadow-2xs">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div>
          <div className="text-[11px] text-amber-800 font-semibold uppercase tracking-wider">
            Dosage Discrepancy Flag
          </div>
          <div className="text-sm font-bold text-amber-900 mt-0.5">
            1 Medication Conflict Identified
          </div>
        </div>
      </div>
    </div>
  );
}
