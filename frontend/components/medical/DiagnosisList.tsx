"use client";

import * as React from "react";
import { Diagnosis, Evidence } from "@/types/medical";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Activity, ExternalLink, Calendar, CheckCircle2 } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface DiagnosisListProps {
  diagnoses: Diagnosis[];
  onViewEvidence: (evidence: Evidence) => void;
}

export function DiagnosisList({
  diagnoses,
  onViewEvidence,
}: DiagnosisListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {diagnoses.map((diag) => (
        <div
          key={diag.id}
          className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all flex flex-col justify-between space-y-3"
        >
          <div>
            <div className="flex items-start justify-between gap-2 mb-1.5">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-teal-50 text-teal-700 flex items-center justify-center">
                  <Activity className="w-3.5 h-3.5" />
                </div>
                <h4 className="font-bold text-sm text-slate-900">{diag.name}</h4>
              </div>
              <Badge variant="success" size="sm">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>Confirmed</span>
              </Badge>
            </div>

            {diag.description && (
              <p className="text-xs text-slate-500 leading-relaxed mt-1">
                {diag.description}
              </p>
            )}

            {diag.firstDocumentedDate && (
              <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-2">
                <Calendar className="w-3 h-3" />
                <span>First Documented: {formatDate(diag.firstDocumentedDate)}</span>
              </div>
            )}
          </div>

          {/* Evidence Triggers */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">
              {diag.evidence.length} Source Document{diag.evidence.length > 1 ? "s" : ""}
            </span>
            {diag.evidence.length > 0 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onViewEvidence(diag.evidence[0])}
                className="text-xs text-teal-700 hover:bg-teal-50 h-7 px-2"
              >
                <span>View Source</span>
                <ExternalLink className="w-3 h-3 ml-1" />
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
