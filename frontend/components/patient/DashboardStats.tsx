import * as React from "react";
import { FileText, CalendarDays, Clock, CheckCircle2 } from "lucide-react";
import { mockPatient } from "@/data/mockData";
import { formatDate } from "@/lib/utils";

export function DashboardStats() {
  const stats = [
    {
      label: "Consolidated Documents",
      value: mockPatient.documentCount,
      subtext: "Prescriptions, labs & discharge",
      icon: FileText,
      color: "text-teal-600",
      bgColor: "bg-teal-50",
      borderColor: "border-teal-100",
    },
    {
      label: "Extracted Medical Events",
      value: mockPatient.medicalEventCount,
      subtext: "Chronological timeline entries",
      icon: CalendarDays,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-100",
    },
    {
      label: "Timeline Span",
      value: "2022 - 2026",
      subtext: "4+ years history reconstructed",
      icon: Clock,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
      borderColor: "border-indigo-100",
    },
    {
      label: "Last Updated",
      value: formatDate(mockPatient.lastUpdated),
      subtext: "All documents processed",
      icon: CheckCircle2,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-100",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <div
            key={i}
            className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">
                {stat.label}
              </span>
              <div
                className={`w-8 h-8 rounded-lg ${stat.bgColor} ${stat.borderColor} border flex items-center justify-center ${stat.color}`}
              >
                <Icon className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-bold text-slate-900 tracking-tight">
                {stat.value}
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">{stat.subtext}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
