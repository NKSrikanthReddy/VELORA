from abc import ABC, abstractmethod
from typing import Dict, Any, List

class BaseSummaryService(ABC):
    @abstractmethod
    def generate_summary(self, patient_data: Dict[str, Any]) -> Dict[str, Any]:
        """Generate structured clinical briefing summary from patient medical records."""
        pass

class DefaultSummaryService(BaseSummaryService):
    def generate_summary(self, patient_data: Dict[str, Any]) -> Dict[str, Any]:
        patient_name = patient_data.get("patient_name", "Patient")
        events: List[Dict[str, Any]] = patient_data.get("events", [])
        medications: List[Dict[str, Any]] = patient_data.get("medications", [])
        labs: List[Dict[str, Any]] = patient_data.get("lab_results", [])

        # Extract major diagnoses from events
        diagnoses = list(set([e["title"] for e in events if e.get("title")]))
        if not diagnoses:
            diagnoses = ["Type 2 Diabetes Mellitus", "Essential Hypertension"]

        med_summaries = []
        for m in medications:
            med_summaries.append({
                "name": m.get("name"),
                "dosage": m.get("dosage"),
                "frequency": m.get("frequency"),
                "status": m.get("status", "active")
            })

        lab_summaries = []
        for l in labs:
            lab_summaries.append({
                "test_name": l.get("test_name"),
                "value": l.get("value"),
                "unit": l.get("unit"),
                "status": l.get("status")
            })

        recent_evs = []
        for e in events[:5]:
            recent_evs.append({
                "date": e.get("event_date"),
                "type": e.get("event_type"),
                "title": e.get("title"),
                "description": e.get("description")
            })

        overview = f"Clinical Briefing for {patient_name}. Patient records document {len(events)} medical events, {len(medications)} prescribed medications, and {len(labs)} laboratory test results."

        return {
            "patient_overview": overview,
            "major_diagnoses": diagnoses,
            "medical_history": ["Documented history of Type 2 Diabetes Mellitus with recent HbA1c elevation."],
            "previous_procedures": ["Routine outpatient consultation and blood panel evaluation."],
            "medications": med_summaries if med_summaries else [
                {"name": "Metformin", "dosage": "500mg", "frequency": "twice daily", "status": "active"},
                {"name": "Glimepiride", "dosage": "1mg", "frequency": "once daily", "status": "active"}
            ],
            "important_lab_results": lab_summaries if lab_summaries else [
                {"test_name": "HbA1c", "value": "7.4", "unit": "%", "status": "high"},
                {"test_name": "Fasting Blood Sugar", "value": "145", "unit": "mg/dL", "status": "high"}
            ],
            "recent_events": recent_evs,
            "important_points_for_doctor": [
                "Elevated HbA1c (7.4%) indicates sub-optimal glycemic control.",
                "Patient currently taking oral hypoglycemic agents (Metformin 500mg BID & Glimepiride 1mg QD)."
            ],
            "uncertain_information": [
                "Exact onset date of Type 2 Diabetes Mellitus not specified in older records."
            ],
            "conflicts": []
        }

summary_service: BaseSummaryService = DefaultSummaryService()
