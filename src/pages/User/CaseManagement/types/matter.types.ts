/**
 * Case Management (Matter / Court Case / Court Event) domain types.
 *
 * These models follow the firm case-management API contract:
 *   - Matters are the top-level unit of work (one Matter, many CourtCases).
 *   - A CourtCase is a proceeding at a single court level (Original, Appeal, ...).
 *   - A CourtEvent (TARIK / PESHI) belongs to a CourtCase.
 */

// ============================================================
// Enums
// ============================================================

export type MatterType = "CIVIL" | "CRIMINAL";

export type MatterStatus = "ACTIVE" | "DORMANT" | "CLOSED";

export type CourtLevel = "DISTRICT" | "HIGH" | "SUPREME" | "SPECIALIZED";

export type RelationType =
  | "ORIGINAL"
  | "APPEAL"
  | "CROSS_APPEAL"
  | "REMAND"
  | "REVISION"
  | "WRIT"
  | "REVIEW";

export type PartyType =
  | "PLAINTIFF"
  | "DEFENDANT"
  | "ACCUSED"
  | "APPELLANT"
  | "RESPONDENT"
  | "APPLICANT";

export type PartyRepresentation = "REPRESENTED" | "OPPOSING" | "SELF";

export type CourtEventType = "TARIK" | "PESHI";

export type CourtEventStatus = "SCHEDULED" | "HELD" | "ADJOURNED" | "CANCELED";

export type OutcomeType =
  | "PART_HEARD"
  | "ARGUMENTS_COMPLETE"
  | "EVIDENCE_TAKEN"
  | "ADJOURNED_NO_PROGRESS"
  | "ORDER_PASSED"
  | "ORDER_ISSUED"
  | "STAY_GRANTED"
  | "INTERIM_ORDER"
  | "JUDGMENT_DELIVERED"
  | "WITHDRAWN";

export type NextEventType = "TARIK" | "PESHI" | "JUDGMENT" | "NONE";

export type CourtCaseStatus =
  | "ACTIVE"
  | "JUDGMENT_AWAITED"
  | "DECIDED"
  | "APPEALED"
  | "REMANDED"
  | "CLOSED"
  | "WITHDRAWN";

/**
 * Supported court case stages.
 * The backend validates every transition - the frontend only offers
 * a controlled subset and never bypasses backend validation.
 */
export type CourtCaseStage =
  // Shared stages
  | "FILED"
  | "CLOSED"
  | "JUDGMENT_AWAITED"
  | "JUDGMENT_DELIVERED"
  | "APPEAL"
  | "EXECUTION"
  // Civil lifecycle
  | "UNDER_SUMMONS"
  | "RESPONSE_PENDING"
  | "MEDIATION"
  | "EVIDENCE"
  | "ARGUMENT"
  // Criminal lifecycle
  | "FIR_REGISTERED"
  | "UNDER_INVESTIGATION"
  | "CHARGE_SHEET_FILED"
  | "PLEA"
  | "TRIAL"
  | "SENTENCING"
  // Appeal / writ / review lifecycle
  | "APPEAL_FILED"
  | "ADMISSION"
  | "HEARING"
  | "WRIT_FILED"
  | "REVIEW_FILED";

export type TimelineEventType =
  | "MATTER_CREATED"
  | "COURT_CASE_ADDED"
  | "STAGE_CHANGE"
  | "MEDIATION_FAILED"
  | "MEDIATION_SUCCEEDED"
  | "COURT_EVENT_SCHEDULED"
  | "COURT_EVENT_HELD"
  | "COURT_EVENT_ADJOURNED"
  | "COURT_EVENT_CANCELLED"
  | "PARTY_ADDED"
  | "JUDGMENT_RECORDED"
  | "APPEAL_FILED"
  | "MATTER_NOTE_ADDED";

export type MatchConfidence = "HIGH" | "MEDIUM" | "LOW";

// ============================================================
// Entities
// ============================================================

