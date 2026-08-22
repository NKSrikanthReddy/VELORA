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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-700 shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-slate-400 font-medium">
                SOURCE DOCUMENT
              </div>
              <div className="font-bold text-sm text-slate-900">
                {evidence.documentName}
              </div>
              <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                <span>Page {evidence.page}</span>
                <span>•</span>
                <span className="font-mono text-slate-400">
                  ID: {evidence.documentId}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="success" size="sm">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              <span>Grounded Extract</span>
            </Badge>
          </div>
        </div>

        {/* Extracted Excerpt Box */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <Bookmark className="w-3.5 h-3.5 text-teal-600" />
              <span>Extracted Clinical Text</span>
            </label>
            <span className="text-[11px] text-slate-400">
              Exact OCR OCR snippet
            </span>
          </div>

          <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200/80 text-slate-900 font-mono text-xs leading-relaxed">
            <div className="border-l-4 border-amber-400 pl-3 py-0.5">
              &ldquo;{evidence.relevantText}&rdquo;
            </div>
          </div>
        </div>

        {/* Simulated Document Viewer Trigger */}
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="text-xs text-slate-600">
            <span className="font-semibold block text-slate-800">
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
            className="border-slate-300 text-xs shrink-0"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{showDocumentPreview ? "Hide Preview" : "Open Document"}</span>
            <ExternalLink className="w-3 h-3 text-slate-400 ml-1" />
          </Button>
        </div>

        {/* Simulated PDF Canvas Preview */}
        {showDocumentPreview && (
          <div className="border border-slate-300 rounded-xl overflow-hidden shadow-inner bg-slate-100 p-4 animate-in fade-in">
            <div className="bg-white rounded-lg border border-slate-200 p-6 min-h-[160px] flex flex-col justify-between shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 text-xs text-slate-400">
                <span className="font-semibold text-slate-700">
                  {evidence.documentName}
                </span>
                <span>Page {evidence.page} of 3</span>
              </div>
              <div className="py-4 text-xs font-mono text-slate-700 leading-relaxed bg-amber-50/40 p-3 rounded border border-amber-200/60 my-2">
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
            <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
            <span>Verifiable source record</span>
          </div>
          <Button variant="secondary" size="sm" onClick={onClose}>
            Done
          </Button>
        </div>
      </div>
    </Modal>
  );
}
