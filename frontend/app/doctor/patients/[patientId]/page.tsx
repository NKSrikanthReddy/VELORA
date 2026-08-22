"use client";

import * as React from "react";
import Link from "next/link";
import { DoctorSidebar } from "@/components/doctor/DoctorSidebar";
import { PatientHeader } from "@/components/doctor/PatientHeader";
import { PatientStats } from "@/components/doctor/PatientStats";
import { MedicalBriefing } from "@/components/medical/MedicalBriefing";
import { MedicalTimeline } from "@/components/medical/MedicalTimeline";
import { AskMyRecords } from "@/components/chat/AskMyRecords";
import { EvidenceModal } from "@/components/evidence/EvidenceModal";
import {
  mockPatient,
  mockBriefing,
  mockTimelineEvents,
} from "@/data/mockData";
import { Evidence } from "@/types/medical";
import {
  Sparkles,
  Clock,
  Search,
  ArrowLeft,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function DoctorPatientPage() {
  const [activeSection, setActiveSection] = React.useState<
    "briefing" | "timeline" | "chat"
  >("briefing");
  const [selectedEvidence, setSelectedEvidence] = React.useState<Evidence | null>(null);

  const briefingRef = React.useRef<HTMLDivElement>(null);
  const timelineRef = React.useRef<HTMLDivElement>(null);
  const chatRef = React.useRef<HTMLDivElement>(null);

  const scrollToSection = (sec: "briefing" | "timeline" | "chat") => {
    setActiveSection(sec);
    if (sec === "briefing") briefingRef.current?.scrollIntoView({ behavior: "smooth" });
    if (sec === "timeline") timelineRef.current?.scrollIntoView({ behavior: "smooth" });
    if (sec === "chat") chatRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex">
      {/* Sidebar */}
      <DoctorSidebar />

      {/* Main Content Area */}
      <div className="flex-1 md:pl-60 lg:pl-64 flex flex-col min-w-0">
        {/* Sticky Clinical Header Bar */}
        <header className="bg-white border-b border-slate-200/80 sticky top-0 z-20 px-4 sm:px-8 py-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-3">
            <Link href="/doctor/dashboard">
              <button
                className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
                title="Back to Patients"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-extrabold text-[#0F172A] tracking-tight">
                  {mockPatient.name}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  (ID: {mockPatient.id})
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-normal">
                Authorized clinical record &bull; Access valid until 30 Aug 2026
              </p>
            </div>
          </div>

          {/* Quick Navigation Tabs in Header */}
          <div className="flex items-center gap-1.5 overflow-x-auto">
            <button
              onClick={() => scrollToSection("briefing")}
              className={cn(
                "flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer",
                activeSection === "briefing"
                  ? "bg-[#0F9D94] text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200/80"
              )}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Clinical Briefing</span>
            </button>

            <button
              onClick={() => scrollToSection("timeline")}
              className={cn(
                "flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer",
                activeSection === "timeline"
                  ? "bg-[#0F9D94] text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200/80"
              )}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Timeline (2022–2026)</span>
            </button>

            <button
              onClick={() => scrollToSection("chat")}
              className={cn(
                "flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer",
                activeSection === "chat"
                  ? "bg-[#0F9D94] text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200/80"
              )}
            >
              <Search className="w-3.5 h-3.5" />
              <span>Ask My Records</span>
            </button>
          </div>
        </header>

        {/* Dashboard Body */}
        <main className="p-4 sm:p-8 max-w-6xl w-full mx-auto space-y-8">
          {/* Patient Demographic & Quick Highlights Header */}
          <PatientHeader
            patient={mockPatient}
            onScrollToChat={() => scrollToSection("chat")}
            onScrollToTimeline={() => scrollToSection("timeline")}
          />

          <PatientStats patient={mockPatient} />

          {/* SECTION 1: AI CLINICAL BRIEFING */}
          <section ref={briefingRef} className="scroll-mt-24 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-6 rounded-full bg-[#0F9D94]" />
                <h2 className="text-lg sm:text-xl font-extrabold text-[#0F172A] tracking-tight">
                  1. AI Medical Briefing
                </h2>
              </div>
              <span className="text-xs text-slate-500 font-medium hidden sm:inline">
                Instant synthesis for clinician review
              </span>
            </div>

            <MedicalBriefing
              briefing={mockBriefing}
              onViewEvidence={setSelectedEvidence}
            />
          </section>

          {/* SECTION 2: CHRONOLOGICAL MEDICAL TIMELINE */}
          <section ref={timelineRef} className="scroll-mt-24 space-y-4 pt-6 border-t border-slate-200/80">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-6 rounded-full bg-cyan-600" />
                <h2 className="text-lg sm:text-xl font-extrabold text-[#0F172A] tracking-tight">
                  2. Chronological Medical Timeline
                </h2>
              </div>
              <span className="text-xs text-slate-500 font-medium hidden sm:inline">
                Multi-year event progression
              </span>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-7 shadow-xs">
              <MedicalTimeline
                events={mockTimelineEvents}
                onViewEvidence={setSelectedEvidence}
              />
            </div>
          </section>

          {/* SECTION 3: ASK MY RECORDS Q&A ASSISTANT */}
          <section ref={chatRef} className="scroll-mt-24 space-y-4 pt-6 border-t border-slate-200/80">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-6 rounded-full bg-[#0F172A]" />
                <h2 className="text-lg sm:text-xl font-extrabold text-[#0F172A] tracking-tight">
                  3. Ask My Records Assistant
                </h2>
              </div>
              <span className="text-xs text-slate-500 font-medium hidden sm:inline">
                Evidence-grounded natural language search
              </span>
            </div>

            <AskMyRecords onViewEvidence={setSelectedEvidence} />
          </section>

          {/* Footer Safety Notice */}
          <div className="flex items-center justify-center gap-2 text-xs text-slate-400 py-6 border-t border-slate-200/80">
            <ShieldCheck className="w-4 h-4 text-[#0F9D94]" />
            <span>MedBrief AI &bull; Strict Record-Grounded Verification Architecture</span>
          </div>
        </main>
      </div>

      {/* Global Evidence Inspector Modal */}
      <EvidenceModal
        evidence={selectedEvidence}
        isOpen={!!selectedEvidence}
        onClose={() => setSelectedEvidence(null)}
      />
    </div>
  );
}
