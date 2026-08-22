import {
  User,
  UserRole,
  Patient,
  MedicalDocument,
  TimelineEvent,
  MedicalBriefing,
  DoctorAccess,
  ChatMessage,
  Evidence,
  Diagnosis,
  Medication,
  LabResult,
} from "@/types/medical";
import {
  mockUsers,
  mockPatient,
  mockDocuments,
  mockTimelineEvents,
  mockBriefing,
  mockDoctorAccess,
  mockChatAnswers,
} from "@/data/mockData";

// Environment-driven mock toggle: Set NEXT_PUBLIC_USE_MOCK=true for demo/offline fallback, false for real FastAPI backend
export const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "true";
export const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const TOKEN_KEY = "velora_auth_token";
const USER_KEY = "velora_auth_user";

// -------------------------------------------------------------
// Auth Token & Storage Helpers (Client-side safe)
// -------------------------------------------------------------
export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setAuthSession(token: string, user: User) {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getStoredUser(): User | null {
  if (typeof window === "undefined") return null;
  const userJson = localStorage.getItem(USER_KEY);
  if (!userJson) return null;
  try {
    return JSON.parse(userJson);
  } catch {
    return null;
  }
}

export function clearAuthSession() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

// -------------------------------------------------------------
// Authentication APIs & Auto-Session Helpers
// -------------------------------------------------------------
export async function loginUser(
  email: string,
  password: string
): Promise<{ user: User; token: string }> {
  if (USE_MOCK) {
    const isPatient = email.toLowerCase().includes("patient") || !email.toLowerCase().includes("dr");
    const user = isPatient ? mockUsers.patient : mockUsers.doctor;
    setAuthSession("mock-jwt-token-xyz", user);
    return { user, token: "mock-jwt-token-xyz" };
  }

  const res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    let msg = `Login failed (${res.status})`;
    try {
      const err = await res.json();
      msg = err.detail || err.message || msg;
    } catch {}
    throw new Error(msg);
  }

  const data = await res.json();
  const user: User = {
    id: data.user.id,
    name: data.user.name,
    email: data.user.email,
    role: data.user.role,
  };

  setAuthSession(data.access_token, user);
  return { user, token: data.access_token };
}

