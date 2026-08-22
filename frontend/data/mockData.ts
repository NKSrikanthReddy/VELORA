import {
  Patient,
  MedicalDocument,
  TimelineEvent,
  Diagnosis,
  Medication,
  LabResult,
  MedicalBriefing,
  DoctorAccess,
  ChatMessage,
  User,
  Evidence,
} from "@/types/medical";

export const mockUsers: Record<string, User> = {
  patient: {
    id: "user-patient-001",
    name: "Rahul Sharma",
    email: "rahul.sharma@example.com",
    role: "patient",
  },
  doctor: {
    id: "user-doc-001",
    name: "Dr. Anil Kumar, MD",
    email: "dr.anil@cityhealth.org",
    role: "doctor",
    specialty: "Internal Medicine & Endocrinology",
    licenseNumber: "MCI-482910",
  },
};

export const mockPatient: Patient = {
  id: "patient-001",
  name: "Rahul Sharma",
  age: 42,
  gender: "Male",
  dateOfBirth: "1984-05-14",
  bloodGroup: "B+",
  phone: "+91 98765 43210",
  emergencyContact: "Priya Sharma (Spouse) - +91 98765 43211",
  documentCount: 12,
  medicalEventCount: 27,
  lastUpdated: "2026-08-22",
};

export const mockDocuments: MedicalDocument[] = [
  {
    id: "doc-001",
    name: "Blood_Report_2025.pdf",
    type: "Blood / Lab Report",
    uploadDate: "2025-06-12",
    status: "completed",
    pageCount: 3,
    fileSize: "1.8 MB",
    extractedEntitiesCount: 14,
  },
  {
    id: "doc-002",
    name: "Prescription_2025.jpg",
    type: "Prescription",
    uploadDate: "2025-06-14",
    status: "completed",
    pageCount: 1,
    fileSize: "840 KB",
    extractedEntitiesCount: 6,
  },
  {
    id: "doc-003",
    name: "Discharge_Summary_2025.pdf",
    type: "Discharge Summary",
    uploadDate: "2025-07-20",
    status: "completed",
    pageCount: 4,
    fileSize: "2.4 MB",
    extractedEntitiesCount: 22,
  },
  {
    id: "doc-004",
    name: "Followup_Consultation_2026.pdf",
    type: "Consultation Record",
    uploadDate: "2026-01-18",
    status: "completed",
    pageCount: 2,
    fileSize: "1.2 MB",
    extractedEntitiesCount: 8,
  },
  {
    id: "doc-005",
    name: "Hypertension_Assessment_2024.pdf",
    type: "Consultation Record",
    uploadDate: "2024-04-10",
    status: "completed",
    pageCount: 2,
    fileSize: "950 KB",
    extractedEntitiesCount: 9,
  },
  {
    id: "doc-006",
    name: "Blood_Test_Panel_2023.pdf",
    type: "Blood / Lab Report",
    uploadDate: "2023-03-15",
    status: "completed",
    pageCount: 2,
    fileSize: "1.4 MB",
    extractedEntitiesCount: 11,
  },
  {
    id: "doc-007",
    name: "Initial_Consultation_2022.pdf",
    type: "Consultation Record",
    uploadDate: "2022-09-05",
    status: "completed",
    pageCount: 1,
    fileSize: "720 KB",
    extractedEntitiesCount: 5,
  },
  {
    id: "doc-008",
    name: "Historical_Prescription_Archive.pdf",
    type: "Prescription",
    uploadDate: "2026-08-20",
    status: "completed",
    pageCount: 1,
    fileSize: "510 KB",
    extractedEntitiesCount: 3,
  },
  {
    id: "doc-009",
    name: "Recent_Lipid_Profile.pdf",
    type: "Lab Report",
    uploadDate: "2026-08-22",
    status: "processing",
    pageCount: 2,
    fileSize: "1.1 MB",
    extractedEntitiesCount: 0,
  },
];

