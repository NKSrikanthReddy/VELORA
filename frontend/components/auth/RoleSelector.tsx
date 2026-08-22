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
          "relative flex flex-col items-start p-4 rounded-xl border-2 text-left transition-all cursor-pointer",
          selectedRole === "patient"
            ? "border-teal-600 bg-teal-50/40 text-teal-950 shadow-xs"
            : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
        )}
      >
        <div className="flex items-center justify-between w-full mb-2">
          <div
            className={cn(
              "w-9 h-9 rounded-lg flex items-center justify-center",
              selectedRole === "patient"
                ? "bg-teal-600 text-white"
                : "bg-slate-100 text-slate-600"
            )}
          >
            <User className="w-5 h-5" />
          </div>
          {selectedRole === "patient" && (
            <CheckCircle2 className="w-5 h-5 text-teal-600" />
          )}
        </div>
        <div className="font-semibold text-sm text-slate-900">Patient</div>
        <p className="text-xs text-slate-500 mt-0.5">
          Consolidate records, view timeline, and generate doctor access codes.
        </p>
      </button>

      {/* Doctor Role Option */}
      <button
        type="button"
        onClick={() => onSelectRole("doctor")}
        className={cn(
          "relative flex flex-col items-start p-4 rounded-xl border-2 text-left transition-all cursor-pointer",
          selectedRole === "doctor"
            ? "border-teal-600 bg-teal-50/40 text-teal-950 shadow-xs"
            : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
        )}
      >
        <div className="flex items-center justify-between w-full mb-2">
          <div
            className={cn(
              "w-9 h-9 rounded-lg flex items-center justify-center",
              selectedRole === "doctor"
                ? "bg-teal-600 text-white"
                : "bg-slate-100 text-slate-600"
            )}
          >
            <Stethoscope className="w-5 h-5" />
          </div>
          {selectedRole === "doctor" && (
            <CheckCircle2 className="w-5 h-5 text-teal-600" />
          )}
        </div>
        <div className="font-semibold text-sm text-slate-900">Doctor / Clinician</div>
        <p className="text-xs text-slate-500 mt-0.5">
          Enter patient code, inspect clinical briefing, timeline & evidence.
        </p>
      </button>
    </div>
  );
}
