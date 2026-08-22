export type UserRole = "patient" | "doctor";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  specialty?: string;
  licenseNumber?: string;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  dateOfBirth?: string;
  bloodGroup?: string;
  phone?: string;
  emergencyContact?: string;
  documentCount: number;
  medicalEventCount: number;
  lastUpdated: string;
}

export type DocumentStatus = "completed" | "processing" | "failed";

export interface MedicalDocument {
  id: string;
  name: string;
  type: string;
  uploadDate: string;
  status: DocumentStatus;
  url?: string;
  pageCount?: number;
  fileSize?: string;
  extractedEntitiesCount?: number;
}

export interface Evidence {
  id: string;
  documentId: string;
  documentName: string;
  page: number;
  relevantText: string;
  confidence?: number;
}

export interface TimelineEvent {
  id: string;
  date: string | null;
  eventType: string;
  title: string;
  description: string;
  confidence: number;
  evidence: Evidence[];
  facility?: string;
  clinician?: string;
}

export interface Diagnosis {
  id: string;
  name: string;
  status?: "confirmed" | "suspected" | "historical";
  firstDocumentedDate?: string | null;
  description?: string;
  evidence: Evidence[];
}

export interface Medication {
  id: string;
  name: string;
  dosage?: string;
  frequency?: string;
  status?: "active" | "historical" | "uncertain";
  hasConflict?: boolean;
  conflictDescription?: string;
  evidence: Evidence[];
}

export interface LabResult {
  id: string;
  testName: string;
  value: string;
  unit?: string;
  referenceRange?: string;
  date: string | null;
  status?: "normal" | "high" | "low" | "unknown";
  evidence: Evidence[];
}

export interface MedicalBriefing {
  patientOverview: string;
  majorDiagnoses: Diagnosis[];
  medications: Medication[];
  importantLabResults: LabResult[];
  recentEvents: TimelineEvent[];
  importantPoints: string[];
  uncertainInformation: string[];
}

export type ChatRole = "doctor" | "assistant";

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  createdAt: string;
  evidence?: Evidence[];
  warning?: string;
  isConflict?: boolean;
  isOutOfScope?: boolean;
}

export interface DoctorAccess {
  id: string;
  doctorName: string;
  accessCode: string;
  grantedAt: string;
  expiresAt: string;
  active: boolean;
  hospital?: string;
  specialty?: string;
}