export const mockDiagnoses: Diagnosis[] = [
  {
    id: "diag-001",
    name: "Type 2 Diabetes Mellitus",
    status: "confirmed",
    firstDocumentedDate: "2022-09-05",
    description: "Consistently recorded across consultation notes, lab tests, and prescriptions since 2022.",
    evidence: [
      {
        id: "ev-diag-1",
        documentId: "doc-007",
        documentName: "Initial_Consultation_2022.pdf",
        page: 1,
        relevantText: "Assessment: Newly diagnosed Type 2 Diabetes Mellitus. Patient presents with polyuria and fatigue.",
        confidence: 0.96,
      },
      {
        id: "ev-diag-2",
        documentId: "doc-001",
        documentName: "Blood_Report_2025.pdf",
        page: 2,
        relevantText: "Clinical Indication: Known Type 2 Diabetes Mellitus on oral hypoglycemic agents.",
        confidence: 0.94,
      },
    ],
  },
  {
    id: "diag-002",
    name: "Essential Hypertension",
    status: "confirmed",
    firstDocumentedDate: "2024-04-10",
    description: "Documented during regular follow-up with blood pressure readings consistently > 140/90 mmHg.",
    evidence: [
      {
        id: "ev-diag-3",
        documentId: "doc-005",
        documentName: "Hypertension_Assessment_2024.pdf",
        page: 1,
        relevantText: "Diagnosis: Stage 1 Essential Hypertension. Resting BP: 148/92 mmHg. Initiating Telmisartan 40mg.",
        confidence: 0.95,
      },
      {
        id: "ev-diag-4",
        documentId: "doc-003",
        documentName: "Discharge_Summary_2025.pdf",
        page: 1,
        relevantText: "Secondary Diagnosis: Essential Hypertension. Controlled on current antihypertensive regimen.",
        confidence: 0.92,
      },
    ],
  },
];

export const mockMedications: Medication[] = [
  {
    id: "med-001",
    name: "Metformin",
    dosage: "500 mg / 1000 mg (Discrepancy)",
    frequency: "Twice daily after meals",
    status: "uncertain",
    hasConflict: true,
    conflictDescription:
      "One document specifies Metformin 500 mg (Prescription_2025.jpg), whereas the hospital Discharge Summary (Discharge_Summary_2025.pdf) lists Metformin 1000 mg twice daily. Please verify against original clinical records.",
    evidence: [
      {
        id: "ev-med-1",
        documentId: "doc-002",
        documentName: "Prescription_2025.jpg",
        page: 1,
        relevantText: "Rx: Tab Metformin 500 mg PO BID with meals x 3 months.",
        confidence: 0.93,
      },
      {
        id: "ev-med-2",
        documentId: "doc-003",
        documentName: "Discharge_Summary_2025.pdf",
        page: 3,
        relevantText: "Discharge Medications: 1. Tab Metformin 1000 mg orally BD after meals.",
        confidence: 0.91,
      },
    ],
  },
  {
    id: "med-002",
    name: "Telmisartan",
    dosage: "40 mg",
    frequency: "Once daily in the morning",
    status: "active",
    hasConflict: false,
    evidence: [
      {
        id: "ev-med-3",
        documentId: "doc-005",
        documentName: "Hypertension_Assessment_2024.pdf",
        page: 2,
        relevantText: "Prescription: Tab Telmisartan 40 mg OD morning.",
        confidence: 0.96,
      },
      {
        id: "ev-med-4",
        documentId: "doc-004",
        documentName: "Followup_Consultation_2026.pdf",
        page: 1,
        relevantText: "Continue Tab Telmisartan 40 mg once daily. BP well controlled at 126/82 mmHg.",
        confidence: 0.95,
      },
    ],
  },
  {
    id: "med-003",
    name: "Atorvastatin",
    dosage: "10 mg",
    frequency: "Once daily at bedtime",
    status: "active",
    hasConflict: false,
    evidence: [
      {
        id: "ev-med-5",
        documentId: "doc-003",
        documentName: "Discharge_Summary_2025.pdf",
        page: 3,
        relevantText: "Discharge Medications: 3. Tab Atorvastatin 10 mg HS.",
        confidence: 0.92,
      },
    ],
  },
];

