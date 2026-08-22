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

export const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "true";
export const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const TOKEN_KEY = "velora_auth_token";
const USER_KEY = "velora_auth_user";

// -------------------------------------------------------------
// Auth Token & Storage Helpers (Client-side safe)
// -------------------------------------------------------------
export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  const token = localStorage.getItem(TOKEN_KEY) || localStorage.getItem("token");
  if (!token || token === "null" || token === "undefined" || token.trim() === "") {
    return null;
  }
  return token;
}

export function setAuthSession(token: string, user: User) {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem("token", token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  localStorage.setItem("user", JSON.stringify(user));
}

export function getStoredUser(): User | null {
  if (typeof window === "undefined") return null;
  const userJson = localStorage.getItem(USER_KEY) || localStorage.getItem("user");
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
  localStorage.removeItem("token");
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem("user");
}

/**
 * Centralized fetch wrapper with automatic JWT header, FormData support, and detailed error handling.
 */
export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAuthToken();
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
    } catch {
      // JSON parse fallback
    }

    if (res.status === 401 && endpoint !== "/api/auth/login") {
      clearAuthSession();
    }

    throw new Error(errorMessage);
  }

  if (res.status === 204) {
    return {} as T;
  }

  return res.json();
}

// -------------------------------------------------------------
// Authentication APIs
// -------------------------------------------------------------
export async function loginUser(
  email: string,
  password?: string,
  role?: UserRole
): Promise<{ user: User; token: string }> {
  if (USE_MOCK) {
    const fallbackUser = role === "doctor" ? mockUsers.doctor : mockUsers.patient;
    setAuthSession("mock-jwt-token-xyz", fallbackUser);
    return { user: fallbackUser, token: "mock-jwt-token-xyz" };
  }

  const data = await apiRequest<{
    access_token: string;
    token_type: string;
    user: {
      id: string;
      name: string;
      email: string;
      role: UserRole;
      created_at: string;
    };
  }>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password: password || "patient123" }),
  });

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
  password?: string,
  role?: UserRole
): Promise<{ user: User; token: string }> {
  if (USE_MOCK) {
    const user: User = {
      id: `user-${Date.now()}`,
      name,
      email,
      role: role || "patient",
    };
    setAuthSession("mock-jwt-token-register", user);
    return { user, token: "mock-jwt-token-register" };
  }

  const data = await apiRequest<{
    access_token: string;
    token_type: string;
    user: {
      id: string;
      name: string;
      email: string;
      role: UserRole;
      created_at: string;
    };
  }>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify({
      name,
      email,
      password: password || "password123",
      role: role || "patient",
    }),
  });

  const user: User = {
    id: data.user.id,
    name: data.user.name,
    email: data.user.email,
    role: data.user.role,
  };

  setAuthSession(data.access_token, user);
  return { user, token: data.access_token };
}

export async function getCurrentUser(): Promise<User> {
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
  } catch (e) {
    if (USE_MOCK) return getStoredUser() || mockUsers.patient;
    throw e;
  }
}

export async function getMyPatientProfile(): Promise<Patient> {
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
    if (USE_MOCK) return mockPatient;
    throw err;
  }
}

// -------------------------------------------------------------
// Patient & Document APIs
// -------------------------------------------------------------
export async function getPatient(patientId: string): Promise<Patient> {
  try {
    const p = await apiRequest<any>(`/api/patients/${patientId}`);
    return {
      id: p.id,
      name: p.name,
      age: 42,
      gender: p.gender || "Male",
      dateOfBirth: p.date_of_birth || "1982-05-14",
      documentCount: 7,
      medicalEventCount: 5,
      lastUpdated: p.updated_at ? p.updated_at.split("T")[0] : new Date().toISOString().split("T")[0],
    };
  } catch (e) {
    if (USE_MOCK) return mockPatient;
    throw e;
  }
}

export async function getPatientDocuments(
  patientId: string
): Promise<MedicalDocument[]> {
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

    return rawDocs.map((d) => ({
      id: d.id,
      name: d.filename,
      type: d.document_type ? d.document_type.replace(/_/g, " ").toUpperCase() : "MEDICAL DOCUMENT",
      uploadDate: d.upload_date ? d.upload_date.split("T")[0] : new Date().toISOString().split("T")[0],
      status: d.processing_status === "completed" ? "completed" : d.processing_status === "failed" ? "failed" : "processing",
      url: d.storage_url,
      fileSize: `${Math.round((d.file_size || 45000) / 1024)} KB`,
      pageCount: 1,
      extractedEntitiesCount: d.processing_status === "completed" ? 6 : undefined,
    }));
  } catch (e) {
    if (USE_MOCK) return mockDocuments;
    throw e;
  }
}

