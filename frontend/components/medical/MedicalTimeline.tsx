"use client";

import * as React from "react";
import { TimelineEvent as TimelineEventType, Evidence } from "@/types/medical";
import { TimelineEvent } from "./TimelineEvent";
import { Clock, Filter, CalendarDays, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface MedicalTimelineProps {
  events: TimelineEventType[];
  onViewEvidence: (evidence: Evidence) => void;
}

export function MedicalTimeline({
  events,
  onViewEvidence,
}: MedicalTimelineProps) {
  const [activeFilter, setActiveFilter] = React.useState<string>("all");

  const filterOptions = [
    { id: "all", label: "All Events" },
    { id: "consultation", label: "Consultations" },
    { id: "blood", label: "Labs & Blood Tests" },
    { id: "prescription", label: "Prescriptions" },
    { id: "hospital", label: "Hospital Admissions" },
  ];

  const filteredEvents = React.useMemo(() => {
    if (activeFilter === "all") return events;
    return events.filter((e) => {
      const type = e.eventType.toLowerCase();
      if (activeFilter === "consultation") return type.includes("consult");
      if (activeFilter === "blood") return type.includes("blood") || type.includes("lab");
      if (activeFilter === "prescription") return type.includes("prescrip");
      if (activeFilter === "hospital")
        return type.includes("hospital") || type.includes("admission") || type.includes("discharge");
      return true;
    });
  }, [events, activeFilter]);

  // Group events by Year (and Date Unknown)
  const groupedEvents = React.useMemo(() => {
    const groups: { [year: string]: TimelineEventType[] } = {};

    filteredEvents.forEach((evt) => {
      let key = "Date Unknown";
      if (evt.date) {
        const d = new Date(evt.date);
        key = isNaN(d.getFullYear()) ? "Date Unknown" : d.getFullYear().toString();
      }
      if (!groups[key]) groups[key] = [];
      groups[key].push(evt);
    });

    // Sort year keys descending (2026, 2025, 2024, 2023, 2022, Date Unknown)
    const sortedKeys = Object.keys(groups).sort((a, b) => {
      if (a === "Date Unknown") return 1;
      if (b === "Date Unknown") return -1;
      return parseInt(b) - parseInt(a);
    });

    return sortedKeys.map((year) => ({
      year,
      events: groups[year],
    }));
  }, [filteredEvents]);

  return (
    <div className="space-y-6">
      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Clock className="w-5 h-5 text-teal-600" />
            <span>Chronological Medical Timeline</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Consolidated timeline extracted across all available records from 2022 to 2026
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <Filter className="w-3.5 h-3.5 text-slate-400 mr-1 shrink-0" />
          {filterOptions.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setActiveFilter(opt.id)}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
                activeFilter === opt.id
                  ? "bg-teal-600 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline Stream */}
      {groupedEvents.length === 0 ? (
        <div className="p-8 text-center text-xs text-slate-500 bg-white rounded-xl border border-slate-200">
          No medical events match the selected filter.
        </div>
      ) : (
        <div className="space-y-8 pl-1 sm:pl-2">
          {groupedEvents.map((group) => (
            <div key={group.year} className="space-y-4">
              {/* Year Marker Badge */}
              <div className="sticky top-20 z-10 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 text-white text-xs font-bold font-mono tracking-wider shadow-sm">
                {group.year === "Date Unknown" ? (
                  <>
                    <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                    <span className="text-amber-300">Date Unknown</span>
                  </>
                ) : (
                  <>
                    <CalendarDays className="w-3.5 h-3.5 text-teal-400" />
                    <span>{group.year}</span>
                  </>
                )}
              </div>

              {/* Events in this year */}
              <div className="pt-2">
                {group.events.map((evt, idx) => (
                  <TimelineEvent
                    key={evt.id}
                    event={evt}
                    onViewEvidence={onViewEvidence}
                    isLast={idx === group.events.length - 1}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