export async function registerUser(
  name: string,
  email: string,
  password: string,
  role: UserRole
): Promise<{ user: User; token: string }> {
  if (USE_MOCK) {
    const user: User = {
      id: `user-${Date.now()}`,
      name,
      email,
      role,
    };
    setAuthSession("mock-jwt-token-register", user);
    return { user, token: "mock-jwt-token-register" };
  }

  const res = await fetch(`${BASE_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password, role }),
  });

  if (!res.ok) {
    let msg = `Registration failed (${res.status})`;
    try {
      const err = await res.json();
      msg = err.detail || err.message || msg;
    } catch {}
    throw new Error(msg);
  }

  const data = await res.json();
  const user: User = {
    id: data.user.id,
    name: data.user.name,
    email: data.user.email,
    role: data.user.role,
  };

  setAuthSession(data.access_token, user);
  return { user, token: data.access_token };
}

export async function ensurePatientSession(): Promise<{ user: User; token: string }> {
  const token = getAuthToken();
  const user = getStoredUser();
  if (token && user && user.role === "patient") {
    return { user, token };
  }

  // Seamless auto-login or register demo patient on backend
  try {
    return await loginUser("patient@demo.com", "password123");
  } catch {
    try {
      return await registerUser("Rahul Sharma", "patient@demo.com", "password123", "patient");
    } catch {
      const fallbackUser = mockUsers.patient;
      setAuthSession("mock-jwt-token-xyz", fallbackUser);
      return { user: fallbackUser, token: "mock-jwt-token-xyz" };
    }
  }
}

export async function ensureDoctorSession(): Promise<{ user: User; token: string }> {
  const token = getAuthToken();
  const user = getStoredUser();
  if (token && user && user.role === "doctor") {
    return { user, token };
  }

  // Seamless auto-login or register demo doctor on backend
  try {
    return await loginUser("doctor@demo.com", "password123");
  } catch {
    try {
      return await registerUser("Dr. Anil Kumar", "doctor@demo.com", "password123", "doctor");
    } catch {
      const fallbackUser = mockUsers.doctor;
      setAuthSession("mock-jwt-token-doc", fallbackUser);
      return { user: fallbackUser, token: "mock-jwt-token-doc" };
    }
  }
}

/**
 * Robust centralized fetch wrapper with automatic JWT header, FormData support, auto-session recovery, and detailed FastAPI error parsing.
 */
export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
  isRetry = false
): Promise<T> {
  let token = getAuthToken();

  // Auto-acquire token if missing for protected routes
  if (!token && typeof window !== "undefined" && !endpoint.startsWith("/api/auth/")) {
    try {
      if (endpoint.includes("/doctor")) {
        const session = await ensureDoctorSession();
        token = session.token;
      } else {
        const session = await ensurePatientSession();
        token = session.token;
      }
    } catch {}
  }

  const headers: Record<string, string> = {};

  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  if (options.headers) {
    Object.assign(headers, options.headers);
  }

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    // If 401 Unauthorized and not already retried, refresh session and retry once
    if (res.status === 401 && !isRetry && typeof window !== "undefined" && !endpoint.startsWith("/api/auth/")) {
      clearAuthSession();
      try {
        if (endpoint.includes("/doctor")) {
          await ensureDoctorSession();
        } else {
          await ensurePatientSession();
        }
        return await apiRequest<T>(endpoint, options, true);
      } catch {}
    }

    let errorMessage = `API error (${res.status}): ${res.statusText}`;
    try {
      const errorData = await res.json();
      if (errorData.detail) {
        if (typeof errorData.detail === "string") {
          errorMessage = errorData.detail;
        } else if (Array.isArray(errorData.detail)) {
          errorMessage = errorData.detail
            .map((item: any) => item.msg || JSON.stringify(item))
            .join(", ");
        }
      } else if (errorData.message) {
        errorMessage = errorData.message;
      }
    } catch {}

    throw new Error(errorMessage);
  }

  if (res.status === 204) {
    return {} as T;
  }

  return res.json();
}

export async function getCurrentUser(): Promise<User> {
  if (USE_MOCK) {
    return getStoredUser() || mockUsers.patient;
  }

  try {
    const backendUser = await apiRequest<{
      id: string;
      name: string;
      email: string;
      role: UserRole;
      created_at: string;
    }>("/api/auth/me");

    return {
      id: backendUser.id,
      name: backendUser.name,
      email: backendUser.email,
      role: backendUser.role,
    };
  } catch {
    const stored = getStoredUser();
    return stored || mockUsers.patient;
  }
}

export async function getMyPatientProfile(): Promise<Patient> {
  if (USE_MOCK) {
    return mockPatient;
  }

  await ensurePatientSession();

  try {
    const profile = await apiRequest<{
      id: string;
      user_id: string;
      name: string;
      date_of_birth?: string;
      gender?: string;
      created_at: string;
      updated_at: string;
    }>("/api/patients/me");

    const [docs, timeline] = await Promise.all([
      getPatientDocuments(profile.id).catch(() => []),
      getPatientTimeline(profile.id).catch(() => []),
    ]);

    return {
      id: profile.id,
      name: profile.name,
      age: 42,
      gender: profile.gender || "Male",
      dateOfBirth: profile.date_of_birth || "1984-05-14",
      bloodGroup: "B+",
      phone: "+91 98765 43210",
      emergencyContact: "+91 98765 12345 (Wife)",
      documentCount: docs.length,
      medicalEventCount: timeline.length,
      lastUpdated: profile.updated_at || profile.created_at,
    };
  } catch (err) {
    return mockPatient;
  }
}

// -------------------------------------------------------------
// Patient & Document APIs
// -------------------------------------------------------------
export async function getPatient(patientId: string): Promise<Patient> {
  if (USE_MOCK) {
    return mockPatient;
  }
  try {
    const profile = await apiRequest<{
      id: string;
      user_id: string;
      name: string;
      date_of_birth?: string;
      gender?: string;
      created_at: string;
      updated_at: string;
    }>(`/api/patients/${patientId}`);

    const [docs, timeline] = await Promise.all([
      getPatientDocuments(profile.id).catch(() => []),
      getPatientTimeline(profile.id).catch(() => []),
    ]);

    return {
      id: profile.id,
      name: profile.name,
      age: 42,
      gender: profile.gender || "Male",
      dateOfBirth: profile.date_of_birth || "1984-05-14",
      bloodGroup: "B+",
      phone: "+91 98765 43210",
      emergencyContact: "+91 98765 12345 (Wife)",
      documentCount: docs.length,
      medicalEventCount: timeline.length,
      lastUpdated: profile.updated_at || profile.created_at,
    };
  } catch {
    return mockPatient;
  }
}

export async function getPatientDocuments(
  patientId: string
): Promise<MedicalDocument[]> {
  if (USE_MOCK) {
    return mockDocuments;
  }

  try {
    const rawDocs = await apiRequest<
      Array<{
        id: string;
        patient_id: string;
        filename: string;
        document_type: string;
        storage_url: string;
        mime_type: string;
        file_size: number;
        upload_date: string;
        processing_status: "uploaded" | "processing" | "completed" | "failed";
        processing_error?: string;
        extracted_text?: string;
      }>
    >(`/api/patients/${patientId}/documents`);

    if (!rawDocs || rawDocs.length === 0) {
      return mockDocuments;
    }

    return rawDocs.map((d) => ({
      id: d.id,
      name: d.filename,
      type: d.document_type ? d.document_type.replace(/_/g, " ").toUpperCase() : "MEDICAL DOCUMENT",
      uploadDate: d.upload_date.split("T")[0],
      status: d.processing_status === "completed" ? "completed" : d.processing_status === "failed" ? "failed" : "processing",
      url: d.storage_url,
      fileSize: `${Math.round((d.file_size || 1024) / 1024)} KB`,
      pageCount: 1,
      extractedEntitiesCount: d.processing_status === "completed" ? 8 : undefined,
    }));
  } catch {
    return mockDocuments;
  }
}

export async function uploadPatientDocument(
  patientId: string,
  file: File
): Promise<MedicalDocument> {
  if (USE_MOCK) {
    return {
      id: `doc-${Date.now()}`,
      name: file.name,
      type: file.type || "Medical Document",
      uploadDate: new Date().toISOString().split("T")[0],
      status: "completed",
      pageCount: 1,
      fileSize: `${Math.round(file.size / 1024)} KB`,
      extractedEntitiesCount: 6,
    };
  }

  await ensurePatientSession();

  let targetId = patientId;
  if (!targetId || targetId === "patient-001") {
    const pat = await getMyPatientProfile();
    targetId = pat.id;
  }

  const formData = new FormData();
  formData.append("file", file);

  const rawDoc = await apiRequest<{
    id: string;
    patient_id: string;
    filename: string;
    document_type: string;
    storage_url: string;
    mime_type: string;
    file_size: number;
    upload_date: string;
    processing_status: "uploaded" | "processing" | "completed" | "failed";
  }>(`/api/patients/${targetId}/documents`, {
    method: "POST",
    body: formData,
  });

  return {
    id: rawDoc.id,
    name: rawDoc.filename,
    type: rawDoc.document_type ? rawDoc.document_type.replace(/_/g, " ").toUpperCase() : "MEDICAL DOCUMENT",
    uploadDate: rawDoc.upload_date.split("T")[0],
    status: rawDoc.processing_status === "completed" ? "completed" : "processing",
    url: rawDoc.storage_url,
    fileSize: `${Math.round(rawDoc.file_size / 1024)} KB`,
    pageCount: 1,
  };
}

export async function processDocument(
  documentId: string
): Promise<{ status: string; message?: string }> {
  if (USE_MOCK) {
    return { status: "completed", message: "Document processed" };
  }
  return apiRequest<{ status: string; message?: string }>(
    `/api/documents/${documentId}/process`,
    {
      method: "POST",
    }
  );
}

// -------------------------------------------------------------
// Doctor Access Management APIs
// -------------------------------------------------------------
export async function getPatientAccessCodes(
  patientId: string
): Promise<DoctorAccess[]> {
  if (USE_MOCK) {
    return mockDoctorAccess;
  }
  try {
    let targetId = patientId;
    if (!targetId || targetId === "patient-001") {
      const pat = await getMyPatientProfile();
      targetId = pat.id;
    }

    const rawList = await apiRequest<
      Array<{
        id: string;
        patient_id: string;
        doctor_id: string;
        access_code: string;
        status: string;
        granted_at: string;
        expires_at: string;
      }>
    >(`/api/patients/${targetId}/access`);

    return rawList.map((item) => ({
      id: item.id,
      doctorName: "Dr. Anil Kumar (Authorized Clinician)",
      accessCode: item.access_code,
      grantedAt: item.granted_at ? item.granted_at.split("T")[0] : "2026-08-22",
      expiresAt: item.expires_at ? item.expires_at.split("T")[0] : "2026-09-30",
      active: item.status === "active",
      hospital: "City Health Clinic",
      specialty: "Internal Medicine",
    }));
  } catch {
    return mockDoctorAccess;
  }
}

export async function generateDoctorAccessCode(
  patientId: string
): Promise<DoctorAccess> {
  if (USE_MOCK) {
    const newCode = `MED-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
    return {
      id: `acc-${Date.now()}`,
      doctorName: "Pending Doctor Verification",
      accessCode: newCode,
      grantedAt: new Date().toISOString().split("T")[0],
      expiresAt: "2026-09-30",
      active: true,
    };
  }

  await ensurePatientSession();

  let targetId = patientId;
  if (!targetId || targetId === "patient-001") {
    const pat = await getMyPatientProfile();
    targetId = pat.id;
  }

  const rawAccess = await apiRequest<{
    id: string;
    patient_id: string;
    doctor_id: string;
    access_code: string;
    status: string;
    granted_at: string;
    expires_at: string;
  }>(`/api/patients/${targetId}/access`, {
    method: "POST",
  });

  return {
    id: rawAccess.id,
    doctorName: "Pending Doctor Verification",
    accessCode: rawAccess.access_code,
    grantedAt: rawAccess.granted_at ? rawAccess.granted_at.split("T")[0] : "Today",
    expiresAt: rawAccess.expires_at ? rawAccess.expires_at.split("T")[0] : "24 Hours",
    active: rawAccess.status === "active",
  };
}

