"use client";

import * as React from "react";
import { TimelineEvent as TimelineEventType, Evidence } from "@/types/medical";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatDate, getConfidenceBadge } from "@/lib/utils";
import {
  Calendar,
  ExternalLink,
  Building2,
  User,
  HelpCircle,
  FileText,
  Activity,
  Pill,
  Hospital,
  FlaskConical,
  FileCheck2,
} from "lucide-react";

interface TimelineEventProps {
  event: TimelineEventType;
  onViewEvidence: (evidence: Evidence) => void;
  isLast?: boolean;
}

export function TimelineEvent({
  event,
  onViewEvidence,
  isLast = false,
}: TimelineEventProps) {
  const confidence = getConfidenceBadge(event.confidence);
  const isDateUnknown = !event.date;

  const getEventIcon = (type: string) => {
    const lower = type.toLowerCase();
    if (lower.includes("blood") || lower.includes("lab")) return FlaskConical;
    if (lower.includes("prescrip")) return Pill;
    if (lower.includes("discharge")) return FileCheck2;
    if (lower.includes("hospital") || lower.includes("admission")) return Hospital;
    if (lower.includes("diag") || lower.includes("consult")) return Activity;
    return FileText;
  };

  const Icon = getEventIcon(event.eventType);

  return (
    <div className="relative flex items-start gap-4 sm:gap-6 group">
      {/* Vertical Spine Line */}
      {!isLast && (
        <div className="absolute left-4 sm:left-5 top-10 bottom-0 w-0.5 bg-slate-200 group-hover:bg-[#0F9D94]/30 transition-colors" />
      )}

      {/* Event Node Icon */}
      <div
        className={`relative z-10 w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0 border shadow-2xs transition-transform group-hover:scale-105 ${
          isDateUnknown
            ? "bg-amber-50 border-amber-200/90 text-amber-700"
            : "bg-white border-slate-200/90 text-[#0F9D94] group-hover:border-[#0F9D94]/60"
        }`}
      >
        {isDateUnknown ? (
          <HelpCircle className="w-4 h-4" />
        ) : (
          <Icon className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
        )}
      </div>

      {/* Event Card Content */}
      <div className="flex-1 pb-8">
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs hover:border-slate-300 hover:shadow-2xs transition-all duration-200 space-y-3">
          {/* Header row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="font-bold text-sm sm:text-base text-[#0F172A]">
                {event.title}
              </span>
              <span className="bg-slate-100 text-slate-700 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border border-slate-200/80">
                {event.eventType}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant={confidence.variant} size="sm">
                {confidence.label}
              </Badge>
            </div>
          </div>

          {/* Date & Facility Row */}
          <div className="flex items-center gap-3 text-xs text-slate-500 flex-wrap">
            <div
              className={`flex items-center gap-1.5 font-medium ${
                isDateUnknown ? "text-amber-700 font-semibold" : "text-slate-600"
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>{formatDate(event.date)}</span>
            </div>

            {event.facility && (
              <>
                <span className="text-slate-300">&bull;</span>
                <div className="flex items-center gap-1.5 text-slate-500">
                  <Building2 className="w-3.5 h-3.5" />
                  <span>{event.facility}</span>
                </div>
              </>
            )}

            {event.clinician && (
              <>
                <span className="text-slate-300">&bull;</span>
                <div className="flex items-center gap-1.5 text-slate-500">
                  <User className="w-3.5 h-3.5" />
                  <span>{event.clinician}</span>
                </div>
              </>
            )}
          </div>

          {/* Description */}
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
            {event.description}
          </p>

          {/* Evidence Button */}
          {event.evidence && event.evidence.length > 0 && (
            <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between">
              <div className="text-[11px] text-slate-400 truncate max-w-[200px] sm:max-w-none">
                Source: {event.evidence[0].documentName} (Page {event.evidence[0].page})
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onViewEvidence(event.evidence[0])}
                className="h-7 text-xs px-2.5 text-[#0F9D94] hover:bg-teal-50 border-teal-200/80 font-medium"
              >
                <span>View Evidence</span>
                <ExternalLink className="w-3 h-3 ml-1 text-[#0F9D94]" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
