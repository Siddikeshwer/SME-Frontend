// src/app/shared/models/index.ts

export type UserRole = 'ADMIN' | 'POC' | 'SME';
export type AvailabilityStatus = 'AVAILABLE' | 'BOOKED' | 'PENDING' | 'ON_HOLD' | 'INACTIVE';
export type RequestStatus = 'SUBMITTED' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'CHANGES_REQUESTED' | 'CONFIRMED';
export type SmeResponseStatus = 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'NO_RESPONSE';

export interface AuthResponse {
  token: string;
  role: UserRole;
  fullName: string;
  userId: number;
  email: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface Sme {
  id: number;
  fullName: string;
  email: string;
  department: string;
  designation?: string;
  specialties: string[];
  yearsOfExperience: number;
  phone?: string;
  teamsId?: string;
  availabilityStatus: AvailabilityStatus;
  bio?: string;
  lastBooked?: string;
  createdAt?: string;
}

export interface SmeRequest {
  fullName: string;
  email: string;
  department: string;
  designation?: string;
  specialties: string[];
  yearsOfExperience: number;
  phone?: string;
  teamsId?: string;
  availabilityStatus: AvailabilityStatus;
  bio?: string;
}

export interface SmeSummary {
  id: number;
  fullName: string;
  email: string;
  specialties: string[];
  department: string;
  yearsOfExperience: number;
  availabilityStatus: AvailabilityStatus;
}

export interface SmeResponse {
  id: number;
  smeId: number;
  smeName: string;
  smeEmail: string;
  smeSpecialties: string[];
  responseStatus: SmeResponseStatus;
  preferredDate?: string;
  declineReason?: string;
  pingSentAt?: string;
  respondedAt?: string;
  cohortId: string;
}

export interface CohortRequest {
  id: number;
  cohortId: string;
  evaluationType: string;
  requiredSpecialties: string[];
  smesRequired: number;
  participantCount: number;
  preferredDateFrom: string;
  preferredDateTo: string;
  slotDuration: string;
  mode: string;
  priority: string;
  notes?: string;
  adminNote?: string;
  status: RequestStatus;
  pocName: string;
  pocEmail: string;
  pocId: number;
  proposedSmes: SmeSummary[];
  smeResponses: SmeResponse[];
  confirmedCount: number;
  createdAt: string;
  approvedAt?: string;
  pingsSentAt?: string;
}

export interface CreateCohortRequest {
  evaluationType: string;
  requiredSpecialties: string[];
  smesRequired: number;
  participantCount: number;
  preferredDateFrom: string;
  preferredDateTo: string;
  slotDuration: string;
  mode: string;
  priority: string;
  notes?: string;
  proposedSmeIds: number[];
}

export interface ApprovalDecision {
  decision: 'APPROVE' | 'REJECT' | 'REQUEST_CHANGES';
  adminNote?: string;
  selectedSmeIds?: number[];
}

export interface DashboardStats {
  totalSmes?: number;
  availableSmes?: number;
  bookedSmes?: number;
  pendingSmes?: number;
  pendingApprovals?: number;
  bookedThisMonth?: number;
  activeCohorts?: number;
  smeConfirmed?: number;
  awaitingApproval?: number;
  declined?: number;
  recentActivity?: ActivityLog[];
  recentRequests?: CohortRequest[];
}

export interface ActivityLog {
  id: number;
  activityType: string;
  description: string;
  performedBy: string;
  targetEntity: string;
  createdAt: string;
}

// ── AI Agent ──────────────────────────────────────────────────────────────
export interface AgentSmePool {
  totalAvailable: number; totalBooked: number; totalPending: number;
  matchingSpecialty: number; matchingAndAvailable: number;
  recommendedSmeNames: string[]; conflictSmeNames: string[];
}
export interface AgentAnalysis {
  recommendation: 'APPROVE' | 'FLAG' | 'REJECT_RISK';
  headline: string; explanation: string; urgency: 'HIGH' | 'MEDIUM' | 'LOW';
  positives: string[]; warnings: string[]; actions: string[];
  smePool: AgentSmePool; confidenceScore: number;
}
