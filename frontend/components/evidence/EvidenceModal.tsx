"use client";

import * as React from "react";
import { Evidence } from "@/types/medical";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  FileText,
  ExternalLink,
  CheckCircle2,
  Bookmark,
  ShieldCheck,
  Eye,
} from "lucide-react";

interface EvidenceModalProps {
  evidence: Evidence | null;
  isOpen: boolean;
  onClose: () => void;
}

export function EvidenceModal({
  evidence,
  isOpen,
  onClose,
}: EvidenceModalProps) {
  const [showDocumentPreview, setShowDocumentPreview] = React.useState(false);

  if (!evidence) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Source Evidence Reference"
      description="Verifiable extract grounded in original uploaded clinical record"
      maxWidth="2xl"
    >
      <div className="space-y-5">
        {/* Document Meta Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/90">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-[#0F9D94] shrink-0 shadow-2xs">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
                SOURCE DOCUMENT
              </div>
              <div className="font-bold text-sm sm:text-base text-[#0F172A]">
                {evidence.documentName}
              </div>
              <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                <span>Page {evidence.page}</span>
                <span>&bull;</span>
                <span className="font-mono text-slate-400">
                  ID: {evidence.documentId}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="success" size="sm">
              <CheckCircle2 className="w-3 h-3 text-[#0F9D94]" />
              <span>Grounded Extract</span>
            </Badge>
          </div>
        </div>

        {/* Extracted Excerpt Box */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <Bookmark className="w-3.5 h-3.5 text-[#0F9D94]" />
              <span>Extracted Clinical Text</span>
            </label>
            <span className="text-[11px] text-slate-400">
              Exact OCR snippet
            </span>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/40 border border-amber-200/80 text-slate-900 font-mono text-xs leading-relaxed">
            <div className="border-l-4 border-amber-400 pl-3.5 py-0.5 font-medium">
              &ldquo;{evidence.relevantText}&rdquo;
            </div>
          </div>
        </div>

        {/* Simulated Document Viewer Trigger */}
        <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="text-xs text-slate-600">
            <span className="font-bold text-slate-800 block text-sm">
              Original Document File
            </span>
            <span className="text-[11px] text-slate-500">
              Preview page {evidence.page} in the clinical viewer
            </span>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowDocumentPreview(!showDocumentPreview)}
            className="border-slate-200 text-xs shrink-0 font-medium"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{showDocumentPreview ? "Hide Preview" : "Open Document"}</span>
            <ExternalLink className="w-3 h-3 text-slate-400 ml-1" />
          </Button>
        </div>

        {/* Simulated PDF Canvas Preview */}
        {showDocumentPreview && (
          <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-inner bg-slate-100 p-4 animate-in fade-in">
            <div className="bg-white rounded-xl border border-slate-200 p-6 min-h-[160px] flex flex-col justify-between shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 text-xs text-slate-400">
                <span className="font-semibold text-slate-700">
                  {evidence.documentName}
                </span>
                <span>Page {evidence.page} of 3</span>
              </div>
              <div className="py-4 text-xs font-mono text-slate-700 leading-relaxed bg-amber-50/40 p-3 rounded-lg border border-amber-200/60 my-2">
                <span className="bg-amber-200/70 px-1 py-0.5 rounded font-semibold text-slate-900">
                  {evidence.relevantText}
                </span>
              </div>
              <div className="text-[10px] text-slate-400 text-center pt-2">
                Document verified from secure patient storage
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
          <div className="flex items-center gap-1.5 text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#0F9D94]" />
            <span>Verifiable source record</span>
          </div>
          <Button variant="secondary" size="sm" onClick={onClose} className="font-semibold">
            Done
          </Button>
        </div>
      </div>
    </Modal>
  );
}
