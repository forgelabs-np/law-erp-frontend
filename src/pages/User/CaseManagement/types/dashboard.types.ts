/**
 * Dashboard module types for Case Dashboard and Global Dashboard
 */

// ============================================================
// Case Dashboard Types
// ============================================================

export interface CaseDashboardResponse {
  success: boolean;
  responseCode: number;
  message: string;
  data: CaseDashboardData;
}

export interface CaseDashboardData {
  stats: CaseDashboardStats;
  todayEvents: TodayEvent[];
  casePositioning: CasePositioning[];
  staleCases: CasePositioning[];
}

export interface CaseDashboardStats {
  totalMatters: number;
  activeMatters: number;
  dormantMatters: number;
  closedMatters: number;
  todayEventsCount: number;
  staleCount: number;
}

export interface TodayEvent {
  eventId: string;
  ourCourtCaseRef: string;
  matterNumber: string;
  matterTitle: string;
  eventType: "TARIK" | "PESHI" | string;
  scheduledDate: string;
  scheduledTime: string;
  endTime: string | null;
  status: string;
  courtRoom: string | null;
  judgeName: string | null;
  attendingAdvocateId: string | null;
  attendingAdvocateName: string | null;
}

export interface CasePositioning {
  matterId: string;
  matterNumber: string;
  matterTitle: string;
  matterType: string;
  matterStatus: string;
  courtCaseId: string | null;
  ourCourtCaseRef: string | null;
  courtName: string | null;
  stage: string | null;
  caseStatus: string | null;
  advocateId: string | null;
  lastHearingDate: string | null;
  lastHearingType: string | null;
  lastHearingStatus: string | null;
  lastHearingOutcome: string | null;
  nextEventDate: string | null;
  nextEventType: string | null;
  nextEventCourtRoom: string | null;
  nextEventJudge: string | null;
  totalEvents: number;
  daysSinceLastHearing: number | null;
  stale: boolean;
}

// ============================================================
// Global Dashboard Types
// ============================================================

export interface GlobalDashboardResponse {
  success: boolean;
  responseCode: number;
  message: string;
  data: GlobalDashboardData;
}

export interface GlobalDashboardData {
  userStats: UserStats;
  firmStats: FirmStats;
  caseStats: GlobalCaseStats;
  scraperStats: ScraperStats;
  recentActivity: RecentActivity[];
}

export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  totalAdvocates: number;
  totalParalegals: number;
  totalClients: number;
  totalFirmAdmins: number;
}

export interface FirmStats {
  totalFirms: number;
  activeFirms: number;
  suspendedFirms: number;
}

export interface GlobalCaseStats {
  totalMatters: number;
  activeMatters: number;
  closedMatters: number;
  staleMatters: number;
  todayEvents: number;
}

export interface ScraperStats {
  courtsTracked: number;
  totalDailyHearings: number;
  totalWeeklyHearings: number;
  totalMatches: number;
  lastScrapeTime: string | null;
}

export interface RecentActivity {
  summary: string;
  action: string;
  entityType: string;
  userName: string;
  createdAt: string;
}

// ============================================================
// Matter Team Assignment Types
// ============================================================

export interface MatterAssignment {
  id: string;
  matterId: string;
  matterNumber: string;
  matterTitle: string;
  userId: string;
  userName: string;
  assignmentRole:
    | "PRIMARY_ADVOCATE"
    | "CO_ADVOCATE"
    | "PARALEGAL"
    | "JUNIOR"
    | "SUPERVISOR";
  createdAt: string;
}

export interface CreateMatterAssignmentRequest {
  data: {
    userId: string;
    assignmentRole:
      | "PRIMARY_ADVOCATE"
      | "CO_ADVOCATE"
      | "PARALEGAL"
      | "JUNIOR"
      | "SUPERVISOR";
  };
}
