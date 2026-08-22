import * as React from "react";
import { FileText, CalendarDays, Clock, CheckCircle2 } from "lucide-react";
import { mockPatient } from "@/data/mockData";
import { formatDate } from "@/lib/utils";

export function DashboardStats() {
  const stats = [
    {
      label: "Consolidated Records",
      value: `${mockPatient.documentCount} Files`,
      subtext: "Prescriptions, labs & summaries",
      icon: FileText,
      iconColor: "text-[#0F9D94]",
      iconBg: "bg-teal-50/80 border-teal-100/80",
    },
    {
      label: "Timeline Events",
      value: `${mockPatient.medicalEventCount} Events`,
      subtext: "Reconstructed chronological points",
      icon: CalendarDays,
      iconColor: "text-cyan-700",
      iconBg: "bg-cyan-50/80 border-cyan-100/80",
    },
    {
      label: "History Span",
      value: "2022 – 2026",
      subtext: "4+ years longitudinal data",
      icon: Clock,
      iconColor: "text-slate-700",
      iconBg: "bg-slate-100/80 border-slate-200/80",
    },
    {
      label: "Extraction Status",
      value: "Fully Verified",
      subtext: "All source documents indexed",
      icon: CheckCircle2,
      iconColor: "text-[#0F9D94]",
      iconBg: "bg-teal-50/80 border-teal-100/80",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <div
            key={i}
            className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between hover:border-slate-300 hover:shadow-sm transition-all duration-200 group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider text-[11px]">
                {stat.label}
              </span>
              <div
                className={`w-9 h-9 rounded-xl ${stat.iconBg} border flex items-center justify-center ${stat.iconColor} group-hover:scale-105 transition-transform shadow-2xs`}
              >
                <Icon className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3.5">
              <div className="text-2xl font-extrabold text-[#0F172A] tracking-tight">
                {stat.value}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">{stat.subtext}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
