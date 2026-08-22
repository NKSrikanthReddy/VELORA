"use client";

import * as React from "react";
import { ChatMessage as ChatMessageType, Evidence } from "@/types/medical";
import { ChatMessage } from "./ChatMessage";
import { Button } from "@/components/ui/Button";
import { askPatientRecords, getOrCreateChatSession } from "@/lib/api";
import {
  Sparkles,
  Send,
  ShieldCheck,
  RotateCcw,
  Search,
} from "lucide-react";

interface AskMyRecordsProps {
  patientId?: string;
  onViewEvidence: (evidence: Evidence) => void;
}

export function AskMyRecords({
  patientId = "patient-001",
  onViewEvidence,
}: AskMyRecordsProps) {
  const [sessionId, setSessionId] = React.useState<string | null>(null);
  const [messages, setMessages] = React.useState<ChatMessageType[]>([
    {
      id: "msg-init-1",
      role: "doctor",
      content: "What was the patient's latest HbA1c?",
      createdAt: "10:32 AM",
    },
    {
      id: "msg-init-2",
      role: "assistant",
      content:
        "The most recent HbA1c found in the available records was 7.4%, documented on 12 June 2025 (Apex Diagnostic Laboratories). A previous HbA1c from 15 March 2023 was documented at 7.2%.",
      createdAt: "10:32 AM",
      evidence: [
        {
          id: "ev-init-hba1c",
          documentId: "doc-001",
          documentName: "Blood_Report_2025.pdf",
          page: 2,
          relevantText:
            "Hemoglobin A1c (HbA1c): 7.4 % [Reference: Non-diabetic < 5.7, Target for Diabetics < 7.0].",
        },
      ],
    },
  ]);

  const [inputQuery, setInputQuery] = React.useState("");
  const [isThinking, setIsThinking] = React.useState(false);
  const chatBottomRef = React.useRef<HTMLDivElement>(null);

  // Initialize chat session on mount
  React.useEffect(() => {
    let isMounted = true;
    async function initSession() {
      try {
        const session = await getOrCreateChatSession(patientId);
        if (isMounted && session?.id) {
          setSessionId(session.id);
        }
      } catch (err) {
        console.warn("Could not pre-init session:", err);
      }
    }
    initSession();
    return () => {
      isMounted = false;
    };
  }, [patientId]);

  const presetQuestions = [
    "What medications has the patient taken?",
    "What was the latest HbA1c?",
    "What diagnoses are documented?",
    "When was the patient hospitalized?",
    "What is the patient's allergy information?",
    "Can you diagnose chest pain?",
  ];

  const handleAsk = async (queryText: string) => {
    if (!queryText.trim() || isThinking) return;

    const currentQuery = queryText.trim();
    setInputQuery("");

    const nowStr = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    const userMessage: ChatMessageType = {
      id: `usr-${Date.now()}`,
      role: "doctor",
      content: currentQuery,
      createdAt: nowStr,
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsThinking(true);

    try {
      const botResponse = await askPatientRecords(patientId, currentQuery, sessionId || undefined);
      setMessages((prev) => [...prev, botResponse]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-err-${Date.now()}`,
          role: "assistant",
          content: err.message || "Failed to query patient records.",
          createdAt: nowStr,
        },
      ]);
    } finally {
      setIsThinking(false);
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: "msg-welcome",
        role: "assistant",
        content:
          "Hello Doctor. You can ask any question grounded in the patient's available consolidated medical documents (prescriptions, lab tests, hospital records).",
        createdAt: "Now",
      },
    ]);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden flex flex-col">
      {/* Header */}
      <div className="p-5 sm:p-6 border-b border-slate-100 bg-slate-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#0F9D94] to-cyan-500 flex items-center justify-center text-slate-950 shadow-xs">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm sm:text-base text-[#0F172A]">
                Ask My Records
              </h3>
              <span className="text-[11px] font-semibold text-cyan-900 bg-cyan-50 px-2.5 py-0.5 rounded-full border border-cyan-200/80">
                Evidence-Grounded Search
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Strictly limited to available medical records &bull; Direct source verification
            </p>
          </div>
        </div>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleResetChat}
          className="text-xs text-slate-500 self-end sm:self-auto hover:text-slate-800"
        >
          <RotateCcw className="w-3.5 h-3.5 mr-1" />
          <span>Reset Session</span>
        </Button>
      </div>

      {/* Preset Suggestion Chips */}
      <div className="p-4 sm:p-5 bg-slate-50/40 border-b border-slate-100">
        <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-2.5">
          Suggested Clinical Queries:
        </span>
        <div className="flex flex-wrap gap-2">
          {presetQuestions.map((q, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleAsk(q)}
              className="text-xs px-3 py-1.5 rounded-full bg-white border border-slate-200/80 hover:border-[#0F9D94]/60 hover:bg-teal-50/40 text-slate-700 hover:text-slate-900 transition-all duration-200 text-left cursor-pointer shadow-2xs"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Messages Thread */}
      <div className="p-5 sm:p-6 space-y-4 max-h-[460px] overflow-y-auto bg-slate-50/20">
        {messages.map((msg) => (
          <ChatMessage
            key={msg.id}
            message={msg}
            onViewEvidence={onViewEvidence}
          />
        ))}

        {isThinking && (
          <div className="flex items-center gap-2 text-xs text-slate-500 p-3.5 rounded-xl bg-slate-100/90 animate-pulse w-fit border border-slate-200/60">
            <Sparkles className="w-4 h-4 text-[#0F9D94] animate-spin" />
            <span>Searching medical records and verifying source documents...</span>
          </div>
        )}

        <div ref={chatBottomRef} />
      </div>

      {/* Input Box */}
      <div className="p-4 sm:p-5 border-t border-slate-200/80 bg-white">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAsk(inputQuery);
          }}
          className="flex items-center gap-2.5"
        >
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ask a question about the patient's records (e.g. What medications has the patient taken?)"
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F9D94] focus:bg-white transition-all text-[#0F172A]"
            />
          </div>
          <Button
            type="submit"
            disabled={!inputQuery.trim() || isThinking}
            size="md"
            className="shrink-0 text-xs font-semibold px-4 h-10"
          >
            <span>Ask</span>
            <Send className="w-3.5 h-3.5 ml-1" />
          </Button>
        </form>

        <div className="flex items-center justify-between mt-2.5 text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#0F9D94]" />
            <span>Answers generated strictly from available record extracts.</span>
          </div>
          <span className="hidden sm:inline">Press Enter to send</span>
        </div>
      </div>
    </div>
  );
}
