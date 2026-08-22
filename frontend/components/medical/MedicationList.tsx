"use client";

import * as React from "react";
import { Medication, Evidence } from "@/types/medical";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Pill, AlertTriangle, ExternalLink, ShieldAlert } from "lucide-react";

interface MedicationListProps {
  medications: Medication[];
  onViewEvidence: (evidence: Evidence) => void;
}

export function MedicationList({
  medications,
  onViewEvidence,
}: MedicationListProps) {
  return (
    <div className="space-y-4">
      {medications.map((med) => {
        const isConflict = med.hasConflict;

        return (
          <div
            key={med.id}
            className={`p-4 rounded-xl border transition-all ${
              isConflict
                ? "border-amber-300 bg-amber-50/40 shadow-xs"
                : "border-slate-200 bg-white hover:border-slate-300"
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                    isConflict
                      ? "bg-amber-100 text-amber-800"
                      : "bg-teal-50 text-teal-700"
                  }`}
                >
                  <Pill className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-bold text-sm text-slate-900">
                      {med.name}
                    </h4>
                    <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-200/80">
                      {med.dosage}
                    </span>
                    {isConflict ? (
                      <Badge variant="warning" size="sm">
                        <AlertTriangle className="w-3 h-3 text-amber-600" />
                        <span>Dosage Conflict</span>
                      </Badge>
                    ) : (
                      <Badge variant="success" size="sm">
                        Active
                      </Badge>
                    )}
                  </div>
                  {med.frequency && (
                    <p className="text-xs text-slate-500 mt-1">
                      Frequency: {med.frequency}
                    </p>
                  )}
                </div>
              </div>

              {/* View Source Actions */}
              <div className="flex items-center gap-1.5 self-end sm:self-start flex-wrap">
                {med.evidence.map((ev, idx) => (
                  <Button
                    key={ev.id}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => onViewEvidence(ev)}
                    className="h-7 text-xs px-2.5 bg-white border-slate-300 hover:bg-slate-50 text-slate-700"
                  >
                    <span>Source {med.evidence.length > 1 ? `#${idx + 1}` : ""}</span>
                    <ExternalLink className="w-3 h-3 ml-1 text-slate-400" />
                  </Button>
                ))}
              </div>
            </div>

            {/* Prominent Conflict Alert Box */}
            {isConflict && med.conflictDescription && (
              <div className="mt-3.5 p-3 rounded-lg bg-amber-100/70 border border-amber-300 text-xs text-amber-900 flex items-start gap-2.5">
                <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <strong>⚠ Conflicting information found:</strong> {med.conflictDescription}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
