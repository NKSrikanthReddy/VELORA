import * as React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface LoadingProps {
  message?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
  fullScreen?: boolean;
}

export function Loading({
  message = "Loading records...",
  size = "md",
  className,
  fullScreen = false,
}: LoadingProps) {
  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  const textSizes = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base font-medium",
  };

  const content = (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-8 text-center text-slate-600 gap-3",
        className
      )}
    >
      <Loader2
        className={cn("animate-spin text-teal-600", iconSizes[size])}
      />
      {message && (
        <p className={cn("text-slate-600 animate-pulse", textSizes[size])}>
          {message}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-xs">
        {content}
      </div>
    );
  }

  return content;
}

export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-slate-200/70",
        className
      )}
      {...props}
    />
  );
}
