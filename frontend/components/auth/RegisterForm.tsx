"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { UserRole } from "@/types/medical";
import { Button } from "@/components/ui/Button";
import { RoleSelector } from "./RoleSelector";
import { Lock, Mail, User as UserIcon } from "lucide-react";
import Link from "next/link";

export function RegisterForm() {
  const router = useRouter();
  const [role, setRole] = React.useState<UserRole>("patient");
  const [fullName, setFullName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

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

  return (
    <div className="w-full max-w-md space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider text-[11px]">
            Select Your Role
          </label>
          <RoleSelector selectedRole={role} onSelectRole={setRole} />
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-slate-700">
            Full Name
          </label>
          <div className="relative">
            <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F9D94] focus:bg-white transition-all text-[#0F172A]"
              placeholder={role === "patient" ? "e.g. Rahul Sharma" : "e.g. Dr. Anil Kumar"}
            />
          </div>
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
          <label className="block text-xs font-medium text-slate-700">
            Create Password
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F9D94] focus:bg-white transition-all text-[#0F172A]"
              placeholder="Minimum 8 characters"
            />
          </div>
        </div>

        <Button
          type="submit"
          className="w-full mt-2 h-11 text-sm font-semibold shadow-xs"
          isLoading={isLoading}
        >
          Create {role === "patient" ? "Patient" : "Doctor"} Account
        </Button>
      </form>

      <div className="text-center text-xs text-slate-500">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-semibold text-[#0F9D94] hover:text-[#0D8B83] underline"
        >
          Login
        </Link>
      </div>
    </div>
  );
}
