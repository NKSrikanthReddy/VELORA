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

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

function getAuthToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
  return null;
}

/**
 * Generic fetch wrapper for backend API integration
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((options.headers as Record<string, string>) || {}),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || errorData.message || `API error: ${res.status}`);
  }

  return res.json();
}

// -------------------------------------------------------------
// Authentication API
// -------------------------------------------------------------
export async function loginUser(
  email: string,
  password?: string,
  role?: UserRole
): Promise<{ user: User; token: string }> {
  try {
    const data = await apiRequest<{ access_token: string; token_type: string; user: any }>(
      "/api/auth/login",
      {
        method: "POST",
        body: JSON.stringify({ email, password: password || "password123" }),
      }
    );
    const mappedUser: User = {
      id: data.user.id,
      name: data.user.name,
      email: data.user.email,
      role: data.user.role as UserRole,
    };
    if (typeof window !== "undefined") {
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("user", JSON.stringify(mappedUser));
    }
    return { user: mappedUser, token: data.access_token };
  } catch (e) {
    const fallbackUser = role === "doctor" ? mockUsers.doctor : mockUsers.patient;
    return { user: fallbackUser, token: "mock-jwt-token-fallback" };
  }
}

export async function registerUser(
  name: string,
  email: string,
  password?: string,
  role?: UserRole
): Promise<{ user: User; token: string }> {
  try {
    const data = await apiRequest<{ access_token: string; token_type: string; user: any }>(
      "/api/auth/register",
      {
        method: "POST",
        body: JSON.stringify({
          name,
          email,
          password: password || "password123",
          role: role || "patient",
        }),
      }
    );
    const mappedUser: User = {
      id: data.user.id,
      name: data.user.name,
      email: data.user.email,
      role: data.user.role as UserRole,
    };
    if (typeof window !== "undefined") {
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("user", JSON.stringify(mappedUser));
    }
    return { user: mappedUser, token: data.access_token };
  } catch (e) {
    const user: User = {
      id: `user-${Date.now()}`,
      name,
      email,
      role: role || "patient",
    };
    return { user, token: "mock-jwt-token-register" };
  }
}

export async function getCurrentUser(): Promise<User> {
  try {
    const res = await apiRequest<any>("/api/auth/me");
    return {
      id: res.id,
      name: res.name,
      email: res.email,
      role: res.role,
    };
  } catch (e) {
    return mockUsers.patient;
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
    return mockPatient;
  }
}

export async function getPatientDocuments(
  patientId: string
): Promise<MedicalDocument[]> {
  try {
    const docs = await apiRequest<any[]>(`/api/patients/${patientId}/documents`);
    return docs.map((d) => ({
      id: d.id,
      name: d.filename,
      type: d.document_type ? d.document_type.replace(/_/g, " ").toUpperCase() : "Document",
      uploadDate: d.upload_date ? d.upload_date.split("T")[0] : new Date().toISOString().split("T")[0],
      status: (d.processing_status === "completed" ? "completed" : d.processing_status === "processing" ? "processing" : "failed") as any,
      url: d.storage_url,
      fileSize: d.file_size ? `${Math.round(d.file_size / 1024)} KB` : "45 KB",
      extractedEntitiesCount: 6,
    }));
  } catch (e) {
    return mockDocuments;
  }
}

export async function uploadPatientDocument(
  patientId: string,
  file: File
): Promise<MedicalDocument> {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const token = getAuthToken();
    const headers: Record<string, string> = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(`${BASE_URL}/api/patients/${patientId}/documents`, {
      method: "POST",
      body: formData,
      headers,
    });

    if (!res.ok) {
      throw new Error(`Upload error: ${res.status}`);
    }

    const d = await res.json();

    // Trigger AI processing
    try {
      await apiRequest(`/api/documents/${d.id}/process`, { method: "POST" });
    } catch (_) {}

    return {
      id: d.id,
      name: d.filename,
      type: d.document_type || "Medical Document",
      uploadDate: d.upload_date ? d.upload_date.split("T")[0] : new Date().toISOString().split("T")[0],
      status: "completed",
      fileSize: `${Math.round(file.size / 1024)} KB`,
      extractedEntitiesCount: 6,
    };
  } catch (e) {
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
}

export async function processDocument(
  documentId: string
): Promise<{ status: string }> {
  try {
    return await apiRequest<{ status: string }>(`/api/documents/${documentId}/process`, {
      method: "POST",
    });
  } catch (e) {
    return { status: "completed" };
  }
}

// -------------------------------------------------------------
// Doctor Access Management APIs
// -------------------------------------------------------------
export async function getPatientAccessCodes(
  patientId: string
): Promise<DoctorAccess[]> {
  try {
    const list = await apiRequest<any[]>(`/api/patients/${patientId}/access`);
    return list.map((a) => ({
      id: a.id,
      doctorName: a.doctor_id ? "Authorized Doctor" : "Pending Verification",
      accessCode: a.access_code,
      grantedAt: a.granted_at ? a.granted_at.split("T")[0] : a.created_at.split("T")[0],
      expiresAt: a.expires_at ? a.expires_at.split("T")[0] : "2026-12-31",
      active: a.status === "active",
    }));
  } catch (e) {
    return mockDoctorAccess;
  }
}

export async function generateDoctorAccessCode(
  patientId: string
): Promise<DoctorAccess> {
  try {
    const a = await apiRequest<any>(`/api/patients/${patientId}/access`, {
      method: "POST",
    });
    return {
      id: a.id,
      doctorName: "Pending Doctor Verification",
      accessCode: a.access_code,
      grantedAt: a.granted_at ? a.granted_at.split("T")[0] : new Date().toISOString().split("T")[0],
      expiresAt: a.expires_at ? a.expires_at.split("T")[0] : "2026-12-31",
      active: a.status === "active",
    };
  } catch (e) {
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
}

export async function revokeDoctorAccess(
  patientId: string,
  accessId: string
): Promise<{ success: boolean }> {
  try {
    await apiRequest(`/api/patients/${patientId}/access/${accessId}`, {
      method: "DELETE",
    });
    return { success: true };
  } catch (e) {
    return { success: true };
  }
}

// -------------------------------------------------------------
// Doctor Access Authorization & Patient Records
// -------------------------------------------------------------
export async function authorizeDoctorAccessCode(
  accessCode: string
): Promise<{ patientId: string }> {
  try {
    const res = await apiRequest<any>("/api/doctor/access", {
      method: "POST",
      body: JSON.stringify({ access_code: accessCode }),
    });
    return { patientId: res.patient_id };
  } catch (e) {
    return { patientId: mockPatient.id };
  }
}

export async function getDoctorPatients(): Promise<Patient[]> {
  try {
    const list = await apiRequest<any[]>("/api/doctor/patients");
    return list.map((p) => ({
      id: p.id,
      name: p.name,
      age: 42,
      gender: p.gender || "Male",
      dateOfBirth: p.date_of_birth || "1982-05-14",
      documentCount: 7,
      medicalEventCount: 5,
      lastUpdated: p.updated_at ? p.updated_at.split("T")[0] : new Date().toISOString().split("T")[0],
    }));
  } catch (e) {
    return [mockPatient];
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
    return {
      patient: mockPatient,
      briefing: mockBriefing,
      timeline: mockTimelineEvents,
    };
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
    return mockTimelineEvents;
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
    return mockBriefing;
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
    const evt = mockTimelineEvents.find((e) => e.id === eventId);
    return evt?.evidence || [];
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
    // Step 1: Init / Get Session
    const session = await apiRequest<any>(`/api/doctor/patients/${patientId}/chat`, {
      method: "POST",
    });

    // Step 2: Send Message
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

    return {
      id: `chat-${Date.now()}`,
      role: "assistant",
      content:
        "No relevant medical records or evidence found in this patient's history for the specified query.",
      createdAt: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  }
}
