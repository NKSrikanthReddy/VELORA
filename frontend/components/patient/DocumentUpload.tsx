"use client";

import * as React from "react";
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  Clock,
  AlertCircle,
  X,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface UploadItem {
  id: string;
  name: string;
  size: string;
  type: string;
  progress: number;
  status: "queued" | "uploading" | "extracting" | "completed" | "error";
  extractedCount?: number;
  errorMessage?: string;
}

const SUPPORTED_EXTENSIONS = ["pdf", "jpg", "jpeg", "png"];

export function DocumentUpload() {
  const [isDragging, setIsDragging] = React.useState(false);
  const [queue, setQueue] = React.useState<UploadItem[]>([
    {
      id: "demo-doc-1",
      name: "Blood_Report_2025.pdf",
      size: "1.8 MB",
      type: "application/pdf",
      progress: 100,
      status: "completed",
      extractedCount: 14,
    },
    {
      id: "demo-doc-2",
      name: "Prescription_2025.jpg",
      size: "840 KB",
      type: "image/jpeg",
      progress: 100,
      status: "completed",
      extractedCount: 6,
    },
    {
      id: "demo-doc-3",
      name: "Discharge_Summary_2025.pdf",
      size: "2.4 MB",
      type: "application/pdf",
      progress: 75,
      status: "extracting",
      extractedCount: 8,
    },
  ]);
  const [errorBanner, setErrorBanner] = React.useState<string | null>(null);

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const validateAndAddFiles = (files: FileList | File[]) => {
    setErrorBanner(null);
    const newItems: UploadItem[] = [];

    Array.from(files).forEach((file) => {
      const ext = file.name.split(".").pop()?.toLowerCase() || "";
      if (!SUPPORTED_EXTENSIONS.includes(ext)) {
        setErrorBanner(
          `"${file.name}" is not a supported file type. Only PDF, JPG, JPEG, and PNG files are accepted.`
        );
        return;
      }

      const sizeFormatted =
        file.size > 1024 * 1024
          ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
          : `${Math.round(file.size / 1024)} KB`;

      newItems.push({
        id: `upload-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: file.name,
        size: sizeFormatted,
        type: file.type || ext.toUpperCase(),
        progress: 0,
        status: "queued",
      });
    });

    if (newItems.length > 0) {
      setQueue((prev) => [...newItems, ...prev]);

      // Simulate sequential AI processing for uploaded files
      newItems.forEach((item, index) => {
        simulateProcessing(item.id, index * 600);
      });
    }
  };

  const simulateProcessing = (itemId: string, delay: number) => {
    setTimeout(() => {
      // Step 1: Uploading (0% -> 60%)
      setQueue((prev) =>
        prev.map((doc) =>
          doc.id === itemId
            ? { ...doc, status: "uploading", progress: 45 }
            : doc
        )
      );

      setTimeout(() => {
        // Step 2: AI Extracting (60% -> 90%)
        setQueue((prev) =>
          prev.map((doc) =>
            doc.id === itemId
              ? { ...doc, status: "extracting", progress: 85 }
              : doc
          )
        );

        setTimeout(() => {
          // Step 3: Completed (100% & entity count)
          const randomEntities = Math.floor(Math.random() * 8) + 4;
          setQueue((prev) =>
            prev.map((doc) =>
              doc.id === itemId
                ? {
                    ...doc,
                    status: "completed",
                    progress: 100,
                    extractedCount: randomEntities,
                  }
                : doc
            )
          );
        }, 1200);
      }, 1000);
    }, delay);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndAddFiles(e.dataTransfer.files);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndAddFiles(e.target.files);
      e.target.value = "";
    }
  };

  const removeQueueItem = (id: string) => {
    setQueue((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Unsupported File Warning */}
      {errorBanner && (
        <div className="flex items-center justify-between p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 animate-in fade-in">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorBanner}</span>
          </div>
          <button
            onClick={() => setErrorBanner(null)}
            className="text-rose-600 hover:text-rose-900 p-1 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Drag and Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "relative border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center transition-all duration-200 bg-white flex flex-col items-center justify-center cursor-pointer group shadow-xs",
          isDragging
            ? "border-[#0F9D94] bg-teal-50/40 scale-[1.005]"
            : "border-slate-200 hover:border-[#0F9D94]/70 hover:bg-slate-50/50"
        )}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={handleFileSelect}
          className="hidden"
        />

        <div className="w-16 h-16 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center text-[#0F9D94] mb-4 group-hover:scale-105 transition-transform shadow-2xs">
          <UploadCloud className="w-8 h-8" />
        </div>

        <h3 className="text-base sm:text-lg font-bold text-[#0F172A] mb-1">
          Drag and drop medical records here
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mb-5 leading-relaxed">
          Upload prescriptions, blood reports, diagnostic imaging reports, or hospital discharge summaries. Multiple files supported.
        </p>

        <Button
          type="button"
          size="md"
          onClick={(e) => {
            e.stopPropagation();
            fileInputRef.current?.click();
          }}
          className="shadow-xs"
        >
          Choose Files
        </Button>

        <div className="mt-6 flex items-center gap-2.5 text-[11px] text-slate-400">
          <span className="font-medium text-slate-500">Supported Formats:</span>
          <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600 font-mono font-medium">PDF</span>
          <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600 font-mono font-medium">JPG</span>
          <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600 font-mono font-medium">JPEG</span>
          <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600 font-mono font-medium">PNG</span>
        </div>
      </div>

      {/* Upload Queue Section */}
      <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-[#0F172A]">
              Document Ingestion Queue
            </h3>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
              {queue.length} files
            </span>
          </div>
          <Link href="/patient/history">
            <Button variant="ghost" size="sm" className="text-xs text-[#0F9D94] hover:text-[#0D8B83] font-semibold">
              <span>View Consolidated History</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </Link>
        </div>

        <div className="divide-y divide-slate-100">
          {queue.map((item) => (
            <div
              key={item.id}
              className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/50 transition-colors"
            >
              {/* Document Meta */}
              <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-[#0F9D94] shrink-0 shadow-2xs">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs sm:text-sm text-[#0F172A] truncate">
                      {item.name}
                    </span>
                    <span className="text-[11px] text-slate-400 shrink-0">
                      ({item.size})
                    </span>
                  </div>

                  {/* Progress bar on active upload */}
                  {(item.status === "uploading" || item.status === "extracting") && (
                    <div className="w-48 max-w-full bg-slate-100 rounded-full h-1.5 mt-2 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-[#0F9D94] to-[#22D3EE] h-1.5 rounded-full transition-all duration-300"
                        style={{ width: `${item.progress}%` }}
                      />
                    </div>
                  )}

                  {/* Extracted message */}
                  {item.status === "completed" && item.extractedCount && (
                    <p className="text-[11px] text-[#0F9D94] mt-0.5 flex items-center gap-1 font-medium">
                      <Sparkles className="w-3 h-3 text-[#0F9D94]" />
                      <span>
                        AI verified {item.extractedCount} medical facts (diagnoses, lab values, dates)
                      </span>
                    </p>
                  )}
                </div>
              </div>

              {/* Status & Actions */}
              <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                <div>
                  {item.status === "completed" && (
                    <Badge variant="success" size="sm">
                      <CheckCircle2 className="w-3 h-3 text-[#0F9D94]" />
                      <span>Completed</span>
                    </Badge>
                  )}
                  {item.status === "extracting" && (
                    <Badge variant="cyan" size="sm">
                      <Clock className="w-3 h-3 text-cyan-700 animate-spin" />
                      <span>Extracting Entities...</span>
                    </Badge>
                  )}
                  {item.status === "uploading" && (
                    <Badge variant="info" size="sm">
                      <Clock className="w-3 h-3 text-teal-600 animate-spin" />
                      <span>Uploading {item.progress}%</span>
                    </Badge>
                  )}
                  {item.status === "queued" && (
                    <Badge variant="default" size="sm">
                      <span>Queued</span>
                    </Badge>
                  )}
                </div>

                <button
                  onClick={() => removeQueueItem(item.id)}
                  className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                  title="Remove from queue"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
