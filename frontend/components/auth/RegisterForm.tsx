"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { UserRole } from "@/types/medical";
import { registerUser } from "@/lib/api";
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await registerUser(fullName, email, password, role);
    } catch (_) {}

    setIsLoading(false);
    if (role === "patient") {
      router.push("/patient/dashboard");
    } else {
      router.push("/doctor/dashboard");
    }
  };

  return (
    <div className="w-full max-w-md space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-2">
            Select Your Role
          </label>
          <RoleSelector selectedRole={role} onSelectRole={setRole} />
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-slate-700">
            Full Name
          </label>
          <div className="relative">
            <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent"
              placeholder={role === "patient" ? "e.g. Rahul Sharma" : "e.g. Dr. Anil Kumar"}
            />
          </div>
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
          <label className="block text-xs font-medium text-slate-700">
            Create Password
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent"
              placeholder="Minimum 8 characters"
            />
          </div>
        </div>

        <Button
          type="submit"
          className="w-full mt-2"
          isLoading={isLoading}
        >
          Create {role === "patient" ? "Patient" : "Doctor"} Account
        </Button>
      </form>

      <div className="text-center text-xs text-slate-500">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-teal-600 hover:text-teal-700 underline"
        >
          Login
        </Link>
      </div>
    </div>
  );
}
