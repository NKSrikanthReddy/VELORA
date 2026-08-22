import * as React from "react";
import { MedicalDocument } from "@/types/medical";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";
import { FileText, Clock, AlertCircle, CheckCircle2, FileCheck } from "lucide-react";

interface DocumentListProps {
  documents: MedicalDocument[];
  limit?: number;
}

export function DocumentList({ documents, limit }: DocumentListProps) {
  const displayDocs = limit ? documents.slice(0, limit) : documents;

  const getStatusBadge = (status: MedicalDocument["status"]) => {
    switch (status) {
      case "completed":
        return (
          <Badge variant="success" size="sm">
            <CheckCircle2 className="w-3 h-3 text-[#0F9D94]" />
            <span>Completed</span>
          </Badge>
        );
      case "processing":
        return (
          <Badge variant="warning" size="sm">
            <Clock className="w-3 h-3 text-amber-600 animate-spin" />
            <span>Processing</span>
          </Badge>
        );
      case "failed":
        return (
          <Badge variant="danger" size="sm">
            <AlertCircle className="w-3 h-3 text-rose-600" />
            <span>Failed</span>
          </Badge>
        );
      default:
        return <Badge variant="default" size="sm">{status}</Badge>;
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-600">
          <thead className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold text-slate-700 uppercase tracking-wider">
            <tr>
              <th scope="col" className="px-5 py-4">Document Name</th>
              <th scope="col" className="px-5 py-4">Type</th>
              <th scope="col" className="px-5 py-4">Upload Date</th>
              <th scope="col" className="px-5 py-4">Status</th>
              <th scope="col" className="px-5 py-4 text-right">Entities Extracted</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {displayDocs.map((doc) => (
              <tr
                key={doc.id}
                className="hover:bg-slate-50/60 transition-colors"
              >
                <td className="px-5 py-4 font-medium text-[#0F172A] flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-teal-50 border border-teal-100 flex items-center justify-center text-[#0F9D94] shrink-0 shadow-2xs">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block font-bold text-[#0F172A]">{doc.name}</span>
                    <span className="text-[11px] text-slate-400 font-normal">
                      {doc.fileSize} {doc.pageCount ? `&bull; ${doc.pageCount} pages` : ""}
                    </span>
                  </div>
                </td>
                <td className="px-5 py-4 text-slate-700">
                  <span className="bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full text-[11px] font-medium border border-slate-200/60">
                    {doc.type}
                  </span>
                </td>
                <td className="px-5 py-4 text-slate-500 whitespace-nowrap">
                  {formatDate(doc.uploadDate)}
                </td>
                <td className="px-5 py-4 whitespace-nowrap">
                  {getStatusBadge(doc.status)}
                </td>
                <td className="px-5 py-4 text-right font-medium text-slate-700">
                  {doc.extractedEntitiesCount !== undefined && doc.extractedEntitiesCount > 0 ? (
                    <span className="inline-flex items-center gap-1 text-[#0F9D94] bg-teal-50 px-2.5 py-0.5 rounded-full font-bold text-[11px] border border-teal-100">
                      <FileCheck className="w-3 h-3" />
                      {doc.extractedEntitiesCount} facts
                    </span>
                  ) : (
                    <span className="text-slate-400 italic text-[11px]">Processing...</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
