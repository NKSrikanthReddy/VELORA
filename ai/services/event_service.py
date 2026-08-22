from typing import List, Optional, Dict, Any
from ai.schemas.extraction import CanonicalMedicalExtraction
from ai.schemas.events import MedicalEvent, Timeline

class EventService:
    """
    Converts canonical extracted medical data into timeline events,
    deduplicates identical items, and sorts them chronologically.
    """

    def generate_events_from_extraction(
        self,
        extraction: CanonicalMedicalExtraction,
        patient_id: Optional[str] = None,
        document_id: Optional[str] = None,
        filename: Optional[str] = None
    ) -> List[MedicalEvent]:
        """Converts a CanonicalMedicalExtraction object into a list of MedicalEvents."""
        events: List[MedicalEvent] = []
        doc_date = extraction.date

        # 1. Diagnoses
        for diag in extraction.diagnoses:
            ev_page = diag.evidence.page_number if diag.evidence else 1
            ev_text = diag.evidence.source_text if diag.evidence else diag.text
            ev_doc_id = (diag.evidence.document_id if diag.evidence and diag.evidence.document_id else document_id)
            ev_filename = (diag.evidence.filename if diag.evidence and diag.evidence.filename else filename)

            events.append(MedicalEvent(
                patient_id=patient_id,
                document_id=ev_doc_id,
                filename=ev_filename,
                event_date=doc_date,
                event_type="diagnosis",
                title=f"Diagnosis: {diag.text}",
                description=f"Documented diagnosis of {diag.text} (Status: {diag.status or 'documented'})",
                confidence=diag.confidence,
                page_number=ev_page,
                source_text=ev_text
            ))

        # 2. Medications
        for med in extraction.medications:
            ev_page = med.evidence.page_number if med.evidence else 1
            ev_text = med.evidence.source_text if med.evidence else f"{med.name} {med.dosage or ''}"
            ev_doc_id = (med.evidence.document_id if med.evidence and med.evidence.document_id else document_id)
            ev_filename = (med.evidence.filename if med.evidence and med.evidence.filename else filename)

            desc = f"Prescribed {med.name}"
            if med.dosage:
                desc += f" {med.dosage}"
            if med.frequency:
                desc += f" ({med.frequency})"

            events.append(MedicalEvent(
                patient_id=patient_id,
                document_id=ev_doc_id,
                filename=ev_filename,
                event_date=doc_date,
                event_type="medication",
                title=f"Medication: {med.name}",
                description=desc,
                confidence=med.confidence,
                page_number=ev_page,
                source_text=ev_text
            ))

        # 3. Lab Results
        for lab in extraction.lab_results:
            ev_page = lab.evidence.page_number if lab.evidence else 1
            ev_text = lab.evidence.source_text if lab.evidence else f"{lab.test_name}: {lab.value}"
            ev_doc_id = (lab.evidence.document_id if lab.evidence and lab.evidence.document_id else document_id)
            ev_filename = (lab.evidence.filename if lab.evidence and lab.evidence.filename else filename)

            events.append(MedicalEvent(
                patient_id=patient_id,
                document_id=ev_doc_id,
                filename=ev_filename,
                event_date=doc_date,
                event_type="lab_test",
                title=f"Lab Test: {lab.test_name}",
                description=f"{lab.test_name} result: {lab.value} {lab.unit or ''}".strip(),
                confidence=lab.confidence,
                page_number=ev_page,
                source_text=ev_text
            ))

        # 4. Procedures
        for proc in extraction.procedures:
            ev_page = proc.evidence.page_number if proc.evidence else 1
            ev_text = proc.evidence.source_text if proc.evidence else proc.name
            ev_doc_id = (proc.evidence.document_id if proc.evidence and proc.evidence.document_id else document_id)
            ev_filename = (proc.evidence.filename if proc.evidence and proc.evidence.filename else filename)

            proc_date = proc.date or doc_date
            events.append(MedicalEvent(
                patient_id=patient_id,
                document_id=ev_doc_id,
                filename=ev_filename,
                event_date=proc_date,
                event_type="procedure",
                title=f"Procedure: {proc.name}",
                description=f"Performed procedure: {proc.name}",
                confidence=proc.confidence,
                page_number=ev_page,
                source_text=ev_text
            ))

        # 5. Document Type Event (e.g. Admission / Discharge / Consultation)
        if extraction.document_type in {"admission", "discharge_summary", "consultation", "follow_up"}:
            ev_type = "hospitalization" if extraction.document_type == "admission" else (
                "discharge" if extraction.document_type == "discharge_summary" else (
                    "follow_up" if extraction.document_type == "follow_up" else "consultation"
                )
            )
            events.append(MedicalEvent(
                patient_id=patient_id,
                document_id=document_id,
                filename=filename,
                event_date=doc_date,
                event_type=ev_type,
                title=f"{extraction.document_type.replace('_', ' ').capitalize()}",
                description=f"Clinical document encounter recorded at {extraction.hospital or 'clinic'}",
                confidence="high",
                page_number=1,
                source_text=f"Document Type: {extraction.document_type}"
            ))

        return events

    def create_timeline(self, all_events: List[MedicalEvent], patient_id: Optional[str] = None) -> Timeline:
        """
        Deduplicates events and sorts them chronologically.
        Events with null dates are placed at the end.
        """
        # 1. Deduplicate exact duplicate events
        unique_events: List[MedicalEvent] = []
        seen_keys = set()

        for ev in all_events:
            key = (ev.event_type, ev.title.lower(), ev.event_date, ev.document_id, ev.page_number)
            if key not in seen_keys:
                seen_keys.add(key)
                unique_events.append(ev)

        # 2. Chronological sorting helper: return high string for null to sort last
        def sort_key(event: MedicalEvent):
            if not event.event_date:
                return "9999-99-99"
            return event.event_date

        sorted_events = sorted(unique_events, key=sort_key)
        return Timeline(patient_id=patient_id, events=sorted_events)
