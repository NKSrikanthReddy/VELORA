"use client";

import * as React from "react";
import { Evidence } from "@/types/medical";
import { Button } from "@/components/ui/Button";
import { FileText, ExternalLink } from "lucide-react";

interface ChatSourcesProps {
  sources: Evidence[];
  onViewEvidence: (evidence: Evidence) => void;
}

export function ChatSources({ sources, onViewEvidence }: ChatSourcesProps) {
  if (!sources || sources.length === 0) return null;

  return (
    <div className="mt-3 pt-3 border-t border-slate-200/80 space-y-2">
      <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block">
        Source Documents &amp; Citations:
      </span>
      <div className="flex flex-wrap gap-2">
        {sources.map((source, idx) => (
          <div
            key={source.id || idx}
            className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-lg text-xs"
          >
            <FileText className="w-3.5 h-3.5 text-teal-600 shrink-0" />
            <span className="font-medium text-slate-800">
              {source.documentName}
            </span>
            <span className="text-slate-400 font-mono text-[11px]">
              (Page {source.page})
            </span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onViewEvidence(source)}
              className="h-5 px-1.5 text-[11px] text-teal-700 hover:bg-teal-100 font-medium ml-1"
            >
              <span>View Source</span>
              <ExternalLink className="w-2.5 h-2.5 ml-0.5" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
