import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?:
    | "default"
    | "success"
    | "warning"
    | "danger"
    | "info"
    | "cyan"
    | "outline"
    | "subtle";
  size?: "sm" | "md";
}

export function Badge({
  className,
  variant = "default",
  size = "md",
  ...props
}: BadgeProps) {
  const variants = {
    default: "bg-slate-100 text-slate-700 border-slate-200/80",
    success: "bg-teal-50 text-[#0F9D94] border-teal-200/70 font-semibold",
    warning: "bg-amber-50 text-amber-800 border-amber-200/80",
    danger: "bg-rose-50 text-rose-700 border-rose-200/80",
    info: "bg-teal-50 text-teal-800 border-teal-200/80",
    cyan: "bg-cyan-50 text-cyan-900 border-cyan-200/80 font-semibold",
    subtle: "bg-slate-50 text-slate-600 border-slate-200/60",
    outline: "border-slate-300 text-slate-700 bg-transparent",
  };

  const sizes = {
    sm: "text-[11px] px-2.5 py-0.5 font-medium rounded-full",
    md: "text-xs px-3 py-1 font-medium rounded-full",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 border tracking-tight transition-colors shadow-2xs",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  );
}
