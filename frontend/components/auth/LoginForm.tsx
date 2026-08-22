"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { UserRole } from "@/types/medical";
import { loginUser } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { RoleSelector } from "./RoleSelector";
import { Lock, Mail, ArrowRight, Sparkles, AlertCircle } from "lucide-react";
import Link from "next/link";

export function LoginForm() {
  const router = useRouter();
  const [role, setRole] = React.useState<UserRole>("patient");
  const [email, setEmail] = React.useState("patient@demo.com");
  const [password, setPassword] = React.useState("patient123");
  const [isLoading, setIsLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const handleRoleChange = (newRole: UserRole) => {
    setRole(newRole);
    setErrorMessage(null);
    if (newRole === "patient") {
      setEmail("patient@demo.com");
      setPassword("patient123");
    } else {
      setEmail("doctor@demo.com");
      setPassword("doctor123");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const { user } = await loginUser(email, password, role);
      if (user.role === "doctor" || role === "doctor") {
        router.push("/doctor/dashboard");
      } else {
        router.push("/patient/dashboard");
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to log in. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemo = async (demoRole: UserRole) => {
    setErrorMessage(null);
    setIsLoading(true);
    setRole(demoRole);

    const demoEmail = demoRole === "patient" ? "patient@demo.com" : "doctor@demo.com";
    const demoPwd = demoRole === "patient" ? "patient123" : "doctor123";
    setEmail(demoEmail);
    setPassword(demoPwd);

    try {
      const { user } = await loginUser(demoEmail, demoPwd, demoRole);
      if (user.role === "doctor" || demoRole === "doctor") {
        router.push("/doctor/dashboard");
      } else {
        router.push("/patient/dashboard");
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Demo user login failed. Please ensure the backend is running and seeded.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-6">
      {/* Demo fast-track banner */}
      <div className="bg-teal-50/70 border border-teal-200/80 rounded-2xl p-4 text-xs text-teal-950 flex flex-col gap-2 shadow-2xs">
        <div className="flex items-center gap-1.5 font-bold text-[#0F9D94]">
          <Sparkles className="w-4 h-4" />
          <span>Quick Demo Access (One-Click)</span>
        </div>
        <p className="text-slate-600 leading-relaxed text-[11px]">
          Instant demo login with pre-loaded medical records and clinical briefing:
        </p>
        <div className="grid grid-cols-2 gap-2 mt-1">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handleQuickDemo("patient")}
            className="border-teal-200 text-teal-900 bg-white hover:bg-teal-50/50 justify-between text-xs font-semibold h-9"
          >
            <span>Patient Portal</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#0F9D94]" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handleQuickDemo("doctor")}
            className="border-teal-200 text-teal-900 bg-white hover:bg-teal-50/50 justify-between text-xs font-semibold h-9"
          >
            <span>Doctor Portal</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#0F9D94]" />
          </Button>
        </div>
      </div>

      {errorMessage && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-center gap-2 animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider text-[11px]">
            Select Your Role
          </label>
          <RoleSelector selectedRole={role} onSelectRole={handleRoleChange} />
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-slate-700">
            Email Address
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F9D94] focus:bg-white transition-all text-[#0F172A]"
              placeholder="you@example.com"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-medium text-slate-700">
              Password
            </label>
          </div>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F9D94] focus:bg-white transition-all text-[#0F172A]"
              placeholder="••••••••"
            />
          </div>
        </div>

        <Button
          type="submit"
          className="w-full mt-2 h-11 text-sm font-semibold shadow-xs"
          isLoading={isLoading}
        >
          Login as {role === "patient" ? "Patient" : "Doctor"}
        </Button>
      </form>

      <div className="text-center text-xs text-slate-500">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="font-semibold text-[#0F9D94] hover:text-[#0D8B83] underline"
        >
          Create Account
        </Link>
      </div>
    </div>
  );
}