export const mockLabResults: LabResult[] = [
  {
    id: "lab-001",
    testName: "HbA1c (Glycated Hemoglobin)",
    value: "7.4",
    unit: "%",
    referenceRange: "< 5.7% (Normal), > 6.5% (Diabetes)",
    date: "2025-06-12",
    status: "high",
    evidence: [
      {
        id: "ev-lab-1",
        documentId: "doc-001",
        documentName: "Blood_Report_2025.pdf",
        page: 2,
        relevantText: "Hemoglobin A1c (HbA1c): 7.4 % [Reference: Non-diabetic < 5.7, Target for Diabetics < 7.0].",
        confidence: 0.98,
      },
    ],
  },
  {
    id: "lab-002",
    testName: "HbA1c (Glycated Hemoglobin - Prior)",
    value: "7.2",
    unit: "%",
    referenceRange: "< 5.7%",
    date: "2023-03-15",
    status: "high",
    evidence: [
      {
        id: "ev-lab-2",
        documentId: "doc-006",
        documentName: "Blood_Test_Panel_2023.pdf",
        page: 1,
        relevantText: "HbA1c Level: 7.2% [High]. Fasting glucose correlation advised.",
        confidence: 0.97,
      },
    ],
  },
  {
    id: "lab-003",
    testName: "Fasting Blood Glucose",
    value: "142",
    unit: "mg/dL",
    referenceRange: "70 - 99 mg/dL",
    date: "2025-06-12",
    status: "high",
    evidence: [
      {
        id: "ev-lab-3",
        documentId: "doc-001",
        documentName: "Blood_Report_2025.pdf",
        page: 1,
        relevantText: "Glucose, Fasting (Plasma): 142.0 mg/dL [Reference: 70.0 - 99.0].",
        confidence: 0.97,
      },
    ],
  },
  {
    id: "lab-004",
    testName: "Serum Creatinine",
    value: "0.9",
    unit: "mg/dL",
    referenceRange: "0.7 - 1.3 mg/dL",
    date: "2025-06-12",
    status: "normal",
    evidence: [
      {
        id: "ev-lab-4",
        documentId: "doc-001",
        documentName: "Blood_Report_2025.pdf",
        page: 3,
        relevantText: "Serum Creatinine: 0.9 mg/dL (Normal renal function).",
        confidence: 0.95,
      },
    ],
  },
  {
    id: "lab-005",
    testName: "Total Cholesterol",
    value: "195",
    unit: "mg/dL",
    referenceRange: "< 200 mg/dL",
    date: "2025-06-12",
    status: "normal",
    evidence: [
      {
        id: "ev-lab-5",
        documentId: "doc-001",
        documentName: "Blood_Report_2025.pdf",
        page: 2,
        relevantText: "Lipid Profile - Total Cholesterol: 195 mg/dL [Desirable < 200 mg/dL].",
        confidence: 0.94,
      },
    ],
  },
];

