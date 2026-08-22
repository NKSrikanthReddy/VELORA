"use client";

import * as React from "react";
import { DoctorAccess } from "@/types/medical";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Stethoscope, ShieldCheck, AlertTriangle, UserX } from "lucide-react";

interface ActiveAccessListProps {
  accessList: DoctorAccess[];
  onRevokeAccess: (accessId: string) => void;
}

export function ActiveAccessList({
  accessList,
  onRevokeAccess,
}: ActiveAccessListProps) {
  const [selectedForRevocation, setSelectedForRevocation] =
    React.useState<DoctorAccess | null>(null);

  const handleConfirmRevoke = () => {
    if (selectedForRevocation) {
      onRevokeAccess(selectedForRevocation.id);
      setSelectedForRevocation(null);
    }
  };

  const activeItems = accessList.filter((a) => a.active);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
      <div className="p-5 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-sm text-slate-900">
            Active Doctor Authorizations
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Physicians currently permitted to view clinical summaries and records
          </p>
        </div>
        <Badge variant={activeItems.length > 0 ? "success" : "default"} size="sm">
          {activeItems.length} Active
        </Badge>
      </div>

      {activeItems.length === 0 ? (
        <div className="p-8 text-center text-xs text-slate-500">
          No doctors currently have active access to your records. Generate a code above to grant access.
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
          {activeItems.map((access) => (
            <div
              key={access.id}
              className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-700 shrink-0">
                  <Stethoscope className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900">
                      {access.doctorName}
                    </span>
                    <Badge variant="success" size="sm">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      <span>Access Granted</span>
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {access.hospital || "Specialty Clinic"} • {access.specialty || "General Medicine"}
                  </p>
                  <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1.5">
                    <span>Granted: {access.grantedAt}</span>
                    <span>•</span>
                    <span className="text-amber-700 font-medium">Expires: {access.expiresAt}</span>
                    <span>•</span>
                    <span className="font-mono bg-slate-100 px-1.5 py-0.2 rounded text-slate-600">
                      Code: {access.accessCode}
                    </span>
                  </div>
                </div>
              </div>

              <div className="self-end sm:self-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedForRevocation(access)}
                  className="border-rose-200 text-rose-700 hover:bg-rose-50 text-xs"
                >
                  <UserX className="w-3.5 h-3.5" />
                  <span>Revoke</span>
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Confirmation Modal */}
      <Modal
        isOpen={!!selectedForRevocation}
        onClose={() => setSelectedForRevocation(null)}
        title="Revoke Doctor Access"
        maxWidth="md"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-900">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
            <div className="leading-relaxed">
              Are you sure you want to revoke access for{" "}
              <strong>{selectedForRevocation?.doctorName}</strong>? They will immediately lose access to your clinical briefing and medical records.
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedForRevocation(null)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={handleConfirmRevoke}
            >
              Yes, Revoke Access
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
