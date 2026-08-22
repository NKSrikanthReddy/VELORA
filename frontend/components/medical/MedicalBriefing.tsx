"use client";

import * as React from "react";
import { MedicalBriefing as MedicalBriefingType, Evidence } from "@/types/medical";
import { BriefingCard } from "./BriefingCard";
import { DiagnosisList } from "./DiagnosisList";
import { MedicationList } from "./MedicationList";
import { LabResults } from "./LabResults";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  Sparkles,
  User,
  Activity,
  Pill,
  FlaskConical,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";

interface MedicalBriefingProps {
  briefing: MedicalBriefingType;
  onViewEvidence: (evidence: Evidence) => void;
}

export function MedicalBriefing({
  briefing,
  onViewEvidence,
}: MedicalBriefingProps) {
  return (
    <div className="space-y-6">
      {/* Flagship Header Banner */}
      <div className="bg-[#0F172A] rounded-2xl p-6 sm:p-7 text-white shadow-md border border-slate-800 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 bottom-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/90 text-cyan-300 text-xs font-semibold border border-slate-700 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>AI Clinical Briefing &bull; Longitudinal Synthesis</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
              Executive Clinical Overview
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
              Synthesized from 12 medical records across 4+ years of patient history. Every clinical claim is grounded in verifiable source documents.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Badge variant="success" size="md" className="bg-teal-950/90 text-teal-300 border-teal-700/70 py-1.5 px-3">
              <ShieldCheck className="w-4 h-4 text-teal-400" />
              <span>Evidence-Backed Briefing</span>
            </Badge>
          </div>
        </div>
      </div>

      {/* SECTION 1: Patient Overview */}
      <BriefingCard
        title="Patient Overview"
        icon={<User className="w-4 h-4 text-[#0F9D94]" />}
        variant="highlight"
      >
        <div className="space-y-3">
          <p className="text-sm sm:text-base text-slate-900 leading-relaxed font-medium">
            {briefing.patientOverview}
          </p>
          <div className="flex items-center gap-2 pt-2 border-t border-slate-100 flex-wrap">
            <span className="text-[11px] text-slate-400">
              Primary Sources: Initial Consultation (2022) &amp; Discharge Summary (2025)
            </span>
            {briefing.majorDiagnoses[0]?.evidence[0] && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onViewEvidence(briefing.majorDiagnoses[0].evidence[0])}
                className="text-xs text-[#0F9D94] hover:bg-teal-50 h-7 px-2.5 font-semibold"
              >
                <span>View Source</span>
                <ExternalLink className="w-3 h-3 ml-1" />
              </Button>
            )}
          </div>
        </div>
      </BriefingCard>

      {/* SECTION 2: Major Diagnoses */}
      <BriefingCard
        title="Major Diagnoses"
        icon={<Activity className="w-4 h-4 text-[#0F9D94]" />}
        badge={
          <Badge variant="info" size="sm">
            {briefing.majorDiagnoses.length} Documented
          </Badge>
        }
      >
        <DiagnosisList
          diagnoses={briefing.majorDiagnoses}
          onViewEvidence={onViewEvidence}
        />
      </BriefingCard>

      {/* SECTION 3: Current & Historical Medications (With Conflict Warning) */}
      <BriefingCard
        title="Documented Medications"
        icon={<Pill className="w-4 h-4 text-[#0F9D94]" />}
        badge={
          <Badge variant="warning" size="sm">
            1 Conflict Flagged
          </Badge>
        }
      >
        <MedicationList
          medications={briefing.medications}
          onViewEvidence={onViewEvidence}
        />
      </BriefingCard>

      {/* SECTION 4: Important Lab Results */}
      <BriefingCard
        title="Important Biomarkers &amp; Lab Results"
        icon={<FlaskConical className="w-4 h-4 text-[#0F9D94]" />}
        badge={
          <Badge variant="cyan" size="sm">
            {briefing.importantLabResults.length} Panels
          </Badge>
        }
      >
        <LabResults
          labResults={briefing.importantLabResults}
          onViewEvidence={onViewEvidence}
        />
      </BriefingCard>

      {/* SECTION 5 & 6: Important Points & Uncertain Information Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Important Points */}
        <BriefingCard
          title="Key Clinical Findings"
          icon={<CheckCircle2 className="w-4 h-4 text-[#0F9D94]" />}
        >
          <ul className="space-y-3 text-xs sm:text-sm text-slate-700">
            {briefing.importantPoints.map((point, index) => (
              <li key={index} className="flex items-start gap-2.5 leading-relaxed">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0F9D94] shrink-0 mt-2" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </BriefingCard>

        {/* Uncertain / Missing Information */}
        <BriefingCard
          title="Uncertain &amp; Missing Information"
          icon={<AlertTriangle className="w-4 h-4 text-amber-600" />}
          variant="warning"
        >
          <ul className="space-y-3 text-xs sm:text-sm text-amber-950">
            {briefing.uncertainInformation.map((item, index) => (
              <li key={index} className="flex items-start gap-2.5 leading-relaxed">
                <HelpCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </BriefingCard>
      </div>
    </div>
  );
}
