import * as React from "react";
import { PatientSidebar } from "@/components/patient/PatientSidebar";
import { DocumentUpload } from "@/components/patient/DocumentUpload";
import { ShieldCheck, Info } from "lucide-react";

export default function PatientUploadPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <PatientSidebar />

      {/* Main Content Area */}
      <div className="flex-1 md:pl-60 lg:pl-64 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="bg-white border-b border-slate-200 sticky top-0 z-20 px-4 sm:px-8 py-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Upload Medical Records
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Upload prescriptions, lab reports, and discharge summaries for AI timeline reconstruction
            </p>
          </div>
        </header>

        {/* Upload Body */}
        <main className="p-4 sm:p-8 max-w-5xl w-full mx-auto space-y-6">
          {/* Info Banner */}
          <div className="bg-teal-50/70 border border-teal-200/80 rounded-xl p-4 flex items-start gap-3 text-xs text-teal-900">
            <Info className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong>How it works:</strong> When you upload a document, our OCR and medical entity extraction pipeline extracts diagnoses, prescribed medications, dosages, and lab biomarkers, reconstructing your unified chronological medical history.
            </div>
          </div>

          <DocumentUpload />

          {/* Privacy Note */}
          <div className="flex items-center justify-center gap-2 text-xs text-slate-400 py-2">
            <ShieldCheck className="w-4 h-4 text-teal-600" />
            <span>Encrypted in transit &amp; at rest. You control which doctors receive access codes.</span>
          </div>
        </main>
      </div>
    </div>
  );
}
