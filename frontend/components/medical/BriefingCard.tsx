import * as React from "react";
import { cn } from "@/lib/utils";

interface BriefingCardProps {
  title: string;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  headerAction?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "warning" | "highlight";
}

export function BriefingCard({
  title,
  icon,
  badge,
  headerAction,
  children,
  className,
  variant = "default",
}: BriefingCardProps) {
  const borderStyles = {
    default: "border-slate-200/90",
    warning: "border-amber-300/80 bg-amber-50/20",
    highlight: "border-teal-200 bg-teal-50/20",
  };

  return (
    <div
      className={cn(
        "bg-white rounded-2xl border shadow-xs overflow-hidden transition-all",
        borderStyles[variant],
        className
      )}
    >
      <div className="px-5 py-4 border-b border-slate-100/90 bg-slate-50/60 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          {icon && (
            <div className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-teal-700 shadow-2xs">
              {icon}
            </div>
          )}
          <h3 className="font-bold text-sm tracking-tight text-slate-900 uppercase text-[12px] text-slate-700">
            {title}
          </h3>
          {badge}
        </div>
        {headerAction && <div>{headerAction}</div>}
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}
