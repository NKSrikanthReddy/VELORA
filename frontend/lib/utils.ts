import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return "Date Unknown";
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateString || "Date Unknown";
  }
}

export function getConfidenceBadge(confidence: number): {
  label: string;
  variant: "success" | "warning" | "info" | "default";
} {
  if (confidence >= 0.9) return { label: "High Confidence (95%)", variant: "success" };
  if (confidence >= 0.75) return { label: "Good Confidence (82%)", variant: "info" };
  if (confidence >= 0.5) return { label: "Moderate (65%)", variant: "warning" };
  return { label: "Low Confidence", variant: "default" };
}
