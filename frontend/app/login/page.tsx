import { LoginForm } from "@/components/auth/LoginForm";
import { FileText, ShieldAlert } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="w-full max-w-md space-y-6">
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-teal-600 text-white shadow-md shadow-teal-600/20 mb-2">
            <FileText className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            MedBrief AI
          </h1>
          <p className="text-sm text-slate-500 max-w-xs mx-auto">
            AI-Powered Medical Record Consolidation &amp; Clinical Briefing
          </p>
        </div>

        {/* Card Form */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm">
          <div className="mb-5">
            <h2 className="text-lg font-semibold text-slate-900">Welcome Back</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Sign in to your patient or doctor portal
            </p>
          </div>

          <LoginForm />
        </div>

        {/* Framing & Disclaimer */}
        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-100/80 border border-slate-200/80 text-[11px] text-slate-500 leading-relaxed max-w-md mx-auto">
          <ShieldAlert className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
          <span>
            <strong>Clinical Safety Notice:</strong> MedBrief AI is an AI-powered medical record organization and briefing tool. It is not an AI doctor and does not provide diagnoses or treatment recommendations.
          </span>
        </div>
      </div>
    </div>
  );
}