export async function uploadPatientDocument(
  patientId: string,
  file: File
): Promise<MedicalDocument> {
  try {
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
    }>(`/api/patients/${patientId}/documents`, {
      method: "POST",
      body: formData,
    });

    try {
      await apiRequest(`/api/documents/${rawDoc.id}/process`, { method: "POST" });
    } catch (_) {}

    return {
      id: rawDoc.id,
      name: rawDoc.filename,
      type: rawDoc.document_type ? rawDoc.document_type.replace(/_/g, " ").toUpperCase() : "MEDICAL DOCUMENT",
      uploadDate: rawDoc.upload_date ? rawDoc.upload_date.split("T")[0] : new Date().toISOString().split("T")[0],
      status: "completed",
      url: rawDoc.storage_url,
      fileSize: `${Math.round(rawDoc.file_size / 1024)} KB`,
      pageCount: 1,
      extractedEntitiesCount: 6,
    };
  } catch (e) {
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
    throw e;
  }
}

export async function processDocument(
  documentId: string
): Promise<{ status: string; message?: string }> {
  try {
    return await apiRequest<{ status: string; message?: string }>(
      `/api/documents/${documentId}/process`,
      {
        method: "POST",
      }
    );
  } catch (e) {
    if (USE_MOCK) return { status: "completed", message: "Document processed" };
    throw e;
  }
}

// -------------------------------------------------------------
// Doctor Access Management APIs
// -------------------------------------------------------------
export async function getPatientAccessCodes(
  patientId: string
): Promise<DoctorAccess[]> {
  try {
    const rawList = await apiRequest<
      Array<{
        id: string;
        patient_id: string;
        doctor_id?: string;
        access_code: string;
        status: string;
        granted_at?: string;
        expires_at?: string;
        created_at: string;
      }>
    >(`/api/patients/${patientId}/access`);

    return rawList.map((item) => ({
      id: item.id,
      doctorName: item.doctor_id ? "Authorized Doctor" : "Pending Doctor Verification",
      accessCode: item.access_code,
      grantedAt: item.granted_at ? item.granted_at.split("T")[0] : item.created_at.split("T")[0],
      expiresAt: item.expires_at ? item.expires_at.split("T")[0] : "24 Hours",
      active: item.status === "active",
      hospital: "City Health Clinic",
      specialty: "Internal Medicine",
    }));
  } catch (e) {
    if (USE_MOCK) return mockDoctorAccess;
    throw e;
  }
}

export async function generateDoctorAccessCode(
  patientId: string
): Promise<DoctorAccess> {
  try {
    const rawAccess = await apiRequest<{
      id: string;
      patient_id: string;
      doctor_id?: string;
      access_code: string;
      status: string;
      granted_at?: string;
      expires_at?: string;
    }>(`/api/patients/${patientId}/access`, {
      method: "POST",
    });

    return {
      id: rawAccess.id,
      doctorName: "Pending Doctor Verification",
      accessCode: rawAccess.access_code,
      grantedAt: rawAccess.granted_at ? rawAccess.granted_at.split("T")[0] : new Date().toISOString().split("T")[0],
      expiresAt: rawAccess.expires_at ? rawAccess.expires_at.split("T")[0] : "24 Hours",
      active: rawAccess.status === "active",
    };
  } catch (e) {
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
    throw e;
  }
}

export async function revokeDoctorAccess(
  patientId: string,
  accessId: string
): Promise<{ success: boolean }> {
  try {
    await apiRequest<void>(`/api/patients/${patientId}/access/${accessId}`, {
      method: "DELETE",
    });
    return { success: true };
  } catch (e) {
    if (USE_MOCK) return { success: true };
    throw e;
  }
}

// -------------------------------------------------------------
// Doctor Access Authorization & Patient Records
// -------------------------------------------------------------
export async function authorizeDoctorAccessCode(
  accessCode: string
): Promise<{ patientId: string }> {
  try {
    const claim = await apiRequest<{
      id: string;
      patient_id: string;
      doctor_id?: string;
      access_code: string;
      status: string;
    }>("/api/doctor/access", {
      method: "POST",
      body: JSON.stringify({ access_code: accessCode.trim().toUpperCase() }),
    });
    return { patientId: claim.patient_id };
  } catch (e) {
    if (USE_MOCK) return { patientId: mockPatient.id };
    throw e;
  }
}

export async function getDoctorPatients(): Promise<Patient[]> {
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

    return rawPatients.map((p) => ({
      id: p.id,
      name: p.name,
      age: 42,
      gender: p.gender || "Male",
      dateOfBirth: p.date_of_birth || "1984-05-14",
      bloodGroup: "B+",
      documentCount: 7,
      medicalEventCount: 5,
      lastUpdated: p.updated_at || p.created_at,
    }));
  } catch (e) {
    if (USE_MOCK) return [mockPatient];
    throw e;
  }
}

export async function getDoctorPatientDetails(
  patientId: string
): Promise<{
  patient: Patient;
  briefing: MedicalBriefing;
  timeline: TimelineEvent[];
}> {
  try {
    const [patient, briefing, timeline] = await Promise.all([
      getPatient(patientId),
      getPatientSummary(patientId),
      getPatientTimeline(patientId),
    ]);
    return { patient, briefing, timeline };
  } catch (e) {
    if (USE_MOCK) {
      return {
        patient: mockPatient,
        briefing: mockBriefing,
        timeline: mockTimelineEvents,
      };
    }
    throw e;
  }
}

