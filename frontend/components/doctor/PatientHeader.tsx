import * as React from "react";
import { Patient } from "@/types/medical";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  User,
  Phone,
  AlertCircle,
  FileText,
  CalendarDays,
  ShieldCheck,
  Sparkles,
  Clock,
  Search,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

interface PatientHeaderProps {
  patient: Patient;
  onScrollToChat?: () => void;
  onScrollToTimeline?: () => void;
}

export function PatientHeader({
  patient,
  onScrollToChat,
  onScrollToTimeline,
}: PatientHeaderProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Patient Identity Meta */}
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-teal-600 text-white flex items-center justify-center font-bold text-xl shadow-xs shrink-0">
            {patient.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                {patient.name}
              </h1>
              <Badge variant="success" size="sm">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                <span>Doctor Access Verified</span>
              </Badge>
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-500 flex-wrap">
              <span className="font-semibold text-slate-700">
                {patient.age} years &bull; {patient.gender}
              </span>
              <span>&bull;</span>
              <span>DOB: {patient.dateOfBirth || "1984-05-14"}</span>
              <span>&bull;</span>
              <span>Blood Group: <strong className="text-slate-800">{patient.bloodGroup || "B+"}</strong></span>
            </div>

            {patient.emergencyContact && (
              <div className="text-[11px] text-slate-400 flex items-center gap-1.5 pt-0.5">
                <Phone className="w-3 h-3 text-slate-400" />
                <span>Emergency: {patient.emergencyContact}</span>
              </div>
            )}
          </div>
        </div>

        {/* Action Jump Buttons */}
        <div className="flex items-center gap-2 self-start lg:self-center flex-wrap">
          {onScrollToTimeline && (
            <Button
              variant="outline"
              size="sm"
              onClick={onScrollToTimeline}
              className="text-xs"
            >
              <Clock className="w-3.5 h-3.5 mr-1" />
              <span>Jump to Timeline</span>
            </Button>
          )}
          {onScrollToChat && (
            <Button
              size="sm"
              onClick={onScrollToChat}
              className="text-xs font-semibold bg-teal-600 hover:bg-teal-700"
            >
              <Search className="w-3.5 h-3.5 mr-1" />
              <span>Ask My Records</span>
            </Button>
          )}
        </div>
      </div>

      {/* Highlights Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-100 text-xs">
        <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
          <span className="text-[11px] text-slate-400 block font-medium">
            Consolidated Documents
          </span>
          <span className="text-base font-bold text-slate-900">
            {patient.documentCount} Files
          </span>
        </div>

        <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
          <span className="text-[11px] text-slate-400 block font-medium">
            Extracted Timeline Events
          </span>
          <span className="text-base font-bold text-slate-900">
            {patient.medicalEventCount} Events
          </span>
        </div>

        <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
          <span className="text-[11px] text-slate-400 block font-medium">
            Timeline Span
          </span>
          <span className="text-base font-bold text-slate-900">
            2022 &ndash; 2026
          </span>
        </div>

        <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
          <span className="text-[11px] text-slate-400 block font-medium">
            Last Record Processed
          </span>
          <span className="text-base font-bold text-slate-900">
            {formatDate(patient.lastUpdated)}
          </span>
        </div>
      </div>
    </div>
  );
}
