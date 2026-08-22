"use client";

import * as React from "react";
import { DoctorSidebar } from "@/components/doctor/DoctorSidebar";
import { AccessCodeInput } from "@/components/doctor/AccessCodeInput";
import { PatientCard } from "@/components/doctor/PatientCard";
import { mockPatient, mockUsers } from "@/data/mockData";
import { Users, ShieldCheck } from "lucide-react";

export default function DoctorDashboardPage() {
  const doctor = mockUsers.doctor;

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex">
      {/* Sidebar */}
      <DoctorSidebar />

      {/* Main Content Area */}
      <div className="flex-1 md:pl-60 lg:pl-64 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="bg-white border-b border-slate-200/80 sticky top-0 z-20 px-4 sm:px-8 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shadow-2xs">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#0F172A] tracking-tight">
              Clinician Dashboard
            </h1>
            <p className="text-xs text-slate-500 mt-0.5 font-normal">
              {doctor.name} &bull; {doctor.specialty} &bull; License: {doctor.licenseNumber}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-[#0F9D94] text-xs font-semibold border border-teal-200/80">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>HIPAA Compliant Session</span>
            </span>
          </div>
        </header>

        {/* Content Body */}
        <main className="p-4 sm:p-8 max-w-6xl w-full mx-auto space-y-8">
          {/* Section 1: Access Code Input */}
          <AccessCodeInput />

          {/* Section 2: Recently Accessed Patients */}
          <div id="patients" className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-[#0F172A] flex items-center gap-2">
                  <Users className="w-5 h-5 text-[#0F9D94]" />
                  <span>Authorized Patients</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5 font-normal">
                  Patients who have granted temporary access to their consolidated medical history
                </p>
              </div>
              <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1 rounded-full border border-slate-200/60">
                1 Patient Active
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <PatientCard patient={mockPatient} lastAccessed="Just now" />
            </div>
          </div>

          {/* Safety Notice for Doctor */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 text-xs text-slate-500 leading-relaxed max-w-3xl shadow-xs">
            <div className="flex items-center gap-1.5 font-bold text-slate-700 mb-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#0F9D94]" />
              <span>Clinical Decision Support Boundary</span>
            </div>
            MedBrief AI consolidates patient records and extracts structured clinical facts with source evidence. It does not replace clinical judgment or independent diagnosis. Always verify critical findings with original records.
          </div>
        </main>
      </div>
    </div>
  );
}
