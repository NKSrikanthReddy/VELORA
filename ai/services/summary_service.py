import json
from typing import List, Dict, Any, Optional
from pathlib import Path

from ai.services.ai_client import AIService
from ai.schemas.extraction import CanonicalMedicalExtraction
from ai.schemas.events import Timeline
from ai.schemas.summary import MedicalBriefing
from ai.services.conflict_service import MedicalConflict

class SummaryService:
    """
    Generates a structured clinical briefing for doctors from canonical extractions,
    timeline events, conflicts, and uncertainties.
    """

    def __init__(self, ai_service: Optional[AIService] = None):
        self.ai_service = ai_service or AIService()
        self.prompt_template = self._load_prompt()

    def _load_prompt(self) -> str:
        prompt_path = Path(__file__).parent.parent / "prompts" / "summary.txt"
        if prompt_path.exists():
            return prompt_path.read_text()
        return "Generate medical briefing from context: {{STRUCTURED_CONTEXT}}"

    def generate_briefing(
        self,
        extractions: List[CanonicalMedicalExtraction],
        timeline: Optional[Timeline] = None,
        conflicts: Optional[List[MedicalConflict]] = None
    ) -> MedicalBriefing:
        """Synthesizes structured clinical briefing for a physician."""
        if not extractions:
            return MedicalBriefing(
                patient_overview="No medical records found for this patient.",
                important_points_for_doctor=["No records available for consolidation."]
            )

        # Build clean structured context representation
        context_blocks = []
        for i, ext in enumerate(extractions, start=1):
            context_blocks.append(
                f"--- Document #{i} ({ext.document_type.upper()}) Date: {ext.date or 'Unknown'} ---\n"
                f"Diagnoses: {[d.text for d in ext.diagnoses]}\n"
                f"Medications: {[f'{m.name} {m.dosage or opacity_empty(m.dosage)}' for m in ext.medications]}\n"
                f"Lab Results: {[f'{l.test_name}: {l.value} {l.unit or opacity_empty(l.unit)}' for l in ext.lab_results]}\n"
                f"Procedures: {[p.name for p in ext.procedures]}\n"
                f"Vitals: {[f'{v.name}: {v.value}' for v in ext.vitals]}"
            )

        if timeline and timeline.events:
            event_strs = [f"[{ev.event_date or 'No Date'}] {ev.title} - {ev.description}" for ev in timeline.events]
            context_blocks.append("--- CHRONOLOGICAL TIMELINE --- \n" + "\n".join(event_strs))

        if conflicts:
            conflict_strs = [f"[CONFLICT] {c.type}: {c.explanation}" for c in conflicts]
            context_blocks.append("--- IDENTIFIED CLINICAL CONFLICTS --- \n" + "\n".join(conflict_strs))

        full_context = "\n\n".join(context_blocks)
        prompt = self.prompt_template.replace("{{STRUCTURED_CONTEXT}}", full_context[:8000])

        try:
            result_json = self.ai_service.complete_json(prompt)
            briefing = MedicalBriefing.model_validate(result_json)
        except Exception:
            briefing = self._fallback_briefing(extractions, timeline, conflicts)

        return briefing

    def _fallback_briefing(
        self,
        extractions: List[CanonicalMedicalExtraction],
        timeline: Optional[Timeline],
        conflicts: Optional[List[MedicalConflict]]
    ) -> MedicalBriefing:
        """Deterministic summary generator fallback."""
        diagnoses = []
        meds = []
        labs = []
        procs = []

        for ext in extractions:
            for d in ext.diagnoses: diagnoses.append(d.text)
            for m in ext.medications: meds.append(f"{m.name} {m.dosage or ''}".strip())
            for l in ext.lab_results: labs.append(f"{l.test_name}: {l.value} {l.unit or ''}".strip())
            for p in ext.procedures: procs.append(p.name)

        conflict_notes = [c.explanation for c in conflicts] if conflicts else []

        return MedicalBriefing(
            patient_overview="Patient record consolidation completed across available clinical documentation.",
            major_diagnoses=list(set(diagnoses)),
            medical_history=[],
            previous_procedures=list(set(procs)),
            medications=list(set(meds)),
            important_lab_results=list(set(labs)),
            recent_events=[f"[{ev.event_date or 'Unknown'}] {ev.title}" for ev in (timeline.events if timeline else [])],
            important_points_for_doctor=["Review flagged medication dosages and lab trends before evaluation."],
            uncertain_information=["Document dates unverified for certain legacy notes."] if any(ext.date is None for ext in extractions) else [],
            conflicts=conflict_notes
        )

def opacity_empty(val: Optional[str]) -> str:
    return val if val else ""
