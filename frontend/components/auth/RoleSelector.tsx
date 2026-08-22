"use client";

import * as React from "react";
import { UserRole } from "@/types/medical";
import { User, Stethoscope, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface RoleSelectorProps {
  selectedRole: UserRole;
  onSelectRole: (role: UserRole) => void;
}

export function RoleSelector({
  selectedRole,
  onSelectRole,
}: RoleSelectorProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
      {/* Patient Role Option */}
      <button
        type="button"
        onClick={() => onSelectRole("patient")}
        className={cn(
          "relative flex flex-col items-start p-4 rounded-2xl border-2 text-left transition-all duration-200 cursor-pointer shadow-2xs",
          selectedRole === "patient"
            ? "border-[#0F9D94] bg-teal-50/40 text-slate-900 shadow-xs"
            : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
        )}
      >
        <div className="flex items-center justify-between w-full mb-2">
          <div
            className={cn(
              "w-9 h-9 rounded-xl flex items-center justify-center shadow-2xs",
              selectedRole === "patient"
                ? "bg-[#0F9D94] text-white"
                : "bg-slate-100 text-slate-600"
            )}
          >
            <User className="w-4.5 h-4.5" />
          </div>
          {selectedRole === "patient" && (
            <CheckCircle2 className="w-5 h-5 text-[#0F9D94]" />
          )}
        </div>
        <div className="font-bold text-sm text-[#0F172A]">Patient</div>
        <p className="text-xs text-slate-500 mt-0.5 leading-relaxed font-normal">
          Consolidate records, view timeline &amp; generate doctor access codes.
        </p>
      </button>

      {/* Doctor Role Option */}
      <button
        type="button"
        onClick={() => onSelectRole("doctor")}
        className={cn(
          "relative flex flex-col items-start p-4 rounded-2xl border-2 text-left transition-all duration-200 cursor-pointer shadow-2xs",
          selectedRole === "doctor"
            ? "border-cyan-500 bg-cyan-50/30 text-slate-900 shadow-xs"
            : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
        )}
      >
        <div className="flex items-center justify-between w-full mb-2">
          <div
            className={cn(
              "w-9 h-9 rounded-xl flex items-center justify-center shadow-2xs",
              selectedRole === "doctor"
                ? "bg-[#0F172A] text-cyan-400"
                : "bg-slate-100 text-slate-600"
            )}
          >
            <Stethoscope className="w-4.5 h-4.5" />
          </div>
          {selectedRole === "doctor" && (
            <CheckCircle2 className="w-5 h-5 text-cyan-600" />
          )}
        </div>
        <div className="font-bold text-sm text-[#0F172A]">Doctor / Clinician</div>
        <p className="text-xs text-slate-500 mt-0.5 leading-relaxed font-normal">
          Enter patient code, inspect clinical briefing, timeline &amp; evidence.
        </p>
      </button>
    </div>
  );
}
