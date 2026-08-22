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
    <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
      <div className="space-y-1">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-700 text-xs font-semibold border border-teal-200">
          <KeyRound className="w-3.5 h-3.5" />
          <span>Temporary Doctor Authorization</span>
        </div>
        <h2 className="text-xl font-bold text-slate-900">
          Share Medical History
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
          Your physician or specialist can enter this secure temporary code in their Doctor Portal to review your consolidated clinical records and timeline.
        </p>
      </div>

      {/* Prominent Code Box */}
      <div className="bg-gradient-to-br from-slate-900 to-teal-950 rounded-2xl p-6 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-teal-900/50 shadow-md">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-widest text-teal-300 block mb-1">
            Active Access Code
          </span>
          <div className="text-3xl sm:text-4xl font-extrabold tracking-widest font-mono text-white selection:bg-teal-500">
            {accessCode || "------"}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-teal-200/80 mt-2">
            <Clock className="w-3.5 h-3.5" />
            <span>Valid through {expiresAt}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            type="button"
            variant="subtle"
            size="md"
            onClick={handleCopy}
            className="bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
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
            variant="subtle"
            size="md"
            onClick={onGenerateNewCode}
            className="bg-teal-600 hover:bg-teal-500 text-white border-0 text-xs"
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