export const mockTimelineEvents: TimelineEvent[] = [
  {
    id: "evt-008",
    date: "2026-01-18",
    eventType: "Follow-up Consultation",
    title: "Glycemic and Cardiovascular Follow-up",
    description:
      "Outpatient visit to review glycemic control and blood pressure. Patient reported feeling well without hypoglycemic episodes. BP recorded at 126/82 mmHg.",
    confidence: 0.96,
    facility: "City Health Specialty Clinic",
    clinician: "Dr. Anil Kumar",
    evidence: [
      {
        id: "ev-evt-8",
        documentId: "doc-004",
        documentName: "Followup_Consultation_2026.pdf",
        page: 1,
        relevantText: "Routine follow-up for T2DM and HTN. Patient adherence noted. Advised annual microalbuminuria check.",
        confidence: 0.96,
      },
    ],
  },
  {
    id: "evt-007",
    date: "2025-07-20",
    eventType: "Discharge Summary",
    title: "Inpatient Hospital Discharge Summary",
    description:
      "Discharged following 3-day admission for acute gastroenteritis with mild glycemic excursion. Rehydrated, glycemic parameters stabilized, discharged in satisfactory condition.",
    confidence: 0.95,
    facility: "Metro General Hospital",
    clinician: "Dr. R. K. Verma",
    evidence: [
      {
        id: "ev-evt-7",
        documentId: "doc-003",
        documentName: "Discharge_Summary_2025.pdf",
        page: 1,
        relevantText: "Discharge summary: Rahul Sharma, 42/M. Admitted 17-Jul-2025, Discharged 20-Jul-2025. Stable at discharge.",
        confidence: 0.95,
      },
    ],
  },
  {
    id: "evt-006",
    date: "2025-07-17",
    eventType: "Hospital Admission",
    title: "Emergency Department Inpatient Admission",
    description:
      "Admitted via ER for acute dehydration, nausea, and elevated capillary blood glucose following viral gastroenteritis.",
    confidence: 0.94,
    facility: "Metro General Hospital",
    clinician: "Emergency Care Unit",
    evidence: [
      {
        id: "ev-evt-6",
        documentId: "doc-003",
        documentName: "Discharge_Summary_2025.pdf",
        page: 2,
        relevantText: "Course in Hospital: Admitted with dehydration and transient hyperglycemia. IV fluids and electrolyte replacement administered.",
        confidence: 0.94,
      },
    ],
  },
  {
    id: "evt-005",
    date: "2025-06-12",
    eventType: "Blood Test",
    title: "Comprehensive Metabolic & Lipid Panel",
    description: "HbA1c recorded at 7.4%, Fasting Blood Glucose at 142 mg/dL, Total Cholesterol at 195 mg/dL.",
    confidence: 0.98,
    facility: "Apex Diagnostic Laboratories",
    evidence: [
      {
        id: "ev-evt-5",
        documentId: "doc-001",
        documentName: "Blood_Report_2025.pdf",
        page: 1,
        relevantText: "Laboratory Test Report - Comprehensive Metabolic Profile: HbA1c 7.4%, Fasting Plasma Glucose 142 mg/dL.",
        confidence: 0.98,
      },
    ],
  },
  {
    id: "evt-004",
    date: "2024-04-10",
    eventType: "Follow-up Consultation",
    title: "Hypertension Documented & Medication Initiated",
    description:
      "Patient evaluated for persistent elevated blood pressure (148/92 mmHg). Essential hypertension diagnosed; commenced on Telmisartan 40 mg daily.",
    confidence: 0.95,
    facility: "City Health Clinic",
    clinician: "Dr. S. Mehta",
    evidence: [
      {
        id: "ev-evt-4",
        documentId: "doc-005",
        documentName: "Hypertension_Assessment_2024.pdf",
        page: 1,
        relevantText: "Diagnosis: Stage 1 Essential Hypertension. Resting BP: 148/92 mmHg. Initiating Telmisartan 40mg.",
        confidence: 0.95,
      },
    ],
  },
  {
    id: "evt-003",
    date: "2023-03-15",
    eventType: "Prescription",
    title: "Metformin 500 mg Documented",
    description: "Oral antidiabetic prescription continuation with Metformin 500 mg twice daily with meals.",
    confidence: 0.93,
    facility: "City Health Clinic",
    clinician: "Dr. S. Mehta",
    evidence: [
      {
        id: "ev-evt-3",
        documentId: "doc-002",
        documentName: "Prescription_2025.jpg",
        page: 1,
        relevantText: "Rx: Tab Metformin 500 mg PO BID with meals.",
        confidence: 0.93,
      },
    ],
  },
  {
    id: "evt-002",
    date: "2023-03-15",
    eventType: "Blood Test",
    title: "Glycated Hemoglobin (HbA1c) Test",
    description: "HbA1c recorded at 7.2%, indicating suboptimal glycemic control on initial monotherapy.",
    confidence: 0.97,
    facility: "Apex Diagnostic Laboratories",
    evidence: [
      {
        id: "ev-evt-2",
        documentId: "doc-006",
        documentName: "Blood_Test_Panel_2023.pdf",
        page: 1,
        relevantText: "HbA1c Level: 7.2% [High]. Fasting glucose correlation advised.",
        confidence: 0.97,
      },
    ],
  },
  {
    id: "evt-001",
    date: "2022-09-05",
    eventType: "Consultation",
    title: "Initial Diagnosis of Type 2 Diabetes",
    description:
      "Patient presented with classic symptoms of polyuria and polydipsia. Evaluated and confirmed with Type 2 Diabetes Mellitus.",
    confidence: 0.96,
    facility: "Primary Care Wellness Center",
    clinician: "Dr. A. Singhal",
    evidence: [
      {
        id: "ev-evt-1",
        documentId: "doc-007",
        documentName: "Initial_Consultation_2022.pdf",
        page: 1,
        relevantText: "Assessment: Newly diagnosed Type 2 Diabetes Mellitus. Patient presents with polyuria and fatigue.",
        confidence: 0.96,
      },
    ],
  },
  {
    id: "evt-000-unknown",
    date: null,
    eventType: "Historical Prescription",
    title: "Archived Undated Prescription Record",
    description:
      "Undated handwritten prescription slip listing early anti-diabetic guidance and lifestyle counseling. Exact date could not be established from image metadata or header text.",
    confidence: 0.72,
    facility: "Undocumented Clinic",
    evidence: [
      {
        id: "ev-evt-0",
        documentId: "doc-008",
        documentName: "Historical_Prescription_Archive.pdf",
        page: 1,
        relevantText: "Rx: Dietary modifications, low glycemic intake. Metformin regimen noted without stamped date.",
        confidence: 0.72,
      },
    ],
  },
];

