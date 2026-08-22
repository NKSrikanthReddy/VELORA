import * as React from "react";
import Link from "next/link";
import { Patient } from "@/types/medical";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  FileText,
  CalendarDays,
  Clock,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

interface PatientCardProps {
  patient: Patient;
  lastAccessed?: string;
}

export function PatientCard({
  patient,
  lastAccessed = "Today",
}: PatientCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-7 shadow-xs hover:border-[#0F9D94]/40 hover:shadow-md transition-all duration-200 flex flex-col justify-between space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-100 text-[#0F9D94] flex items-center justify-center font-bold text-sm shadow-2xs">
            {patient.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-base text-[#0F172A]">
                {patient.name}
              </h3>
              <Badge variant="success" size="sm">
                <ShieldCheck className="w-3 h-3 text-[#0F9D94]" />
                <span>Authorized</span>
              </Badge>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {patient.age} years &bull; {patient.gender} &bull; Blood: {patient.bloodGroup || "B+"}
            </p>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-3 py-3 border-y border-slate-100 text-xs">
        <div className="flex items-center gap-2 text-slate-700">
          <FileText className="w-4 h-4 text-[#0F9D94] shrink-0" />
          <span>
            <strong className="text-slate-900">{patient.documentCount}</strong> Documents
          </span>
        </div>
        <div className="flex items-center gap-2 text-slate-700">
          <CalendarDays className="w-4 h-4 text-cyan-600 shrink-0" />
          <span>
            <strong className="text-slate-900">{patient.medicalEventCount}</strong> Medical Events
          </span>
        </div>
      </div>

      {/* Key Diagnoses Preview */}
      <div className="space-y-1.5">
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
          Documented Conditions:
        </span>
        <div className="flex flex-wrap gap-1.5">
          <span className="bg-slate-50 text-slate-700 text-[11px] px-2.5 py-0.5 rounded-full font-medium border border-slate-200/80">
            Type 2 Diabetes
          </span>
          <span className="bg-slate-50 text-slate-700 text-[11px] px-2.5 py-0.5 rounded-full font-medium border border-slate-200/80">
            Essential Hypertension
          </span>
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <Clock className="w-3.5 h-3.5" />
          <span>Accessed: {lastAccessed}</span>
        </div>

        <Link href={`/doctor/patients/${patient.id}`}>
          <Button size="sm" className="text-xs font-semibold gap-1.5">
            <span>Open Medical History</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