/** A party attached to a Matter. */
export interface MatterParty {
  id: string;
  matterId: string;
  fullName: string;
  mobileNo?: string;
  email?: string;
  address?: string;
  clientId?: string;
  isOurClient: boolean;
  createdAt?: string;
  updatedAt?: string;
}

/** Role of a matter party inside a specific court case. */
export interface CourtCaseRole {
  matterPartyId: string;
  roleType: PartyType;
  representation: PartyRepresentation;
  party?: MatterParty;
}

/** A single proceeding in the court-case chain of a matter. */
export interface CourtCase {
  id: string;
  ourCourtCaseRef: string;
  matterId?: string;
  relationType: RelationType;
  courtLevel: CourtLevel;
  courtName: string;
  courtCaseNumber: string;
  filingDate?: string;
  stage: CourtCaseStage;
  status: CourtCaseStatus;
  advocateId?: string;
  judgeName?: string;
  partyIsState?: boolean;
  eventCount?: number;
  parentCourtCaseId?: string;
  parentCourtCaseRef?: string;
  childCourtCaseRefs?: string[];
  roles?: CourtCaseRole[];
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
  bailStatus?: string;
  // Judgment
  judgmentDate?: string;
  judgmentSummary?: string;
  decisionInFavorOfPartyId?: string;
  appealDeadline?: string;
  // Appeal information (set when an appeal is filed on top of this case)
  appealCourtCaseRef?: string;
  createdAt?: string;
  updatedAt?: string;
}

/** A court event (TARIK / PESHI) on a court case. */
export interface CourtEvent {
  id: string;
  courtCaseId: string;
  ourCourtCaseRef?: string;
  matterNumber?: string;
  matterTitle?: string;
  eventType: CourtEventType;
  scheduledDate: string;
  scheduledTime?: string;
  endTime?: string;
  attendingAdvocateId?: string;
  judgeName?: string;
  courtRoom?: string;
  notes?: string;
  status: CourtEventStatus;
  outcome?: string;
  outcomeType?: OutcomeType;
  nextEventType?: NextEventType;
  nextEventId?: string;
  createdAt?: string;
  updatedAt?: string;
}

/** Event on the unified matter timeline. */
export interface MatterTimelineEvent {
  id: string;
  matterId: string;
  matterNumber: string;
  matterTitle: string;
  courtCaseId?: string;
  ourCourtCaseRef?: string;
  eventType: TimelineEventType;
  title: string;
  description?: string;
  createdAt: string;
  createdBy: string;
}

/** A matter that has had no real Peshi for a long time. */
export interface StaleMatter {
  id: string;
  matterNumber: string;
  title: string;
  matterType: MatterType;
  status: MatterStatus;
  currentCourtCaseRef: string;
  daysSinceLastPeshi: number;
}

/** A court event surfaced through the firm-wide calendar feed. */
export interface CalendarEventItem {
  id: string;
  courtCaseId: string;
  ourCourtCaseRef: string;
  matterNumber: string;
  matterTitle: string;
  eventType: CourtEventType;
  scheduledDate: string;
  scheduledTime?: string;
  endTime?: string;
  courtRoom?: string;
  status: CourtEventStatus;
  attendingAdvocateId?: string;
}

/** Full matter detail returned by GET /firm/matters/{matterNumber}. */
export interface MatterResponse {
  id: string;
  matterNumber: string;
  title: string;
  matterType: MatterType;
  status: MatterStatus;
  description?: string;
  originatingCourtLevel?: CourtLevel;
  courtName?: string;
  courtCaseNumber?: string;
  filingDate?: string;
  assignedPartnerId?: string;
  advocateId?: string;
  createdAt?: string;
  updatedAt?: string;
  /** The ORIGINAL court case created together with the matter. */
  originalCourtCase?: CourtCase;
  /** Full court-case chain, oldest first. */
  courtCases?: CourtCase[];
  /** The current (leaf) court case. */
  currentCourtCase?: CourtCase;
  parties?: MatterParty[];
  /** Roles on the current/leaf court case. */
  roles?: CourtCaseRole[];
  /** Most recent court event (used for the "next date" banner). */
  nextEvent?: CourtEvent;
}