export const mockBriefing: MedicalBriefing = {
  patientOverview:
    "42-year-old male with a documented 4-year history of Type 2 Diabetes Mellitus (first diagnosed in 2022) and Essential Hypertension (documented in 2024) based on available consolidated records.",
  majorDiagnoses: mockDiagnoses,
  medications: mockMedications,
  importantLabResults: mockLabResults,
  recentEvents: mockTimelineEvents.slice(0, 4),
  importantPoints: [
    "Type 2 Diabetes appears consistently documented across multiple records spanning 2022 to 2026.",
    "Serial HbA1c values are documented across multiple periods: 7.2% in March 2023 and 7.4% in June 2025.",
    "A 3-day hospital admission is documented in July 2025 at Metro General Hospital with a complete discharge summary.",
    "Blood pressure management was initiated in April 2024 with Telmisartan 40 mg, with recent readings indicating good control (126/82 mmHg in Jan 2026).",
  ],
  uncertainInformation: [
    "Medication dosage conflict: One prescription record documents Metformin 500 mg twice daily, whereas the 2025 hospital discharge summary lists Metformin 1000 mg twice daily.",
    "Allergy information was not found in any of the uploaded or available medical records.",
    "Exact date for one archived prescription record is unknown and could not be determined.",
  ],
};

export const mockDoctorAccess: DoctorAccess[] = [
  {
    id: "acc-001",
    doctorName: "Dr. Anil Kumar, MD",
    accessCode: "MED-7K29X",
    grantedAt: "2026-08-01",
    expiresAt: "2026-08-30",
    active: true,
    hospital: "City Health Specialty Clinic",
    specialty: "Internal Medicine",
  },
];

