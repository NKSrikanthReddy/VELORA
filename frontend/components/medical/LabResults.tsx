"use client";

import * as React from "react";
import { LabResult, Evidence } from "@/types/medical";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { FlaskConical, ExternalLink, Calendar, AlertCircle, CheckCircle2 } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface LabResultsProps {
  labResults: LabResult[];
  onViewEvidence: (evidence: Evidence) => void;
}

export function LabResults({ labResults, onViewEvidence }: LabResultsProps) {
  const getStatusBadge = (status?: LabResult["status"]) => {
    switch (status) {
      case "high":
        return (
          <Badge variant="warning" size="sm">
            <AlertCircle className="w-3 h-3 text-amber-600" />
            <span>Elevated</span>
          </Badge>
        );
      case "normal":
        return (
          <Badge variant="success" size="sm">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>Normal</span>
          </Badge>
        );
      case "low":
        return (
          <Badge variant="danger" size="sm">
            <span>Low</span>
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {labResults.map((lab) => (
        <div
          key={lab.id}
          className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all flex flex-col justify-between space-y-3"
        >
          <div>
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-teal-50 text-teal-700 flex items-center justify-center">
                  <FlaskConical className="w-3.5 h-3.5" />
                </div>
                <h4 className="font-semibold text-xs sm:text-sm text-slate-900">
                  {lab.testName}
                </h4>
              </div>
              {getStatusBadge(lab.status)}
            </div>

            <div className="mt-2.5 flex items-baseline gap-1.5">
              <span className="text-2xl font-bold font-mono tracking-tight text-slate-900">
                {lab.value}
              </span>
              {lab.unit && (
                <span className="text-xs font-medium text-slate-500">
                  {lab.unit}
                </span>
              )}
            </div>

            {lab.referenceRange && (
              <p className="text-[11px] text-slate-400 mt-1">
                Ref: {lab.referenceRange}
              </p>
            )}

            {lab.date && (
              <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-2">
                <Calendar className="w-3 h-3" />
                <span>Test Date: {formatDate(lab.date)}</span>
              </div>
            )}
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">
              Lab Document Ref
            </span>
            {lab.evidence.length > 0 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onViewEvidence(lab.evidence[0])}
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
