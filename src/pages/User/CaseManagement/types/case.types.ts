// Enums
export type CaseType = "CIVIL" | "CRIMINAL";

export type CaseStatus = "ACTIVE" | "CLOSED" | "ARCHIVED";

export type CaseStage =
  // Civil lifecycle
  | "FILED"
  | "UNDER_SUMMONS"
  | "RESPONSE_PENDING"
  | "MEDIATION"
  | "EVIDENCE"
  | "ARGUMENT"
  | "JUDGMENT_AWAITED"
  | "JUDGMENT_DELIVERED"
  | "APPEAL"
  | "EXECUTION"
  | "CLOSED"
  // Criminal lifecycle
  | "FIR_REGISTERED"
  | "UNDER_INVESTIGATION"
  | "CHARGE_SHEET_FILED"
  | "PLEA"
  | "TRIAL"
  | "SENTENCING";

export type PartyType =
  | "PLAINTIFF"
  | "DEFENDANT"
  | "ACCUSED"
  | "APPELLANT"
  | "RESPONDENT"
  | "APPLICANT";

export type PartyRepresentation = "REPRESENTED" | "OPPOSING" | "SELF";

export type BailStatus = "GRANTED" | "DENIED" | "PENDING";

export type TimelineEventType =
  | "CASE_CREATED"
  | "STAGE_CHANGE"
  | "HEARING_SCHEDULED"
  | "HEARING_HELD"
  | "HEARING_ADJOURNED"
  | "PARTY_ADDED"
  | "CASE_NOTE_ADDED";

export type MatchConfidence = "HIGH" | "MEDIUM" | "LOW";

// Interfaces
export interface Case {
  id: string; // UUID - never exposed in UI
  caseNumber: string; // {FIRM_CODE}-{TYPE}-{YEAR}-{SEQUENCE}
  caseType: CaseType;
  title: string;
  courtName: string;
  courtCaseNumber: string;
  judgeName: string; // read-only, server-set
  filingDate: string; // ISO date string
  filingNumber: string;
  assignedTo: string; // UUID of assigned advocate
  description: string;
  caseStage: CaseStage;
  status: CaseStatus;
  hearingCount: number; // read-only
  createdAt: string;
  updatedAt: string;
  parties?: CaseParty[];
  // Civil-only fields
  mediationDate?: string;
  mediationOutcome?: string;
  writtenStatementDeadline?: string;
  // Criminal-only fields
  firNumber?: string;
  firDate?: string;
  policeStation?: string;
  investigationAuthority?: string;
  arrestDate?: string;
  chargeSheetDate?: string;
  bailStatus?: BailStatus;
}

export interface CaseParty {
  id: string; // UUID
  caseNumber: string;
  partyType: PartyType;
  representation: PartyRepresentation;
  fullName: string;
  mobileNo: string;
  email?: string;
  address?: string;
  clientId?: string; // UUID - linked to client record
  advocateId?: string; // UUID
  notes?: string;
  ourClient: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TimelineEvent {
  id: string;
  caseNumber: string;
  eventType: TimelineEventType;
  title: string;
  description?: string;
  createdAt: string;
  createdBy: string; // UUID or name
}

export interface PartyMatchResult {
  sourceType: "CLIENT" | "CASE_PARTY";
  sourceId: string;
  fullName: string;
  mobileNo?: string;
  email?: string;
  confidence: MatchConfidence;
}

// Request DTOs
export interface CreateCaseRequest {
  caseType: CaseType;
  title: string;
  courtName?: string;
  courtCaseNumber?: string;
  filingDate?: string;
  filingNumber?: string;
  assignedTo?: string;
  description?: string;
  // Civil-only
  mediationDate?: string;
  mediationOutcome?: string;
  writtenStatementDeadline?: string;
  // Criminal-only
  firNumber?: string;
  firDate?: string;
  policeStation?: string;
  investigationAuthority?: string;
  arrestDate?: string;
  chargeSheetDate?: string;
  bailStatus?: BailStatus;
  // Parties (optional on create)
  plaintiffs?: CreatePartyRequest[];
  defendants?: CreatePartyRequest[];
}

export interface UpdateCaseRequest {
  title?: string;
  courtName?: string;
  courtCaseNumber?: string;
  filingDate?: string;
  filingNumber?: string;
  assignedTo?: string;
  description?: string;
  caseStage?: CaseStage;
  status?: CaseStatus;
  // Civil-only
  mediationDate?: string;
  mediationOutcome?: string;
  writtenStatementDeadline?: string;
  // Criminal-only
  firNumber?: string;
  firDate?: string;
  policeStation?: string;
  investigationAuthority?: string;
  arrestDate?: string;
  chargeSheetDate?: string;
  bailStatus?: BailStatus;
}

export interface UpdateCaseStageRequest {
  stage: CaseStage;
}

export interface CreatePartyRequest {
  partyType: PartyType;
  representation: PartyRepresentation;
  fullName: string;
  mobileNo: string;
  email?: string;
  address?: string;
  clientId?: string;
  advocateId?: string;
  notes?: string;
  ourClient: boolean;
}

export interface UpdatePartyRequest extends CreatePartyRequest {}

export interface LinkPartyRequest {
  clientId: string;
  ourClient: boolean;
}

export interface PartyMatchRequest {
  fullName: string;
  mobileNo?: string;
  email?: string;
}

// Filter types for list page
export interface CaseFilters {
  caseType?: CaseType;
  caseStage?: CaseStage;
  status?: CaseStatus;
  assignedTo?: string;
  courtName?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
  page?: number;
  size?: number;
}
