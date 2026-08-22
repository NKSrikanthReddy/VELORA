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
  ShieldCheck,
  Menu,
  X,
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
    <div className="flex flex-col h-full bg-slate-900 text-white border-r border-slate-800">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2.5"
          onClick={() => setIsMobileOpen(false)}
        >
          <div className="w-8 h-8 rounded-lg bg-teal-500 flex items-center justify-center text-slate-950 font-bold shadow-xs">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-white tracking-tight">MedBrief</span>
            <span className="text-teal-400 font-bold ml-0.5">MD</span>
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
      <div className="p-4 mx-3 my-3 bg-slate-800/80 border border-slate-700/80 rounded-xl">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-teal-500/20 text-teal-300 flex items-center justify-center font-bold text-xs border border-teal-500/30">
            AK
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-bold text-white truncate">
              {doctor.name}
            </div>
            <div className="text-[11px] text-teal-400 flex items-center gap-1">
              <Stethoscope className="w-3 h-3" />
              <span>{doctor.specialty?.split("&")[0] || "Internal Medicine"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-1 py-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-colors",
                isActive
                  ? "bg-teal-600 text-white shadow-xs"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              )}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-800 space-y-2">
        <Link
          href="/patient/dashboard"
          className="flex items-center justify-between text-xs text-slate-400 hover:text-teal-300 px-2 py-1.5 rounded-md hover:bg-slate-800 transition-colors"
        >
          <span>Switch to Patient View</span>
          <span className="text-[10px] font-semibold bg-slate-700 px-1.5 py-0.5 rounded text-slate-300">
            Demo
          </span>
        </Link>
        <Link
          href="/login"
          className="flex items-center gap-2 text-xs text-rose-400 hover:text-rose-300 px-2 py-1.5 rounded-md hover:bg-rose-950/30 transition-colors"
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
      <div className="md:hidden flex items-center justify-between p-4 bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-teal-500 flex items-center justify-center text-slate-950">
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
