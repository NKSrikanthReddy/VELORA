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
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
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
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-600">
          <thead className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-semibold text-slate-700 uppercase tracking-wider">
            <tr>
              <th scope="col" className="px-5 py-3.5">Document Name</th>
              <th scope="col" className="px-5 py-3.5">Type</th>
              <th scope="col" className="px-5 py-3.5">Upload Date</th>
              <th scope="col" className="px-5 py-3.5">Status</th>
              <th scope="col" className="px-5 py-3.5 text-right">Entities Extracted</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {displayDocs.map((doc) => (
              <tr
                key={doc.id}
                className="hover:bg-slate-50/70 transition-colors"
              >
                <td className="px-5 py-3.5 font-medium text-slate-900 flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-700 shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block font-semibold text-slate-900">{doc.name}</span>
                    <span className="text-[11px] text-slate-400">
                      {doc.fileSize} {doc.pageCount ? `• ${doc.pageCount} pages` : ""}
                    </span>
                  </div>
                </td>
                <td className="px-5 py-3.5 text-slate-700">
                  <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px] font-medium border border-slate-200/60">
                    {doc.type}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-slate-500 whitespace-nowrap">
                  {formatDate(doc.uploadDate)}
                </td>
                <td className="px-5 py-3.5 whitespace-nowrap">
                  {getStatusBadge(doc.status)}
                </td>
                <td className="px-5 py-3.5 text-right font-medium text-slate-700">
                  {doc.extractedEntitiesCount !== undefined && doc.extractedEntitiesCount > 0 ? (
                    <span className="inline-flex items-center gap-1 text-teal-700 bg-teal-50 px-2 py-0.5 rounded font-semibold text-[11px]">
                      <FileCheck className="w-3 h-3" />
                      {doc.extractedEntitiesCount} entities
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
