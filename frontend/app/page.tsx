import Link from "next/link";
import {
  FileText,
  ArrowRight,
  UserCheck,
  Stethoscope,
  Clock,
  ShieldCheck,
  Sparkles,
  Database,
  Layers,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-[#0F172A] relative overflow-hidden">
      {/* Subtle Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-96 bg-gradient-to-b from-teal-500/5 via-cyan-500/3 to-transparent blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-32 right-10 w-72 h-72 rounded-full bg-cyan-400/5 blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-48 left-10 w-72 h-72 rounded-full bg-teal-500/5 blur-3xl pointer-events-none -z-10" />

      {/* Top Navbar */}
      <header className="border-b border-slate-200/80 bg-white/90 backdrop-blur-md sticky top-0 z-30 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-[#0F9D94] flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
              <FileText className="w-5 h-5" />
            </div>
            <div className="flex items-baseline">
              <span className="font-extrabold text-lg tracking-tight text-[#0F172A]">
                MedBrief
              </span>
              <span className="text-[#0F9D94] font-bold text-lg ml-0.5">AI</span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm" className="font-medium text-slate-600 hover:text-slate-900">
                Sign In
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm" className="font-semibold shadow-xs hover:shadow-md">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Hero & Portals */}
      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 flex flex-col justify-center relative z-10">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#0F172A] leading-[1.15]">
            Your Complete Medical History,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0F9D94] via-[#0D8B83] to-[#06B6D4]">
              Finally Connected.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto font-normal">
            Upload fragmented medical records and transform them into one structured timeline, evidence-backed insights, and AI-powered clinical briefings.
          </p>

          {/* Quick Value Metrics Bar */}
          <div className="pt-2 flex items-center justify-center gap-4 sm:gap-6 text-xs text-slate-500 flex-wrap">
            <div className="flex items-center gap-1.5 font-medium">
              <ShieldCheck className="w-4 h-4 text-[#0F9D94]" />
              <span>Evidence-Linked Citations</span>
            </div>
            <span className="text-slate-300 hidden sm:inline">&bull;</span>
            <div className="flex items-center gap-1.5 font-medium">
              <Layers className="w-4 h-4 text-cyan-600" />
              <span>Chronological Timeline</span>
            </div>
            <span className="text-slate-300 hidden sm:inline">&bull;</span>
            <div className="flex items-center gap-1.5 font-medium">
              <Lock className="w-4 h-4 text-slate-700" />
              <span>Patient-Controlled Access</span>
            </div>
          </div>
        </div>

        {/* Portals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto w-full">
          {/* Patient Portal Card */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-7 sm:p-8 shadow-xs flex flex-col justify-between hover:border-[#0F9D94]/50 hover:shadow-xl hover:shadow-[#0F9D94]/5 hover:-translate-y-1 transition-all duration-300 group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-100/80 flex items-center justify-center text-[#0F9D94] group-hover:scale-105 transition-transform shadow-2xs">
                <UserCheck className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#0F172A] tracking-tight">
                  Patient Portal
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
                  Upload medical reports, view your multi-year chronological timeline, and generate secure time-limited access codes for your doctor.
                </p>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-600 pt-2">
                <li className="flex items-center gap-2.5">
                  <Database className="w-4 h-4 text-[#0F9D94] shrink-0" />
                  <span>Consolidate prescriptions &amp; lab results</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-[#0F9D94] shrink-0" />
                  <span>Reconstruct chronological timeline</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-[#0F9D94] shrink-0" />
                  <span>Grant temporary doctor access codes</span>
                </li>
              </ul>
            </div>
            <div className="pt-6">
              <Link href="/patient/dashboard">
                <Button className="w-full justify-between h-11 text-xs sm:text-sm">
                  <span>Enter as Patient</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Doctor Portal Card */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-7 sm:p-8 shadow-xs flex flex-col justify-between hover:border-cyan-400/60 hover:shadow-xl hover:shadow-cyan-500/10 hover:-translate-y-1 transition-all duration-300 group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition-transform shadow-2xs">
                <Stethoscope className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#0F172A] tracking-tight">
                  Doctor Portal
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
                  Enter patient access codes, review AI clinical briefings in seconds, inspect source evidence, and ask record-grounded questions.
                </p>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-600 pt-2">
                <li className="flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-cyan-600 shrink-0" />
                  <span>AI Clinical Briefing &amp; overview</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <FileText className="w-4 h-4 text-cyan-600 shrink-0" />
                  <span>Direct &ldquo;View Source&rdquo; evidence citations</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Database className="w-4 h-4 text-cyan-600 shrink-0" />
                  <span>&ldquo;Ask My Records&rdquo; medical search assistant</span>
                </li>
              </ul>
            </div>
            <div className="pt-6">
              <Link href="/doctor/dashboard">
                <Button variant="secondary" className="w-full justify-between h-11 text-xs sm:text-sm">
                  <span>Enter as Doctor</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Safety Footer Callout */}
        <div className="mt-14 p-4 rounded-xl bg-white border border-slate-200/80 max-w-2xl mx-auto text-center text-xs text-slate-500 shadow-2xs">
          <p>
            <strong className="text-slate-700">System Scope:</strong> MedBrief AI organizes records and provides evidence-linked clinical summaries. It does not diagnose, prescribe, or provide medical advice.
          </p>
        </div>
      </main>
    </div>
  );
}