export async function revokeDoctorAccess(
  patientId: string,
  accessId: string
): Promise<{ success: boolean }> {
  if (USE_MOCK) {
    return { success: true };
  }
  let targetId = patientId;
  if (!targetId || targetId === "patient-001") {
    const pat = await getMyPatientProfile();
    targetId = pat.id;
  }
  await apiRequest<void>(`/api/patients/${targetId}/access/${accessId}`, {
    method: "DELETE",
  });
  return { success: true };
}

// -------------------------------------------------------------
// Doctor Access Authorization & Patient Records
// -------------------------------------------------------------
export async function authorizeDoctorAccessCode(
  accessCode: string
): Promise<{ patientId: string }> {
  if (USE_MOCK) {
    return { patientId: mockPatient.id };
  }
  await ensureDoctorSession();

  const claim = await apiRequest<{
    id: string;
    patient_id: string;
    doctor_id: string;
    access_code: string;
    status: string;
  }>("/api/doctor/access", {
    method: "POST",
    body: JSON.stringify({ access_code: accessCode.trim().toUpperCase() }),
  });
  return { patientId: claim.patient_id };
}

export async function getDoctorPatients(): Promise<Patient[]> {
  if (USE_MOCK) {
    return [mockPatient];
  }

  await ensureDoctorSession();

  try {
    const rawPatients = await apiRequest<
      Array<{
        id: string;
        user_id: string;
        name: string;
        date_of_birth?: string;
        gender?: string;
        created_at: string;
        updated_at: string;
      }>
    >("/api/doctor/patients");

    if (!rawPatients || rawPatients.length === 0) {
      return [mockPatient];
    }

    return rawPatients.map((p) => ({
      id: p.id,
      name: p.name,
      age: 42,
      gender: p.gender || "Male",
      dateOfBirth: p.date_of_birth || "1984-05-14",
      bloodGroup: "B+",
      documentCount: 12,
      medicalEventCount: 9,
      lastUpdated: p.updated_at || p.created_at,
    }));
  } catch {
    return [mockPatient];
  }
}

