"use client";

import * as React from "react";
import { Button } from "@/components/ui/Button";
import { Copy, Check, RefreshCw, KeyRound, ShieldAlert, Clock } from "lucide-react";

interface AccessCodeCardProps {
  accessCode: string;
  expiresAt: string;
  onGenerateNewCode: () => void;
  onRevokeAll: () => void;
}

export function AccessCodeCard({
  accessCode,
  expiresAt,
  onGenerateNewCode,
  onRevokeAll,
}: AccessCodeCardProps) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(accessCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-6">
      <div className="space-y-1">
        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-teal-50 text-[#0F9D94] text-xs font-semibold border border-teal-100">
          <KeyRound className="w-3.5 h-3.5" />
          <span>Temporary Doctor Authorization</span>
        </div>
        <h2 className="text-xl font-bold text-[#0F172A] tracking-tight">
          Share Medical History
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
          Your physician can enter this secure temporary code in their Doctor Portal to review your consolidated clinical records and timeline.
        </p>
      </div>

      {/* Prominent Code Box */}
      <div className="bg-[#0F172A] rounded-2xl p-6 sm:p-7 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-5 border border-slate-800 shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10">
          <span className="text-[11px] font-mono uppercase tracking-widest text-cyan-400 block mb-1 font-semibold">
            Active Access Code
          </span>
          <div className="text-3xl sm:text-4xl font-extrabold tracking-widest font-mono text-white selection:bg-[#0F9D94]">
            {accessCode || "------"}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-300 mt-2">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>Valid through {expiresAt}</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 relative z-10">
          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={handleCopy}
            className="bg-slate-800/80 hover:bg-slate-800 text-white border-slate-700 text-xs"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-cyan-400" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy Code</span>
              </>
            )}
          </Button>

          <Button
            type="button"
            size="md"
            onClick={onGenerateNewCode}
            className="text-xs font-semibold"
          >
            <RefreshCw className="w-4 h-4" />
            <span>New Code</span>
          </Button>
        </div>
      </div>

      {/* Control Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 text-xs text-slate-500 border-t border-slate-100">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-slate-400" />
          <span>Access can be revoked at any time with immediate effect.</span>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onRevokeAll}
          className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 self-start sm:self-auto text-xs"
        >
          Revoke All Access Codes
        </Button>
      </div>
    </div>
  );
}
