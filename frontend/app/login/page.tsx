import { LoginForm } from "@/components/auth/LoginForm";
import { FileText, ShieldAlert } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 bg-[#F8FAFC] relative overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-80 bg-teal-500/5 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="w-full max-w-md space-y-6">
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#0F9D94] text-white shadow-md shadow-[#0F9D94]/20 mb-2 hover:scale-105 transition-transform">
            <FileText className="w-6 h-6" />
          </Link>
          <h1 className="text-2xl font-extrabold tracking-tight text-[#0F172A]">
            MedBrief AI
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xs mx-auto">
            AI-Powered Medical Record Consolidation &amp; Clinical Briefing
          </p>
        </div>

        {/* Card Form */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/90 shadow-xs">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-[#0F172A]">Welcome Back</h2>
            <p className="text-xs text-slate-500 mt-0.5 font-normal">
              Sign in to your patient or doctor portal
            </p>
          </div>

          <LoginForm />
        </div>

        {/* Framing & Disclaimer */}
        <div className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-slate-100/80 border border-slate-200/80 text-[11px] text-slate-500 leading-relaxed max-w-md mx-auto shadow-2xs">
          <ShieldAlert className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
          <span>
            <strong className="text-slate-700">Clinical Safety Notice:</strong> MedBrief AI is an AI-powered medical record organization and briefing tool. It is not an AI doctor and does not provide diagnoses or treatment recommendations.
          </span>
        </div>
      </div>
    </div>
  );
}
