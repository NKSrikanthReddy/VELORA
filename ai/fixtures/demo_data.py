"""
Fictional Medical Data Fixtures for Testing & Hackathon Demo.
Contains 7 fictional documents covering all test scenarios (Diabetes, Metformin conflict, HbA1c, procedures, missing dates).
NEVER contains real patient data.
"""

from typing import List, Dict, Any
from ai.schemas.extraction import CanonicalMedicalExtraction, Diagnosis, Medication, LabResult, Procedure, Vital
from ai.schemas.evidence import EvidenceSchema

FICTIONAL_PATIENT_ID = "pat_12345"

FICTIONAL_DOCUMENTS: List[Dict[str, Any]] = [
    {
        "document_id": "doc_001",
        "filename": "consultation_2023.pdf",
        "document_type": "consultation",
        "date": "2023-05-15",
        "text": """CITY GENERAL HOSPITAL - CLINICAL CONSULTATION NOTE
Date: 2023-05-15
Patient Name: John Doe (ID: pat_12345)
Attending Physician: Dr. Robert Smith

Chief Complaint: Routine follow-up for high blood sugar and fatigue.
Past History: Known case of Type 2 Diabetes Mellitus diagnosed in 2021.
Current Assessment: Type 2 Diabetes Mellitus.
Medication Prescribed: Metformin 500 mg twice daily.
Vitals: Blood Pressure: 120/80 mmHg, Heart Rate: 72 bpm.
Lab ordered: HbA1c panel.
""",
        "extraction": CanonicalMedicalExtraction(
            document_type="consultation",
            date="2023-05-15",
            patient_name="John Doe",
            hospital="City General Hospital",
            doctor="Dr. Robert Smith",
            diagnoses=[
                Diagnosis(
                    text="Type 2 Diabetes Mellitus",
                    normalized_text="Type 2 Diabetes Mellitus",
                    status="documented",
                    confidence="high",
                    evidence=EvidenceSchema(
                        document_id="doc_001",
                        filename="consultation_2023.pdf",
                        page_number=1,
                        source_text="Known case of Type 2 Diabetes Mellitus"
                    )
                )
            ],
            medications=[
                Medication(
                    name="Metformin",
                    normalized_name="Metformin",
                    dosage="500 mg",
                    frequency="twice daily",
                    route="oral",
                    status="active",
                    confidence="high",
                    evidence=EvidenceSchema(
                        document_id="doc_001",
                        filename="consultation_2023.pdf",
                        page_number=1,
                        source_text="Metformin 500 mg twice daily"
                    )
                )
            ],
            vitals=[
                Vital(
                    name="blood_pressure",
                    value="120/80",
                    unit="mmHg",
                    confidence="high",
                    evidence=EvidenceSchema(
                        document_id="doc_001",
                        filename="consultation_2023.pdf",
                        page_number=1,
                        source_text="Blood Pressure: 120/80 mmHg"
                    )
                )
            ]
        )
    },
    {
        "document_id": "doc_002",
        "filename": "lab_report_2023.pdf",
        "document_type": "lab_report",
        "date": "2023-05-18",
        "text": """METRO DIAGNOSTICS LAB - BLOOD REPORT
Collection Date: 2023-05-18
Patient: John Doe

TEST RESULTS:
HbA1c: 7.4 % (Reference Range: < 5.7 %) [ELEVATED]
Fasting Plasma Glucose: 145 mg/dL (Reference Range: 70-99 mg/dL) [ELEVATED]
""",
        "extraction": CanonicalMedicalExtraction(
            document_type="lab_report",
            date="2023-05-18",
            patient_name="John Doe",
            hospital="Metro Diagnostics Lab",
            lab_results=[
                LabResult(
                    test_name="HbA1c",
                    value="7.4",
                    unit="%",
                    reference_range="< 5.7 %",
                    status="elevated",
                    confidence="high",
                    evidence=EvidenceSchema(
                        document_id="doc_002",
                        filename="lab_report_2023.pdf",
                        page_number=1,
                        source_text="HbA1c: 7.4 %"
                    )
                ),
                LabResult(
                    test_name="Fasting Plasma Glucose",
                    value="145",
                    unit="mg/dL",
                    reference_range="70-99 mg/dL",
                    status="elevated",
                    confidence="high",
                    evidence=EvidenceSchema(
                        document_id="doc_002",
                        filename="lab_report_2023.pdf",
                        page_number=1,
                        source_text="Fasting Plasma Glucose: 145 mg/dL"
                    )
                )
            ]
        )
    },
    {
        "document_id": "doc_003",
        "filename": "prescription_2023.pdf",
        "document_type": "prescription",
        "date": "2023-05-20",
        "text": """PHARMA CARE PRESCRIPTION
Date: 2023-05-20
Rx: Metformin 500 mg
Sig: Take 1 tablet by mouth twice daily with meals.
Refills: 3
""",
        "extraction": CanonicalMedicalExtraction(
            document_type="prescription",
            date="2023-05-20",
            medications=[
                Medication(
                    name="Metformin",
                    normalized_name="Metformin",
                    dosage="500 mg",
                    frequency="twice daily",
                    route="oral",
                    status="active",
                    confidence="high",
                    evidence=EvidenceSchema(
                        document_id="doc_003",
                        filename="prescription_2023.pdf",
                        page_number=1,
                        source_text="Rx: Metformin 500 mg twice daily"
                    )
                )
            ]
        )
    },
    {
        "document_id": "doc_004",
        "filename": "diagnostic_report_2024.pdf",
        "document_type": "diagnostic_report",
        "date": "2024-02-10",
        "text": """ADVANCED IMAGING CENTER - CHEST X-RAY & ECG
Date: 2024-02-10
Patient: John Doe

Impression:
1. Chest X-Ray: Clear lungs, normal cardiac size.
2. ECG: Normal sinus rhythm, rate 70 bpm.
""",
        "extraction": CanonicalMedicalExtraction(
            document_type="diagnostic_report",
            date="2024-02-10",
            patient_name="John Doe",
            procedures=[
                Procedure(
                    name="Chest X-Ray",
                    date="2024-02-10",
                    confidence="high",
                    evidence=EvidenceSchema(
                        document_id="doc_004",
                        filename="diagnostic_report_2024.pdf",
                        page_number=1,
                        source_text="Chest X-Ray: Clear lungs"
                    )
                ),
                Procedure(
                    name="Electrocardiogram (ECG)",
                    date="2024-02-10",
                    confidence="high",
                    evidence=EvidenceSchema(
                        document_id="doc_004",
                        filename="diagnostic_report_2024.pdf",
                        page_number=1,
                        source_text="ECG: Normal sinus rhythm"
                    )
                )
            ]
        )
    },
    {
        "document_id": "doc_005",
        "filename": "admission_2025.pdf",
        "document_type": "admission",
        "date": "2025-08-01",
        "text": """EMERGENCY ADMISSION NOTE
Date: 2025-08-01
Patient: John Doe
Reason for Admission: Severe right lower quadrant abdominal pain, fever.
Home Medications: Metformin 850 mg (patient reported dosage).
Suspected Condition: Acute Appendicitis.
""",
        "extraction": CanonicalMedicalExtraction(
            document_type="admission",
            date="2025-08-01",
            patient_name="John Doe",
            hospital="City General Hospital",
            diagnoses=[
                Diagnosis(
                    text="Acute Appendicitis",
                    normalized_text="Acute Appendicitis",
                    status="suspected",
                    confidence="high",
                    evidence=EvidenceSchema(
                        document_id="doc_005",
                        filename="admission_2025.pdf",
                        page_number=1,
                        source_text="Suspected Condition: Acute Appendicitis"
                    )
                )
            ],
            medications=[
                Medication(
                    name="Metformin",
                    normalized_name="Metformin",
                    dosage="850 mg",
                    status="active",
                    confidence="high",
                    evidence=EvidenceSchema(
                        document_id="doc_005",
                        filename="admission_2025.pdf",
                        page_number=1,
                        source_text="Home Medications: Metformin 850 mg"
                    )
                )
            ]
        )
    },
    {
        "document_id": "doc_006",
        "filename": "discharge_summary_2025.pdf",
        "document_type": "discharge_summary",
        "date": "2025-08-05",
        "text": """HOSPITAL DISCHARGE SUMMARY
Discharge Date: 2025-08-05
Patient: John Doe
Final Diagnosis: Acute Appendicitis.
Procedure Performed: Laparoscopic Appendectomy on 2025-08-02.
Condition on Discharge: Stable, afebrile, wound healing well.
Follow-up: Visit surgical clinic in 2 weeks.
""",
        "extraction": CanonicalMedicalExtraction(
            document_type="discharge_summary",
            date="2025-08-05",
            patient_name="John Doe",
            hospital="City General Hospital",
            diagnoses=[
                Diagnosis(
                    text="Acute Appendicitis",
                    normalized_text="Acute Appendicitis",
                    status="documented",
                    confidence="high",
                    evidence=EvidenceSchema(
                        document_id="doc_006",
                        filename="discharge_summary_2025.pdf",
                        page_number=1,
                        source_text="Final Diagnosis: Acute Appendicitis"
                    )
                )
            ],
            procedures=[
                Procedure(
                    name="Laparoscopic Appendectomy",
                    date="2025-08-02",
                    confidence="high",
                    evidence=EvidenceSchema(
                        document_id="doc_006",
                        filename="discharge_summary_2025.pdf",
                        page_number=1,
                        source_text="Procedure Performed: Laparoscopic Appendectomy on 2025-08-02"
                    )
                )
            ],
            follow_up="Visit surgical clinic in 2 weeks"
        )
    },
    {
        "document_id": "doc_007",
        "filename": "followup_2026.pdf",
        "document_type": "follow_up",
        "date": None,  # Tests Scenario C (Missing Date)
        "text": """CLINIC FOLLOW-UP PROGRESS NOTE
Date: Unspecified / Undated Note
Patient: John Doe
Assessment: Patient recovering smoothly post appendectomy. Type 2 Diabetes stable.
No active acute complaints.
""",
        "extraction": CanonicalMedicalExtraction(
            document_type="follow_up",
            date=None,
            patient_name="John Doe",
            diagnoses=[
                Diagnosis(
                    text="Type 2 Diabetes Mellitus",
                    normalized_text="Type 2 Diabetes Mellitus",
                    status="documented",
                    confidence="high",
                    evidence=EvidenceSchema(
                        document_id="doc_007",
                        filename="followup_2026.pdf",
                        page_number=1,
                        source_text="Type 2 Diabetes stable"
                    )
                )
            ]
        )
    }
]
