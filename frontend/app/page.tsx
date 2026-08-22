import Link from "next/link";
import { FileText, ArrowRight, User, Stethoscope, Clock, ShieldCheck, Sparkles, Database } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Top Navbar */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-xs sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-teal-600 flex items-center justify-center text-white shadow-xs">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-lg text-slate-900 tracking-tight">MedBrief</span>
              <span className="text-teal-600 font-bold text-lg ml-0.5">AI</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">Sign In</Button>
            </Link>
            <Link href="/register">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Hero & Quick Demo Cards */}
      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col justify-center">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            <span>24-Hour Hackathon MVP</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            AI-Powered Medical Record Consolidation &amp; Clinical Briefing
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Consolidate multi-year fragmented prescriptions, discharge summaries, and lab reports into a unified chronological history, clinical briefing, and evidence-grounded records search.
          </p>
        </div>

        {/* Portals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto w-full">
          {/* Patient Portal Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs flex flex-col justify-between hover:border-teal-300 hover:shadow-md transition-all">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600">
                <User className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Patient Portal</h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
                  Upload medical reports, view your multi-year chronological timeline, and generate secure time-limited access codes for your doctor.
                </p>
              </div>
              <ul className="space-y-2 text-xs text-slate-600 pt-2">
                <li className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-teal-600" />
                  <span>Consolidate prescriptions &amp; lab results</span>
                </li>
                <li className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-teal-600" />
                  <span>Reconstruct chronological timeline</span>
                </li>
                <li className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-teal-600" />
                  <span>Grant temporary doctor access codes</span>
                </li>
              </ul>
            </div>
            <div className="pt-6">
              <Link href="/patient/dashboard">
                <Button className="w-full justify-between">
                  <span>Enter as Patient (Rahul Sharma)</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Doctor Portal Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs flex flex-col justify-between hover:border-teal-300 hover:shadow-md transition-all">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                <Stethoscope className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Doctor Portal</h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
                  Enter patient access codes, review AI clinical briefings in seconds, inspect source evidence, and ask record-grounded questions.
                </p>
              </div>
              <ul className="space-y-2 text-xs text-slate-600 pt-2">
                <li className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <span>AI Clinical Briefing &amp; overview</span>
                </li>
                <li className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span>Direct &ldquo;View Source&rdquo; evidence citations</span>
                </li>
                <li className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-blue-600" />
                  <span>&ldquo;Ask My Records&rdquo; medical search assistant</span>
                </li>
              </ul>
            </div>
            <div className="pt-6">
              <Link href="/doctor/dashboard">
                <Button variant="secondary" className="w-full justify-between">
                  <span>Enter as Doctor (Dr. Anil Kumar)</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Safety Footer Callout */}
        <div className="mt-12 p-4 rounded-xl bg-white border border-slate-200 max-w-2xl mx-auto text-center text-xs text-slate-500">
          <p>
            <strong>System Scope:</strong> MedBrief AI organizes records and provides evidence-linked clinical summaries. It does not diagnose, prescribe, or provide medical advice.
          </p>
        </div>
      </main>
    </div>
  );
}
