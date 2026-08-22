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
            <CheckCircle2 className="w-3 h-3 text-[#0F9D94]" />
            <span>Normal Range</span>
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
          className="p-5 rounded-2xl border border-slate-200/90 bg-white hover:border-slate-300 hover:shadow-2xs transition-all duration-200 flex flex-col justify-between space-y-3"
        >
          <div>
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-teal-50 text-[#0F9D94] flex items-center justify-center shadow-2xs">
                  <FlaskConical className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-xs sm:text-sm text-[#0F172A]">
                  {lab.testName}
                </h4>
              </div>
              {getStatusBadge(lab.status)}
            </div>

            <div className="mt-3 flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-extrabold font-mono tracking-tight text-[#0F172A]">
                {lab.value}
              </span>
              {lab.unit && (
                <span className="text-xs font-semibold text-slate-500">
                  {lab.unit}
                </span>
              )}
            </div>

            {lab.referenceRange && (
              <p className="text-[11px] text-slate-400 mt-1 font-normal">
                Reference: {lab.referenceRange}
              </p>
            )}

            {lab.date && (
              <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-2.5">
                <Calendar className="w-3 h-3" />
                <span>Test Date: {formatDate(lab.date)}</span>
              </div>
            )}
          </div>

          <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">
              Lab Document Ref
            </span>
            {lab.evidence.length > 0 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onViewEvidence(lab.evidence[0])}
                className="text-xs text-[#0F9D94] hover:bg-teal-50 h-7 px-2.5 font-semibold"
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
