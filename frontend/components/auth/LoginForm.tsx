"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { UserRole } from "@/types/medical";
import { loginUser } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { RoleSelector } from "./RoleSelector";
import { Lock, Mail, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

export function LoginForm() {
  const router = useRouter();
  const [role, setRole] = React.useState<UserRole>("patient");
  const [email, setEmail] = React.useState("patient@demo.com");
  const [password, setPassword] = React.useState("patient123");
  const [isLoading, setIsLoading] = React.useState(false);

  // Sync email when role changes for easy testing
  const handleRoleChange = (newRole: UserRole) => {
    setRole(newRole);
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
    setIsLoading(true);

    try {
      await loginUser(email, password, role);
    } catch (_) {}

    setIsLoading(false);
    if (role === "patient") {
      router.push("/patient/dashboard");
    } else {
      router.push("/doctor/dashboard");
    }
  };

  const handleQuickDemo = async (demoRole: UserRole) => {
    setIsLoading(true);
    setRole(demoRole);
    const demoEmail = demoRole === "patient" ? "patient@demo.com" : "doctor@demo.com";
    const demoPwd = demoRole === "patient" ? "patient123" : "doctor123";

    try {
      await loginUser(demoEmail, demoPwd, demoRole);
    } catch (_) {}

    setIsLoading(false);
    if (demoRole === "patient") {
      router.push("/patient/dashboard");
    } else {
      router.push("/doctor/dashboard");
    }
  };

  return (
    <div className="w-full max-w-md space-y-6">
      {/* Demo fast-track banner for hackathon judges */}
      <div className="bg-teal-50/80 border border-teal-200 rounded-xl p-3.5 text-xs text-teal-900 flex flex-col gap-2">
        <div className="flex items-center gap-1.5 font-semibold text-teal-800">
          <Sparkles className="w-4 h-4 text-teal-600" />
          <span>Quick Demo Access (One-Click)</span>
        </div>
        <p className="text-teal-700 leading-relaxed text-[11px]">
          Instant demo login with pre-loaded medical records and clinical briefing:
        </p>
        <div className="grid grid-cols-2 gap-2 mt-1">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handleQuickDemo("patient")}
            className="border-teal-300 text-teal-800 bg-white hover:bg-teal-100/50 justify-between text-xs"
          >
            <span>Patient: Rahul</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handleQuickDemo("doctor")}
            className="border-teal-300 text-teal-800 bg-white hover:bg-teal-100/50 justify-between text-xs"
          >
            <span>Doctor: Dr. Anil</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-2">
            Select Your Role
          </label>
          <RoleSelector selectedRole={role} onSelectRole={handleRoleChange} />
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-slate-700">
            Email Address
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent"
              placeholder="you@example.com"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-medium text-slate-700">
              Password
            </label>
            <span className="text-[11px] text-teal-600 hover:underline cursor-pointer">
              Forgot password?
            </span>
          </div>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent"
              placeholder="••••••••"
            />
          </div>
        </div>

        <Button
          type="submit"
          className="w-full mt-2"
          isLoading={isLoading}
        >
          Login as {role === "patient" ? "Patient" : "Doctor"}
        </Button>
      </form>

      <div className="text-center text-xs text-slate-500">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="font-medium text-teal-600 hover:text-teal-700 underline"
        >
          Create Account
        </Link>
      </div>
    </div>
  );
}
