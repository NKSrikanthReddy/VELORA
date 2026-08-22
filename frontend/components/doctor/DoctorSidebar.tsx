"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  FileText,
  LogOut,
  Stethoscope,
  Menu,
  X,
  UserCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { mockUsers } from "@/data/mockData";

export function DoctorSidebar() {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);
  const doctor = mockUsers.doctor;

  const navItems = [
    {
      label: "Dashboard",
      href: "/doctor/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "My Patients",
      href: "/doctor/dashboard#patients",
      icon: Users,
    },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#0F172A] text-white border-r border-slate-800/80 select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2.5 group"
          onClick={() => setIsMobileOpen(false)}
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#0F9D94] to-cyan-400 flex items-center justify-center text-slate-950 font-bold shadow-xs group-hover:scale-105 transition-transform">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <span className="font-extrabold text-white tracking-tight text-base">
              MedBrief
            </span>
            <span className="text-cyan-400 font-bold text-base ml-0.5">MD</span>
          </div>
        </Link>
        <button
          onClick={() => setIsMobileOpen(false)}
          className="md:hidden text-slate-400 hover:text-white p-1"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Doctor Profile Card */}
      <div className="p-3.5 mx-3.5 my-3.5 bg-slate-800/60 border border-slate-700/60 rounded-xl">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/15 text-cyan-300 flex items-center justify-center font-bold text-xs border border-cyan-500/30 shadow-2xs">
            AK
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-bold text-white truncate">
              {doctor.name}
            </div>
            <div className="text-[11px] text-cyan-400 flex items-center gap-1 mt-0.5">
              <Stethoscope className="w-3 h-3" />
              <span>{doctor.specialty?.split("&")[0] || "Internal Medicine"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-1 py-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-[#0F9D94] text-white shadow-xs font-semibold"
                  : "text-slate-400 hover:bg-slate-800/80 hover:text-white"
              )}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-3.5 border-t border-slate-800/80 space-y-2">
        <Link
          href="/patient/dashboard"
          className="flex items-center justify-between text-xs text-slate-400 hover:text-cyan-300 px-2.5 py-2 rounded-lg hover:bg-slate-800/70 transition-colors"
        >
          <div className="flex items-center gap-2">
            <UserCheck className="w-3.5 h-3.5" />
            <span>Switch to Patient</span>
          </div>
          <span className="text-[10px] font-semibold bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded border border-slate-700">
            Demo
          </span>
        </Link>
        <Link
          href="/login"
          className="flex items-center gap-2 text-xs text-rose-400 hover:text-rose-300 px-2.5 py-1.5 rounded-lg hover:bg-rose-950/20 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </Link>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Bar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-[#0F172A] text-white border-b border-slate-800 sticky top-0 z-30">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#0F9D94] to-cyan-400 flex items-center justify-center text-slate-950">
            <FileText className="w-4 h-4" />
          </div>
          <span className="font-bold text-sm text-white">MedBrief MD</span>
        </Link>
        <button
          onClick={() => setIsMobileOpen(true)}
          className="p-2 text-slate-300 hover:bg-slate-800 rounded-lg"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setIsMobileOpen(false)}
          />
          <div className="relative w-64 max-w-[80vw] h-full z-50">
            {sidebarContent}
          </div>
        </div>
      )}

      {/* Desktop Persistent Sidebar */}
      <aside className="hidden md:flex md:w-60 lg:w-64 flex-col fixed inset-y-0 z-30">
        {sidebarContent}
      </aside>
    </>
  );
}
