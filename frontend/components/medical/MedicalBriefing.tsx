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
  Clock,
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
      <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-slate-900 rounded-2xl p-6 sm:p-7 text-white shadow-md border border-teal-800/60 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-800/90 text-teal-200 text-xs font-semibold border border-teal-600/50">
              <Sparkles className="w-3.5 h-3.5 text-teal-300" />
              <span>AI Clinical Briefing &bull; Consolidated Synthesis</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Executive Clinical Overview
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Synthesized from 12 medical records across 4+ years of patient history. All statements are linked to verifiable source documents.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Badge variant="success" size="md" className="bg-emerald-950/80 text-emerald-300 border-emerald-700/60 py-1.5 px-3">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Evidence-Backed Briefing</span>
            </Badge>
          </div>
        </div>
      </div>

      {/* SECTION 1: Patient Overview */}
      <BriefingCard
        title="Patient Overview"
        icon={<User className="w-4 h-4" />}
        variant="highlight"
      >
        <div className="space-y-3">
          <p className="text-sm text-slate-800 leading-relaxed font-medium">
            {briefing.patientOverview}
          </p>
          <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
            <span className="text-[11px] text-slate-400">
              Primary Reference: Initial Consultation (2022) &amp; Discharge Summary (2025)
            </span>
            {briefing.majorDiagnoses[0]?.evidence[0] && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onViewEvidence(briefing.majorDiagnoses[0].evidence[0])}
                className="text-xs text-teal-700 hover:bg-teal-50 h-7 px-2"
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
        icon={<Activity className="w-4 h-4" />}
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
        icon={<Pill className="w-4 h-4" />}
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
        icon={<FlaskConical className="w-4 h-4" />}
        badge={
          <Badge variant="info" size="sm">
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
          icon={<CheckCircle2 className="w-4 h-4 text-emerald-600" />}
        >
          <ul className="space-y-2.5 text-xs text-slate-700">
            {briefing.importantPoints.map((point, index) => (
              <li key={index} className="flex items-start gap-2.5 leading-relaxed">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-600 shrink-0 mt-1.5" />
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
          <ul className="space-y-2.5 text-xs text-amber-950">
            {briefing.uncertainInformation.map((item, index) => (
              <li key={index} className="flex items-start gap-2.5 leading-relaxed">
                <HelpCircle className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </BriefingCard>
      </div>
    </div>
  );
}