/** Row returned by GET /firm/matters (paginated). */
export interface MatterSummary {
  id: string;
  matterNumber: string;
  title: string;
  matterType: MatterType;
  status: MatterStatus;
  currentCourtCaseRef?: string;
  currentStage?: CourtCaseStage;
  currentCourt?: string;
  parties?: string[];
  updatedAt?: string;
}

// ============================================================
// Requests
// ============================================================

export interface PartyEntryRequest {
  fullName: string;
  mobileNo?: string;
  email?: string;
  clientId?: string;
  isOurClient: boolean;
  roleType: PartyType;
  representation: PartyRepresentation;
}

export interface CreateMatterRequest {
  matterType: MatterType;
  title: string;
  originatingCourtLevel: CourtLevel;
  courtName: string;
  courtCaseNumber: string;
  filingDate: string;
  assignedPartnerId?: string;
  advocateId?: string;
  description?: string;
  parties: PartyEntryRequest[];
}

export interface UpdateMatterRequest {
  title?: string;
  description?: string;
  assignedPartnerId?: string;
  status?: MatterStatus;
}

export interface PartyMatchRequest {
  fullName: string;
  mobileNo?: string;
  email?: string;
}

export interface PartyMatch {
  sourceType: "CLIENT" | "CASE_PARTY";
  sourceId: string;
  fullName: string;
  mobileNo?: string;
  email?: string;
  confidence: MatchConfidence;
  caseNumber?: string;
}

export interface AddCourtCaseRoleRequest {
  matterPartyId?: string;
  roleType: PartyType;
  representation: PartyRepresentation;
  // Inline new party (used when matterPartyId is not provided).
  fullName?: string;
  mobileNo?: string;
  email?: string;
  clientId?: string;
  isOurClient?: boolean;
}

export interface AddCourtCaseRequest {
  relationType: RelationType;
  courtLevel: CourtLevel;
  courtName: string;
  courtCaseNumber: string;
  filingDate?: string;
  advocateId?: string;
  judgeName?: string;
  parentCourtCaseId: string;
  partyIsState?: boolean;
  roles: AddCourtCaseRoleRequest[];
}

export interface UpdateCourtCaseRequest {
  courtCaseNumber?: string;
  courtName?: string;
  advocateId?: string;
  judgeName?: string;
  firNumber?: string;
  firDate?: string;
  policeStation?: string;
  investigationAuthority?: string;
  arrestDate?: string;
  chargeSheetDate?: string;
  bailStatus?: string;
  mediationDate?: string;
  mediationOutcome?: string;
  writtenStatementDeadline?: string;
}

export interface UpdateCourtCaseStageRequest {
  stage: CourtCaseStage;
}

export interface CreateCourtEventRequest {
  eventType: CourtEventType;
  scheduledDate: string;
  scheduledTime?: string;
  endTime?: string;
  attendingAdvocateId?: string;
  judgeName?: string;
  courtRoom?: string;
  notes?: string;
}

export interface UpdateCourtEventRequest {
  scheduledDate?: string;
  scheduledTime?: string;
  endTime?: string;
  judgeName?: string;
  courtRoom?: string;
  notes?: string;
  attendingAdvocateId?: string;
}

export interface MarkEventHeldRequest {
  outcome: string;
  outcomeType: OutcomeType;
  nextEventType: NextEventType;
  nextEventDate?: string;
  nextEventTime?: string;
  notes?: string;
}

export interface RecordJudgmentRequest {
  judgmentDate: string;
  judgmentSummary: string;
  decisionInFavorOfPartyId?: string;
  partyIsState?: boolean;
}

// ============================================================
// Filters
// ============================================================

export interface MatterFilters {
  matterType?: MatterType;
  status?: MatterStatus;
  search?: string;
  page?: number;
  size?: number;
}

export interface FirmTimelineFilters {
  matterType?: MatterType;
  status?: MatterStatus;
  from?: string;
  to?: string;
  page?: number;
  size?: number;
}

export interface StaleMatterFilters {
  days?: number;
  page?: number;
  size?: number;
}
