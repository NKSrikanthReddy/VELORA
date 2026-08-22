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

// Set to true when connecting to a real running backend server
const USE_MOCK = true;
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

/**
 * Generic fetch wrapper for future backend integration
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || `API error: ${res.status}`);
  }

  return res.json();
}

// -------------------------------------------------------------
// Authentication API
// -------------------------------------------------------------
export async function loginUser(
  email: string,
  role: UserRole
): Promise<{ user: User; token: string }> {
  if (USE_MOCK) {
    const user = role === "patient" ? mockUsers.patient : mockUsers.doctor;
    return { user, token: "mock-jwt-token-xyz" };
  }
  return apiRequest<{ user: User; token: string }>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, role }),
  });
}

export async function registerUser(
  name: string,
  email: string,
  role: UserRole
): Promise<{ user: User; token: string }> {
  if (USE_MOCK) {
    const user: User = {
      id: `user-${Date.now()}`,
      name,
      email,
      role,
    };
    return { user, token: "mock-jwt-token-register" };
  }
  return apiRequest<{ user: User; token: string }>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, role }),
  });
}

export async function getCurrentUser(): Promise<User> {
  if (USE_MOCK) {
    return mockUsers.patient;
  }
  return apiRequest<User>("/api/auth/me");
}

// -------------------------------------------------------------
// Patient & Document APIs
// -------------------------------------------------------------
export async function getPatient(patientId: string): Promise<Patient> {
  if (USE_MOCK) {
    return mockPatient;
  }
  return apiRequest<Patient>(`/api/patients/${patientId}`);
}

export async function getPatientDocuments(
  patientId: string
): Promise<MedicalDocument[]> {
  if (USE_MOCK) {
    return mockDocuments;
  }
  return apiRequest<MedicalDocument[]>(`/api/patients/${patientId}/documents`);
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

  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${BASE_URL}/api/patients/${patientId}/documents`, {
    method: "POST",
    body: formData,
  });
  return res.json();
}

export async function processDocument(
  documentId: string
): Promise<{ status: string }> {
  if (USE_MOCK) {
    return { status: "completed" };
  }
  return apiRequest<{ status: string }>(`/api/documents/${documentId}/process`, {
    method: "POST",
  });
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
  return apiRequest<DoctorAccess[]>(`/api/patients/${patientId}/access`);
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
  return apiRequest<DoctorAccess>(`/api/patients/${patientId}/access`, {
    method: "POST",
  });
}

export async function revokeDoctorAccess(
  patientId: string,
  accessId: string
): Promise<{ success: boolean }> {
  if (USE_MOCK) {
    return { success: true };
  }
  return apiRequest<{ success: boolean }>(
    `/api/patients/${patientId}/access/${accessId}`,
    {
      method: "DELETE",
    }
  );
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
  return apiRequest<{ patientId: string }>("/api/doctor/access", {
    method: "POST",
    body: JSON.stringify({ accessCode }),
  });
}

export async function getDoctorPatients(): Promise<Patient[]> {
  if (USE_MOCK) {
    return [mockPatient];
  }
  return apiRequest<Patient[]>("/api/doctor/patients");
}

export async function getDoctorPatientDetails(
  patientId: string
): Promise<{
  patient: Patient;
  briefing: MedicalBriefing;
  timeline: TimelineEvent[];
}> {
  if (USE_MOCK) {
    return {
      patient: mockPatient,
      briefing: mockBriefing,
      timeline: mockTimelineEvents,
    };
  }
  return apiRequest(`/api/doctor/patients/${patientId}`);
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
  return apiRequest<TimelineEvent[]>(`/api/patients/${patientId}/timeline`);
}

export async function getPatientSummary(
  patientId: string
): Promise<MedicalBriefing> {
  if (USE_MOCK) {
    return mockBriefing;
  }
  return apiRequest<MedicalBriefing>(`/api/patients/${patientId}/summary`);
}

export async function getEventEvidence(
  eventId: string
): Promise<Evidence[]> {
  if (USE_MOCK) {
    const evt = mockTimelineEvents.find((e) => e.id === eventId);
    return evt?.evidence || [];
  }
  return apiRequest<Evidence[]>(`/api/events/${eventId}/evidence`);
}

// -------------------------------------------------------------
// Ask My Records Chat APIs
// -------------------------------------------------------------
export async function sendChatMessage(
  patientId: string,
  query: string
): Promise<ChatMessage> {
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

    return {
      id: `chat-${Date.now()}`,
      role: "assistant",
      content:
        "I could not find this information in the patient's available medical records. Please verify directly with the patient or upload additional documents.",
      createdAt: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  }

  return apiRequest<ChatMessage>(`/api/doctor/patients/${patientId}/chat`, {
    method: "POST",
    body: JSON.stringify({ query }),
  });
}