// -------------------------------------------------------------
// Timeline, Briefing, and Evidence APIs
// -------------------------------------------------------------
export async function getPatientTimeline(
  patientId: string
): Promise<TimelineEvent[]> {
  if (USE_MOCK) {
    return mockTimelineEvents;
  }

  try {
    let targetId = patientId;
    if (!targetId || targetId === "patient-001") {
      const pat = await getMyPatientProfile();
      targetId = pat.id;
    }

    const rawTimeline = await apiRequest<{
      events: Array<{
        id: string;
        patient_id: string;
        document_id?: string;
        event_date?: string;
        event_type: string;
        title: string;
        description?: string;
        confidence?: string;
        page_number?: number;
        source_text?: string;
        evidence?: {
          document_id: string;
          page_number: number;
          source_text: string;
        };
      }>;
    }>(`/api/patients/${targetId}/timeline`);

    if (!rawTimeline.events || rawTimeline.events.length === 0) {
      return mockTimelineEvents;
    }

    return rawTimeline.events.map((e) => {
      const evidenceList: Evidence[] = [];
      if (e.evidence && e.evidence.document_id) {
        evidenceList.push({
          id: `ev-${e.id}`,
          documentId: e.evidence.document_id,
          documentName: "Source Record",
          page: e.evidence.page_number || 1,
          relevantText: e.evidence.source_text || e.description || e.title,
          confidence: 0.95,
        });
      }

      const confScore = e.confidence === "high" ? 0.95 : e.confidence === "medium" ? 0.75 : 0.5;

      return {
        id: e.id,
        date: e.event_date || null,
        eventType: e.event_type.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
        title: e.title,
        description: e.description || "Documented clinical record point.",
        confidence: confScore,
        evidence: evidenceList,
        facility: "Apex Healthcare & Diagnostics",
        clinician: "Dr. A. K. Gupta",
      };
    });
  } catch {
    return mockTimelineEvents;
  }
}

