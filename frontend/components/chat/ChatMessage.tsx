"use client";

import * as React from "react";
import { ChatMessage as ChatMessageType, Evidence } from "@/types/medical";
import { ChatSources } from "./ChatSources";
import { Stethoscope, Sparkles, AlertTriangle, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatMessageProps {
  message: ChatMessageType;
  onViewEvidence: (evidence: Evidence) => void;
}

export function ChatMessage({ message, onViewEvidence }: ChatMessageProps) {
  const isDoctor = message.role === "doctor";

  return (
    <div
      className={cn(
        "flex gap-3 sm:gap-4 p-4 rounded-xl transition-colors",
        isDoctor ? "bg-slate-50 border border-slate-200/80" : "bg-white border border-teal-100 shadow-xs"
      )}
    >
      {/* Avatar Icon */}
      <div
        className={cn(
          "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-xs font-semibold",
          isDoctor
            ? "bg-slate-800 text-white"
            : "bg-teal-600 text-white shadow-xs"
        )}
      >
        {isDoctor ? (
          <Stethoscope className="w-4 h-4" />
        ) : (
          <Sparkles className="w-4 h-4" />
        )}
      </div>

      {/* Message Body */}
      <div className="flex-1 space-y-2 min-w-0">
        <div className="flex items-center justify-between">
          <span className="font-bold text-xs text-slate-900">
            {isDoctor ? "Dr. Anil Kumar (Doctor)" : "MedBrief AI (Record Assistant)"}
          </span>
          <span className="text-[11px] text-slate-400 font-mono">
            {message.createdAt}
          </span>
        </div>

        {/* Text Content */}
        <div className="text-xs sm:text-sm text-slate-800 whitespace-pre-line leading-relaxed">
          {message.content}
        </div>

        {/* Conflict Warning Banner */}
        {message.isConflict && message.warning && (
          <div className="p-3 rounded-lg bg-amber-50 border border-amber-300 text-xs text-amber-900 flex items-start gap-2 mt-2">
            <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <span>{message.warning}</span>
          </div>
        )}

        {/* Out of Scope Banner */}
        {message.isOutOfScope && (
          <div className="p-3 rounded-lg bg-slate-100 border border-slate-300 text-xs text-slate-700 flex items-start gap-2 mt-2">
            <ShieldAlert className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
            <span>
              <strong>Clinical Guardrail:</strong> This system only retrieves and organizes information from uploaded documents. Diagnostic judgments and prescription adjustments must be made by a licensed clinician.
            </span>
          </div>
        )}

        {/* Evidence Sources */}
        {message.evidence && (
          <ChatSources
            sources={message.evidence}
            onViewEvidence={onViewEvidence}
          />
        )}
      </div>
    </div>
  );
}
