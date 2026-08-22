"use client";

import * as React from "react";
import { PatientSidebar } from "@/components/patient/PatientSidebar";
import { MedicalBriefing } from "@/components/medical/MedicalBriefing";
import { MedicalTimeline } from "@/components/medical/MedicalTimeline";
import { DiagnosisList } from "@/components/medical/DiagnosisList";
import { MedicationList } from "@/components/medical/MedicationList";
import { LabResults } from "@/components/medical/LabResults";
import { DocumentList } from "@/components/patient/DocumentList";
import { EvidenceModal } from "@/components/evidence/EvidenceModal";
import {
  mockBriefing,
  mockTimelineEvents,
  mockDiagnoses,
  mockMedications,
  mockLabResults,
  mockDocuments,
  mockPatient,
} from "@/data/mockData";
import { Evidence } from "@/types/medical";
import {
  Sparkles,
  Clock,
  Activity,
  Pill,
  FlaskConical,
  FileText,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function PatientHistoryPage() {
  const [activeTab, setActiveTab] = React.useState<
    "briefing" | "timeline" | "diagnoses" | "medications" | "labs" | "documents"
  >("briefing");
  const [selectedEvidence, setSelectedEvidence] = React.useState<Evidence | null>(null);

  const tabs = [
    { id: "briefing", label: "AI Summary", icon: Sparkles },
    { id: "timeline", label: "Timeline", icon: Clock },
    { id: "diagnoses", label: "Diagnoses", icon: Activity },
    { id: "medications", label: "Medications", icon: Pill },
    { id: "labs", label: "Lab Results", icon: FlaskConical },
    { id: "documents", label: "Documents", icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <PatientSidebar />

      {/* Main Content Area */}
      <div className="flex-1 md:pl-60 lg:pl-64 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="bg-white border-b border-slate-200 sticky top-0 z-20 px-4 sm:px-8 py-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Medical History &amp; Clinical Briefing
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Consolidated history for {mockPatient.name} &bull; {mockPatient.age}y, {mockPatient.gender} &bull; 4-Year Timeline
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto mt-4 pt-1 border-t border-slate-100">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={cn(
                    "flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer",
                    isActive
                      ? "bg-teal-600 text-white shadow-xs"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  )}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </header>

        {/* Content Body */}
        <main className="p-4 sm:p-8 max-w-7xl w-full mx-auto space-y-6">
          {activeTab === "briefing" && (
            <MedicalBriefing
              briefing={mockBriefing}
              onViewEvidence={setSelectedEvidence}
            />
          )}

          {activeTab === "timeline" && (
            <MedicalTimeline
              events={mockTimelineEvents}
              onViewEvidence={setSelectedEvidence}
            />
          )}

          {activeTab === "diagnoses" && (
            <div className="space-y-4">
              <h2 className="text-base font-bold text-slate-900">
                Documented Diagnoses
              </h2>
              <DiagnosisList
                diagnoses={mockDiagnoses}
                onViewEvidence={setSelectedEvidence}
              />
            </div>
          )}

          {activeTab === "medications" && (
            <div className="space-y-4">
              <h2 className="text-base font-bold text-slate-900">
                Active &amp; Historical Prescriptions
              </h2>
              <MedicationList
                medications={mockMedications}
                onViewEvidence={setSelectedEvidence}
              />
            </div>
          )}

          {activeTab === "labs" && (
            <div className="space-y-4">
              <h2 className="text-base font-bold text-slate-900">
                Extracted Biomarkers &amp; Lab Panels
              </h2>
              <LabResults
                labResults={mockLabResults}
                onViewEvidence={setSelectedEvidence}
              />
            </div>
          )}

          {activeTab === "documents" && (
            <div className="space-y-4">
              <h2 className="text-base font-bold text-slate-900">
                All Uploaded Documents
              </h2>
              <DocumentList documents={mockDocuments} />
            </div>
          )}

          {/* Safety Footer */}
          <div className="flex items-center justify-center gap-2 text-xs text-slate-400 py-4">
            <ShieldCheck className="w-4 h-4 text-teal-600" />
            <span>MedBrief AI organizes records. Clinical decisions must always be made by a qualified healthcare professional.</span>
          </div>
        </main>
      </div>

      {/* Global Evidence Modal */}
      <EvidenceModal
        evidence={selectedEvidence}
        isOpen={!!selectedEvidence}
        onClose={() => setSelectedEvidence(null)}
      />
    </div>
  );
}