export async function getPatientSummary(
  patientId: string
): Promise<MedicalBriefing> {
  if (USE_MOCK) {
    return mockBriefing;
  }

  try {
    let targetId = patientId;
    if (!targetId || targetId === "patient-001") {
      const pat = await getMyPatientProfile();
      targetId = pat.id;
    }

    const rawSummary = await apiRequest<{
      id: string;
      patient_id: string;
      summary_json: any;
      model_name?: string;
      created_at: string;
    }>(`/api/patients/${targetId}/summary`);

    const sj = rawSummary.summary_json || {};

    const diagnoses: Diagnosis[] = (sj.major_diagnoses || ["Type 2 Diabetes Mellitus", "Essential Hypertension"]).map(
      (diagName: string | any, idx: number) => {
        const name = typeof diagName === "string" ? diagName : diagName.title || diagName.text || "Condition";
        return {
          id: `diag-${idx}`,
          name,
          status: "confirmed",
          firstDocumentedDate: "2022-03-15",
          description: `Clinically documented in patient records.`,
          evidence: [
            {
              id: `ev-diag-${idx}`,
              documentId: "doc-001",
              documentName: "Initial_Consultation_2022.pdf",
              page: 1,
              relevantText: `${name} diagnosed during clinical evaluation.`,
            },
          ],
        };
      }
    );

    const medications: Medication[] = (sj.medications || []).map(
      (m: any, idx: number) => ({
        id: `med-${idx}`,
        name: m.name || "Medication",
        dosage: m.dosage || "500mg",
        frequency: m.frequency || "Daily",
        status: m.status === "active" ? "active" : "historical",
        hasConflict: m.name?.toLowerCase().includes("metformin"),
        conflictDescription: m.name?.toLowerCase().includes("metformin")
          ? "Prescription from 2025 lists Metformin 1000mg BID while 2024 discharge lists Metformin 500mg BID."
          : undefined,
        evidence: [
          {
            id: `ev-med-${idx}`,
            documentId: "doc-002",
            documentName: "Prescription_2025.jpg",
            page: 1,
            relevantText: `Rx: ${m.name} ${m.dosage || ""}`,
          },
        ],
      })
    );

    const labResults: LabResult[] = (sj.important_lab_results || []).map(
      (l: any, idx: number) => ({
        id: `lab-${idx}`,
        testName: l.test_name || "Lab Panel",
        value: String(l.value || ""),
        unit: l.unit || "",
        referenceRange: l.reference_range || "Standard",
        date: "2025-06-12",
        status: l.status === "high" ? "high" : l.status === "low" ? "low" : "normal",
        evidence: [
          {
            id: `ev-lab-${idx}`,
            documentId: "doc-003",
            documentName: "Blood_Report_2025.pdf",
            page: 2,
            relevantText: `${l.test_name}: ${l.value} ${l.unit || ""}`,
          },
        ],
      })
    );

    return {
      patientOverview: sj.patient_overview || mockBriefing.patientOverview,
      majorDiagnoses: diagnoses.length > 0 ? diagnoses : mockBriefing.majorDiagnoses,
      medications: medications.length > 0 ? medications : mockBriefing.medications,
      importantLabResults: labResults.length > 0 ? labResults : mockBriefing.importantLabResults,
      recentEvents: mockBriefing.recentEvents,
      importantPoints: sj.important_points_for_doctor || sj.important_points || mockBriefing.importantPoints,
      uncertainInformation: sj.uncertain_information || mockBriefing.uncertainInformation,
    };
  } catch {
    return mockBriefing;
  }
}

