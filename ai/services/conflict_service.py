from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field

from ai.schemas.extraction import CanonicalMedicalExtraction
from ai.schemas.evidence import EvidenceSchema

class MedicalConflict(BaseModel):
    type: str = Field(description="Conflict category: medication_dosage_conflict, medication_frequency_conflict, contradictory_diagnosis_status, conflicting_lab_information, conflicting_dates")
    status: str = Field(default="needs_verification", description="Status indicator")
    entity: str = Field(description="Medical entity in conflict (e.g. Metformin)")
    values: List[str] = Field(description="Conflicting values found across records")
    sources: List[EvidenceSchema] = Field(default_factory=list, description="Source references for conflicting values")
    explanation: str = Field(default="Multiple values are documented; verification is required.")

class ConflictService:
    """
    Detects clinical conflicts across multiple extracted medical records.
    Never chooses a winning value; highlights discrepancies for clinical verification.
    """

    def detect_conflicts(self, extractions: List[CanonicalMedicalExtraction]) -> List[MedicalConflict]:
        """Scans multiple CanonicalMedicalExtractions and identifies clinical conflicts."""
        conflicts: List[MedicalConflict] = []

        # 1. Medication Dosage & Frequency Conflicts
        med_records: Dict[str, List[Dict[str, Any]]] = {}
        for ext in extractions:
            for med in ext.medications:
                med_key = (med.normalized_name or med.name).lower()
                if med_key not in med_records:
                    med_records[med_key] = []
                med_records[med_key].append({
                    "name": med.name,
                    "dosage": med.dosage,
                    "frequency": med.frequency,
                    "evidence": med.evidence
                })

        for med_name, instances in med_records.items():
            dosages = {inst["dosage"] for inst in instances if inst["dosage"]}
            if len(dosages) > 1:
                sources = [inst["evidence"] for inst in instances if inst["evidence"]]
                conflicts.append(MedicalConflict(
                    type="medication_dosage_conflict",
                    entity=instances[0]["name"],
                    values=sorted(list(dosages)),
                    sources=sources,
                    explanation=f"Multiple dosages documented for {instances[0]['name']}: {', '.join(dosages)}. Verification is required."
                ))

            freqs = {inst["frequency"] for inst in instances if inst["frequency"]}
            if len(freqs) > 1:
                sources = [inst["evidence"] for inst in instances if inst["evidence"]]
                conflicts.append(MedicalConflict(
                    type="medication_frequency_conflict",
                    entity=instances[0]["name"],
                    values=sorted(list(freqs)),
                    sources=sources,
                    explanation=f"Multiple administration frequencies documented for {instances[0]['name']}: {', '.join(freqs)}. Verification is required."
                ))

        # 2. Diagnosis Status Conflicts
        diag_records: Dict[str, List[Dict[str, Any]]] = {}
        for ext in extractions:
            for diag in ext.diagnoses:
                diag_key = (diag.normalized_text or diag.text).lower()
                if diag_key not in diag_records:
                    diag_records[diag_key] = []
                diag_records[diag_key].append({
                    "text": diag.text,
                    "status": diag.status or "documented",
                    "evidence": diag.evidence
                })

        for diag_name, instances in diag_records.items():
            statuses = {inst["status"] for inst in instances if inst["status"]}
            if "ruled_out" in statuses and ("documented" in statuses or "suspected" in statuses):
                sources = [inst["evidence"] for inst in instances if inst["evidence"]]
                conflicts.append(MedicalConflict(
                    type="contradictory_diagnosis_status",
                    entity=instances[0]["text"],
                    values=sorted(list(statuses)),
                    sources=sources,
                    explanation=f"Diagnosis '{instances[0]['text']}' has contradictory status across records ({', '.join(statuses)}). Verification is required."
                ))

        return conflicts
