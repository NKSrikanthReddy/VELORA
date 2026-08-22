"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { UserRole } from "@/types/medical";
import { Button } from "@/components/ui/Button";
import { RoleSelector } from "./RoleSelector";
import { Lock, Mail, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

export function LoginForm() {
  const router = useRouter();
  const [role, setRole] = React.useState<UserRole>("patient");
  const [email, setEmail] = React.useState("rahul.sharma@example.com");
  const [password, setPassword] = React.useState("password123");
  const [isLoading, setIsLoading] = React.useState(false);

  const handleRoleChange = (newRole: UserRole) => {
    setRole(newRole);
    if (newRole === "patient") {
      setEmail("rahul.sharma@example.com");
    } else {
      setEmail("dr.anil@cityhealth.org");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      if (role === "patient") {
        router.push("/patient/dashboard");
      } else {
        router.push("/doctor/dashboard");
      }
    }, 400);
  };

  const handleQuickDemo = (demoRole: UserRole) => {
    setIsLoading(true);
    setRole(demoRole);
    setTimeout(() => {
      setIsLoading(false);
      if (demoRole === "patient") {
        router.push("/patient/dashboard");
      } else {
        router.push("/doctor/dashboard");
      }
    }, 250);
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
            <span className="text-[11px] text-[#0F9D94] hover:underline cursor-pointer font-medium">
              Forgot password?
            </span>
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
