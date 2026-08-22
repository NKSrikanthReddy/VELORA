import * as React from "react";
import { Patient } from "@/types/medical";
import { FileText, CalendarDays, AlertTriangle, ShieldCheck } from "lucide-react";

interface PatientStatsProps {
  patient: Patient;
}

export function PatientStats({ patient }: PatientStatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
          <FileText className="w-5 h-5" />
        </div>
        <div>
          <div className="text-xs text-slate-500 font-medium">Uploaded Records</div>
          <div className="text-lg font-bold text-slate-900">{patient.documentCount} Documents</div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
          <CalendarDays className="w-5 h-5" />
        </div>
        <div>
          <div className="text-xs text-slate-500 font-medium">Medical Timeline</div>
          <div className="text-lg font-bold text-slate-900">{patient.medicalEventCount} Events (2022-2026)</div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-amber-200 bg-amber-50/30 flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div>
          <div className="text-xs text-amber-800 font-medium">Clinical Discrepancy</div>
          <div className="text-sm font-bold text-amber-900">1 Medication Conflict Flagged</div>
        </div>
      </div>
    </div>
  );
}