export const mockChatAnswers: {
  matchQueries: string[];
  response: string;
  evidence?: Evidence[];
  warning?: string;
  isConflict?: boolean;
  isOutOfScope?: boolean;
}[] = [
  {
    matchQueries: ["medication", "medicines", "drugs", "what medications", "prescriptions"],
    response:
      "Based on the available records, the patient has documented prescriptions for:\n• Metformin (dosage discrepancy noted between records)\n• Telmisartan 40 mg once daily (for Hypertension)\n• Atorvastatin 10 mg at bedtime (listed on Discharge Summary 2025)",
    evidence: [
      {
        id: "ev-chat-med-1",
        documentId: "doc-002",
        documentName: "Prescription_2025.jpg",
        page: 1,
        relevantText: "Rx: Tab Metformin 500 mg PO BID with meals x 3 months.",
      },
      {
        id: "ev-chat-med-2",
        documentId: "doc-003",
        documentName: "Discharge_Summary_2025.pdf",
        page: 3,
        relevantText: "Discharge Medications: 1. Tab Metformin 1000 mg BD, 2. Tab Telmisartan 40mg OD, 3. Tab Atorvastatin 10mg HS.",
      },
    ],
    warning:
      "⚠ Conflicting information found. One document lists Metformin 500 mg, while another lists Metformin 1000 mg. Please verify against original clinical records.",
    isConflict: true,
  },
  {
    matchQueries: ["hba1c", "latest hba1c", "blood sugar test", "glycated hemoglobin"],
    response:
      "The most recent HbA1c found in the available records was 7.4%, documented on 12 June 2025 (Apex Diagnostic Laboratories). A previous HbA1c from 15 March 2023 was documented at 7.2%.",
    evidence: [
      {
        id: "ev-chat-lab-1",
        documentId: "doc-001",
        documentName: "Blood_Report_2025.pdf",
        page: 2,
        relevantText: "Hemoglobin A1c (HbA1c): 7.4 % [Reference: Non-diabetic < 5.7, Target for Diabetics < 7.0].",
      },
    ],
  },
  {
    matchQueries: ["diagnoses", "diagnosis", "conditions", "what diagnoses"],
    response:
      "According to available clinical records, the following major diagnoses are documented:\n1. Type 2 Diabetes Mellitus (First documented: 5 Sep 2022)\n2. Essential Hypertension (First documented: 10 Apr 2024)",
    evidence: [
      {
        id: "ev-chat-diag-1",
        documentId: "doc-007",
        documentName: "Initial_Consultation_2022.pdf",
        page: 1,
        relevantText: "Assessment: Newly diagnosed Type 2 Diabetes Mellitus.",
      },
      {
        id: "ev-chat-diag-2",
        documentId: "doc-005",
        documentName: "Hypertension_Assessment_2024.pdf",
        page: 1,
        relevantText: "Diagnosis: Stage 1 Essential Hypertension. Resting BP: 148/92 mmHg.",
      },
    ],
  },
  {
    matchQueries: ["hospitalized", "hospital admission", "admitted", "hospital"],
    response:
      "The records indicate a 3-day hospital admission from 17 July 2025 to 20 July 2025 at Metro General Hospital for acute gastroenteritis associated with dehydration and transient glycemic elevation. The patient was discharged in stable condition.",
    evidence: [
      {
        id: "ev-chat-hosp-1",
        documentId: "doc-003",
        documentName: "Discharge_Summary_2025.pdf",
        page: 1,
        relevantText: "Discharge summary: Rahul Sharma. Admitted 17-Jul-2025, Discharged 20-Jul-2025. Diagnosis: Acute Gastroenteritis with mild glycemic excursion.",
      },
    ],
  },
  {
    matchQueries: ["allergy", "allergies", "allergic"],
    response:
      "I could not find any allergy information in the patient's available medical records. Please confirm with the patient directly.",
  },
  {
    matchQueries: [
      "should i change",
      "prescribe",
      "treat",
      "treatment recommendation",
      "diagnose",
      "cure",
      "what dosage should i give",
    ],
    response:
      "This system is designed to organize and retrieve information from the patient's available medical records. It does not provide medical diagnoses, treatment recommendations, or medication adjustments.",
    isOutOfScope: true,
  },
];
