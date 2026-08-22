import { RegisterForm } from "@/components/auth/RegisterForm";
import { FileText, ShieldCheck } from "lucide-react";

export default function RegisterPage() {
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
            Consolidate medical history &amp; generate doctor briefings
          </p>
        </div>

        {/* Card Form */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm">
          <div className="mb-5">
            <h2 className="text-lg font-semibold text-slate-900">Create Account</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Select your role to get started
            </p>
          </div>

          <RegisterForm />
        </div>

        {/* Framing */}
        <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400">
          <ShieldCheck className="w-4 h-4 text-teal-600" />
          <span>HIPAA-aligned encrypted records architecture</span>
        </div>
      </div>
    </div>
  );
}