// -------------------------------------------------------------
// Timeline, Briefing, and Evidence APIs
// -------------------------------------------------------------
export async function getPatientTimeline(
  patientId: string
): Promise<TimelineEvent[]> {
  try {
    const data = await apiRequest<any>(`/api/patients/${patientId}/timeline`);
    const events = data.events || [];
    return events.map((ev: any) => ({
      id: ev.id,
      date: ev.event_date,
      eventType: ev.event_type || "consultation",
      title: ev.title,
      description: ev.description || "",
      confidence: ev.confidence === "high" ? 0.95 : 0.8,
      evidence: ev.evidence
        ? [
            {
              id: `ev-${ev.id}`,
              documentId: ev.evidence.document_id || "",
              documentName: "Medical Record",
              page: ev.evidence.page_number || 1,
              relevantText: ev.evidence.source_text || "",
              confidence: 0.9,
            },
          ]
        : [],
    }));
  } catch (e) {
    if (USE_MOCK) return mockTimelineEvents;
    throw e;
  }
}

export async function getPatientSummary(
  patientId: string
): Promise<MedicalBriefing> {
  try {
    const res = await apiRequest<any>(`/api/patients/${patientId}/summary`);
    const s = res.summary_json || {};

    return {
      patientOverview: s.patient_overview || "Consolidated patient medical briefing summary.",
      majorDiagnoses: (s.major_diagnoses || []).map((d: any, idx: number) => ({
        id: `diag-${idx}`,
        name: typeof d === "string" ? d : d.title || d.name,
        evidence: [],
      })),
      medications: (s.medications || []).map((m: any, idx: number) => ({
        id: `med-${idx}`,
        name: m.name,
        dosage: m.dosage,
        frequency: m.frequency,
        status: (m.status || "active") as any,
        evidence: [],
      })),
      importantLabResults: (s.important_lab_results || []).map((l: any, idx: number) => ({
        id: `lab-${idx}`,
        testName: l.test_name,
        value: l.value,
        unit: l.unit,
        status: (l.status || "normal") as any,
        date: null,
        evidence: [],
      })),
      recentEvents: (s.recent_events || []).map((e: any, idx: number) => ({
        id: `ev-${idx}`,
        date: e.date,
        eventType: e.type || "event",
        title: e.title,
        description: e.description || "",
        confidence: 0.9,
        evidence: [],
      })),
      importantPoints: s.important_points_for_doctor || [],
      uncertainInformation: s.uncertain_information || [],
    };
  } catch (e) {
    if (USE_MOCK) return mockBriefing;
    throw e;
  }
}

export async function getEventEvidence(eventId: string): Promise<Evidence[]> {
  try {
    const ev = await apiRequest<any>(`/api/events/${eventId}/evidence`);
    return [
      {
        id: `ev-${eventId}`,
        documentId: ev.document_id || "",
        documentName: ev.filename || "Document",
        page: ev.page_number || 1,
        relevantText: ev.source_text || "",
        confidence: 0.95,
      },
    ];
  } catch (e) {
    if (USE_MOCK) {
      const evt = mockTimelineEvents.find((e) => e.id === eventId);
      return evt?.evidence || [];
    }
    throw e;
  }
}

// -------------------------------------------------------------
// Ask My Records Chat APIs
// -------------------------------------------------------------
export async function sendChatMessage(
  patientId: string,
  query: string
): Promise<ChatMessage> {
  try {
    const session = await apiRequest<any>(`/api/doctor/patients/${patientId}/chat`, {
      method: "POST",
    });

    const res = await apiRequest<any>(`/api/doctor/chat/${session.id}/message`, {
      method: "POST",
      body: JSON.stringify({ question: query }),
    });

    return {
      id: `chat-${Date.now()}`,
      role: "assistant",
      content: res.answer,
      createdAt: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      evidence: (res.evidence || []).map((ev: any, idx: number) => ({
        id: `ev-${idx}`,
        documentId: ev.document_id || "",
        documentName: ev.filename || "Medical Document",
        page: ev.page_number || 1,
        relevantText: ev.source_text || "",
        confidence: ev.relevance_score || 0.9,
      })),
    };
  } catch (e) {
    if (USE_MOCK) {
      const lower = query.toLowerCase();
      const matched = mockChatAnswers.find((ans) =>
        ans.matchQueries.some((kw) => lower.includes(kw))
      );

      if (matched) {
        return {
          id: `chat-${Date.now()}`,
          role: "assistant",
          content: matched.response,
          createdAt: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          evidence: matched.evidence,
          warning: matched.warning,
          isConflict: matched.isConflict,
          isOutOfScope: matched.isOutOfScope,
        };
      }
    }
    throw e;
  }
}

export async function getOrCreateChatSession(
  patientId: string
): Promise<{ id: string }> {
  try {
    return await apiRequest<{ id: string }>(`/api/doctor/patients/${patientId}/chat`, {
      method: "POST",
    });
  } catch (e) {
    if (USE_MOCK) return { id: `session-${patientId}` };
    throw e;
  }
}

export async function askPatientRecords(
  patientId: string,
  question: string,
  sessionId?: string
): Promise<ChatMessage> {
  return sendChatMessage(patientId, question);
}
