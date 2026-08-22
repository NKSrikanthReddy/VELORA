"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  UploadCloud,
  Clock,
  KeyRound,
  FileText,
  LogOut,
  UserCheck,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { mockPatient } from "@/data/mockData";

export function PatientSidebar() {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);

  const navItems = [
    {
      label: "Dashboard",
      href: "/patient/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Upload Documents",
      href: "/patient/upload",
      icon: UploadCloud,
    },
    {
      label: "Medical History",
      href: "/patient/history",
      icon: Clock,
    },
    {
      label: "Doctor Access",
      href: "/patient/access",
      icon: KeyRound,
    },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white border-r border-slate-200">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-100 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2.5"
          onClick={() => setIsMobileOpen(false)}
        >
          <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center text-white shadow-xs">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-slate-900 tracking-tight">MedBrief</span>
            <span className="text-teal-600 font-bold ml-0.5">AI</span>
          </div>
        </Link>
        <button
          onClick={() => setIsMobileOpen(false)}
          className="md:hidden text-slate-400 hover:text-slate-600 p-1"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Patient Profile Card */}
      <div className="p-4 mx-3 my-3 bg-slate-50 border border-slate-200/80 rounded-xl">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-semibold text-xs border border-teal-200">
            RS
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-bold text-slate-900 truncate">
              {mockPatient.name}
            </div>
            <div className="text-[11px] text-slate-500 flex items-center gap-1">
              <UserCheck className="w-3 h-3 text-teal-600" />
              <span>Patient Portal</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation links */}
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
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              )}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer / Switch link */}
      <div className="p-4 border-t border-slate-100 space-y-2">
        <Link
          href="/doctor/dashboard"
          className="flex items-center justify-between text-xs text-slate-500 hover:text-teal-600 px-2 py-1.5 rounded-md hover:bg-teal-50 transition-colors"
        >
          <span>Switch to Doctor View</span>
          <span className="text-[10px] font-semibold bg-slate-200/80 px-1.5 py-0.5 rounded">
            Demo
          </span>
        </Link>
        <Link
          href="/login"
          className="flex items-center gap-2 text-xs text-rose-600 hover:text-rose-700 px-2 py-1.5 rounded-md hover:bg-rose-50 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </Link>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Menu Trigger */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white border-b border-slate-200 sticky top-0 z-30">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-teal-600 flex items-center justify-center text-white">
            <FileText className="w-4 h-4" />
          </div>
          <span className="font-bold text-sm text-slate-900">MedBrief AI</span>
        </Link>
        <button
          onClick={() => setIsMobileOpen(true)}
          className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
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