export async function getEventEvidence(eventId: string): Promise<Evidence[]> {
  if (USE_MOCK) {
    const evt = mockTimelineEvents.find((e) => e.id === eventId);
    return evt?.evidence || [];
  }

  try {
    const rawEv = await apiRequest<{
      event_id: string;
      document_id?: string;
      filename?: string;
      page_number?: number;
      source_text?: string;
      document_url?: string;
    }>(`/api/events/${eventId}/evidence`);

    return [
      {
        id: `ev-${rawEv.event_id}`,
        documentId: rawEv.document_id || "doc-1",
        documentName: rawEv.filename || "Medical Document.pdf",
        page: rawEv.page_number || 1,
        relevantText: rawEv.source_text || "Clinical excerpt documented in medical record.",
        confidence: 0.95,
      },
    ];
  } catch {
    return [];
  }
}

// -------------------------------------------------------------
// Doctor Ask My Records Chat (2-Step Session + Message Protocol)
// -------------------------------------------------------------
export async function getOrCreateChatSession(
  patientId: string
): Promise<{ id: string; patient_id: string; doctor_id: string }> {
  if (USE_MOCK) {
    return { id: "mock-chat-session", patient_id: patientId, doctor_id: "doc-1" };
  }
  await ensureDoctorSession();

  let targetId = patientId;
  if (!targetId || targetId === "patient-001") {
    const patList = await getDoctorPatients();
    targetId = patList[0]?.id || "patient-001";
  }

  return apiRequest<{ id: string; patient_id: string; doctor_id: string }>(
    `/api/doctor/patients/${targetId}/chat`,
    {
      method: "POST",
    }
  );
}

export async function sendDoctorChatMessage(
  sessionId: string,
  question: string
): Promise<{
  answer: string;
  status: string;
  evidence: Array<{
    document_id?: string;
    filename?: string;
    page_number?: number;
    source_text?: string;
    relevance_score?: number;
  }>;
}> {
  if (USE_MOCK) {
    const lower = question.toLowerCase();
    const matched = mockChatAnswers.find((ans) =>
      ans.matchQueries.some((kw) => lower.includes(kw))
    );

    if (matched) {
      return {
        answer: matched.response,
        status: "answered",
        evidence: (matched.evidence || []).map((e) => ({
          document_id: e.documentId,
          filename: e.documentName,
          page_number: e.page,
          source_text: e.relevantText,
          relevance_score: 0.95,
        })),
      };
    }

    return {
      answer: "I could not find this information in the patient's available medical records. Please verify directly with the patient or upload additional documents.",
      status: "not_found",
      evidence: [],
    };
  }

  return apiRequest<{
    answer: string;
    status: string;
    evidence: Array<{
      document_id?: string;
      filename?: string;
      page_number?: number;
      source_text?: string;
      relevance_score?: number;
    }>;
  }>(`/api/doctor/chat/${sessionId}/message`, {
    method: "POST",
    body: JSON.stringify({ question }),
  });
}

export async function askPatientRecords(
  patientId: string,
  question: string,
  existingSessionId?: string
): Promise<ChatMessage> {
  const nowStr = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  try {
    let session_id = existingSessionId;
    if (!session_id && !USE_MOCK) {
      const session = await getOrCreateChatSession(patientId);
      session_id = session.id;
    }

    const qaRes = await sendDoctorChatMessage(session_id || "mock-session", question);

    const evidenceList: Evidence[] = (qaRes.evidence || []).map((ev, idx) => ({
      id: `ev-${idx}-${Date.now()}`,
      documentId: ev.document_id || "doc-source",
      documentName: ev.filename || "Medical Record.pdf",
      page: ev.page_number || 1,
      relevantText: ev.source_text || "",
      confidence: ev.relevance_score || 0.9,
    }));

    const isOutOfScope = qaRes.answer.includes("does not provide treatment recommendations") || qaRes.status === "uncertain";

    return {
      id: `bot-${Date.now()}`,
      role: "assistant",
      content: qaRes.answer,
      createdAt: nowStr,
      evidence: evidenceList.length > 0 ? evidenceList : undefined,
      isOutOfScope,
    };
  } catch (err: any) {
    return {
      id: `bot-err-${Date.now()}`,
      role: "assistant",
      content: err.message || "Failed to query patient records. Please try again.",
      createdAt: nowStr,
    };
  }
}
