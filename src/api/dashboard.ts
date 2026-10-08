import { useQuery } from "@tanstack/react-query";

import { api } from "@/shared/service/service-api";
import { LawFirmCRMClient } from "@/shared/service/service-axios";
import { ApiResponse } from "@/shared/types/response";

// ════════════════════════════════════════════════════════════════════════════
// ROLE-SPECIFIC DASHBOARDS
//
// Four purpose-built dashboards share ONE module permission
// (`DASHBOARD_MANAGEMENT` + `VIEW`). The authenticated user's role decides
// which endpoint is called and which UI is rendered — it is not a security
// boundary, the backend enforces role guards and data scoping.
//
//   SUPER_ADMIN          → GET dashboard/super-admin
//   FIRM_ADMIN           → GET dashboard/firm
//   ADVOCATE | PARALEGAL → GET dashboard/employee
//   CLIENT               → GET dashboard/client
// ════════════════════════════════════════════════════════════════════════════

// ─── Shared building blocks ────────────────────────────────────────────────

/** A single row in any dashboard activity/update feed. */
export interface DashboardActivityItem {
  summary?: string;
  action?: string;
  entityType?: string;
  userName?: string;
  createdAt?: string;
}

/**
 * A scheduled court event (hearing / Tarik / Peshi) or deadline.
 * Fields mirror the court event payload used across the app.
 */
export interface DashboardEventItem {
  eventId?: string;
  ourCourtCaseRef?: string | null;
  matterNumber?: string;
  matterTitle?: string;
  eventType?: string;
  scheduledDate?: string | null;
  scheduledTime?: string | null;
  endTime?: string | null;
  status?: string;
  courtRoom?: string | null;
  courtName?: string | null;
  judgeName?: string | null;
  attendingAdvocateName?: string | null;
  purpose?: string | null;
}

/** A matter row on the client dashboard. */
export interface DashboardMatterSummary {
  matterId?: string;
  matterNumber?: string;
  matterTitle?: string;
  matterType?: string;
  matterStatus?: string;
  courtName?: string | null;
  stage?: string | null;
  nextEventDate?: string | null;
}

/** A point in a time series (trend charts). */
export interface DashboardTrendPoint {
  date?: string;
  totalMatters?: number;
  activeMatters?: number;
  closedMatters?: number;
  staleMatters?: number;
}

/** `{ role, count }` entries for the user distribution breakdown. */
export interface RoleCountItem {
  label: string;
  value: number;
}

/**
 * The backend has not fixed the exact shape of `byRole`, so accept either a
 * map (`{ ADVOCATE: 4 }`) or a list of role entries and normalise both.
 */
export type RoleCountsInput =
  | Array<{
      role?: string;
      roleName?: string;
      name?: string;
      code?: string;
      count?: number;
      total?: number;
      value?: number;
    }>
  | Record<string, number>
  | null
  | undefined;

export interface InvoiceStats {
  totalInvoices?: number;
  paidInvoices?: number;
  unpaidInvoices?: number;
  overdueInvoices?: number;
  totalAmount?: number;
  paidAmount?: number;
  outstandingAmount?: number;
  overdueAmount?: number;
}

export interface DashboardInvoiceItem {
  invoiceId?: string;
  invoiceNumber?: string;
  clientName?: string;
  amount?: number;
  currency?: string;
  dueDate?: string | null;
  status?: string;
}

export interface DashboardRenewalItem {
  renewalId?: string;
  projectCode?: string;
  projectName?: string;
  renewalType?: string;
  clientName?: string;
  dueDate?: string | null;
  expiryDate?: string | null;
  status?: string;
}

export interface DashboardRenewalStats {
  totalRenewals?: number;
  dueThisMonth?: number;
  overdueRenewals?: number;
  upcomingRenewals?: number;
}

export interface DashboardCaseloadItem {
  userId?: string;
  userName?: string;
  role?: string;
  totalMatters?: number;
  openMatters?: number;
  activeMatters?: number;
  hearingsThisWeek?: number;
}

// ─── Super Admin ───────────────────────────────────────────────────────────

export interface SuperAdminFirmStats {
  totalFirms?: number;
  activeFirms?: number;
  suspendedFirms?: number;
  trialFirms?: number;
}

export interface SuperAdminUserStats {
  totalUsers?: number;
  activeUsers?: number;
  byRole?: RoleCountsInput;
}

export interface SuperAdminCaseStats {
  totalMatters?: number;
  activeMatters?: number;
  closedMatters?: number;
}

export interface SuperAdminScraperStats {
  courtsTracked?: number;
  totalHearings?: number;
  totalMatches?: number;
  lastScrapeTime?: string | null;
}

export interface SuperAdminTrialAlerts {
  expiringThisWeek?: number;
  expired?: number;
}

export interface SuperAdminDashboardData {
  firmStats: SuperAdminFirmStats;
  userStats: SuperAdminUserStats;
  caseStats: SuperAdminCaseStats;
  scraperStats: SuperAdminScraperStats;
  trialAlerts: SuperAdminTrialAlerts;
  recentActivity: DashboardActivityItem[];
  matterTrends: DashboardTrendPoint[];
}

// ─── Firm Admin ────────────────────────────────────────────────────────────

export interface FirmCaseStats {
  totalMatters?: number;
  activeMatters?: number;
  dormantMatters?: number;
  closedMatters?: number;
  staleMatters?: number;
}

export interface FirmAdminDashboardData {
  caseStats: FirmCaseStats;
  todayEvents: DashboardEventItem[];
  upcomingHearings: DashboardEventItem[];
  invoiceStats: InvoiceStats;
  overdueInvoices: DashboardInvoiceItem[];
  renewalStats: DashboardRenewalStats;
  upcomingRenewals: DashboardRenewalItem[];
  teamCaseload: DashboardCaseloadItem[];
  recentActivity: DashboardActivityItem[];
}

// ─── Employee (ADVOCATE / PARALEGAL) ───────────────────────────────────────

export interface MyCaseStats {
  openMatters?: number;
  upcomingHearings?: number;
  staleMatters?: number;
}

export interface EmployeeDashboardData {
  myCaseStats: MyCaseStats;
  myTodayEvents: DashboardEventItem[];
  myUpcomingHearings: DashboardEventItem[];
  myUpcomingDeadlines: DashboardEventItem[];
  myStaleMatters: DashboardMatterSummary[];
  recentUpdates: DashboardActivityItem[];
}

// ─── Client ────────────────────────────────────────────────────────────────

export interface MyMatterStats {
  totalMatters?: number;
  activeMatters?: number;
  closedMatters?: number;
}

export interface ClientDashboardData {
  myMatterStats: MyMatterStats;
  myMatters: DashboardMatterSummary[];
  myNextHearing: DashboardEventItem | null;
  myUpcomingEvents: DashboardEventItem[];
  myInvoiceStats: InvoiceStats;
  myOutstandingInvoices: DashboardInvoiceItem[];
  myRecentUpdates: DashboardActivityItem[];
}

// ─── Query keys ────────────────────────────────────────────────────────────

export const dashboardKeys = {
  superAdmin: ["dashboard", "super-admin"] as const,
  firm: ["dashboard", "firm"] as const,
  employee: ["dashboard", "employee"] as const,
  client: ["dashboard", "client"] as const,
};

// ─── Normalisation ─────────────────────────────────────────────────────────
// Every normaliser returns a fully-shaped object so components never have to
// guard nested access. Numbers are preserved as-is (never defaulted) so the UI
// only renders metrics the backend actually returned.

const toArray = <T>(value: T[] | null | undefined): T[] =>
  Array.isArray(value) ? value : [];

const toObject = <T extends object>(value: T | null | undefined): T =>
  (value && typeof value === "object" ? value : {}) as T;

/** Normalise `byRole` from either a map or a list of role entries. */
export const toRoleCounts = (input: RoleCountsInput): RoleCountItem[] => {
  if (!input) return [];

  if (Array.isArray(input)) {
    return input
      .map((entry) => {
        const label =
          entry.roleName ?? entry.role ?? entry.name ?? entry.code ?? "";
        const value = entry.count ?? entry.total ?? entry.value;
        if (!label || typeof value !== "number") return null;
        return { label, value };
      })
      .filter((item): item is RoleCountItem => item !== null);
  }

  return Object.entries(input)
    .filter(([, value]) => typeof value === "number")
    .map(([label, value]) => ({ label, value }));
};

export const normalizeSuperAdminDashboard = (
  data: SuperAdminDashboardData | null | undefined
): SuperAdminDashboardData => ({
  firmStats: toObject(data?.firmStats),
  userStats: toObject(data?.userStats),
  caseStats: toObject(data?.caseStats),
  scraperStats: toObject(data?.scraperStats),
  trialAlerts: toObject(data?.trialAlerts),
  recentActivity: toArray(data?.recentActivity),
  matterTrends: toArray(data?.matterTrends),
});

export const normalizeFirmAdminDashboard = (
  data: FirmAdminDashboardData | null | undefined
): FirmAdminDashboardData => ({
  caseStats: toObject(data?.caseStats),
  todayEvents: toArray(data?.todayEvents),
  upcomingHearings: toArray(data?.upcomingHearings),
  invoiceStats: toObject(data?.invoiceStats),
  overdueInvoices: toArray(data?.overdueInvoices),
  renewalStats: toObject(data?.renewalStats),
  upcomingRenewals: toArray(data?.upcomingRenewals),
  teamCaseload: toArray(data?.teamCaseload),
  recentActivity: toArray(data?.recentActivity),
});

export const normalizeEmployeeDashboard = (
  data: EmployeeDashboardData | null | undefined
): EmployeeDashboardData => ({
  myCaseStats: toObject(data?.myCaseStats),
  myTodayEvents: toArray(data?.myTodayEvents),
  myUpcomingHearings: toArray(data?.myUpcomingHearings),
  myUpcomingDeadlines: toArray(data?.myUpcomingDeadlines),
  myStaleMatters: toArray(data?.myStaleMatters),
  recentUpdates: toArray(data?.recentUpdates),
});

export const normalizeClientDashboard = (
  data: ClientDashboardData | null | undefined
): ClientDashboardData => ({
  myMatterStats: toObject(data?.myMatterStats),
  myMatters: toArray(data?.myMatters),
  myNextHearing: data?.myNextHearing ?? null,
  myUpcomingEvents: toArray(data?.myUpcomingEvents),
  myInvoiceStats: toObject(data?.myInvoiceStats),
  myOutstandingInvoices: toArray(data?.myOutstandingInvoices),
  myRecentUpdates: toArray(data?.myRecentUpdates),
});

// ─── Services ──────────────────────────────────────────────────────────────

export const getSuperAdminDashboard = () =>
  LawFirmCRMClient.get<ApiResponse<SuperAdminDashboardData>>(
    api.DASHBOARD.SUPER_ADMIN
  );

export const getFirmAdminDashboard = () =>
  LawFirmCRMClient.get<ApiResponse<FirmAdminDashboardData>>(
    api.DASHBOARD.FIRM_ADMIN
  );

export const getEmployeeDashboard = () =>
  LawFirmCRMClient.get<ApiResponse<EmployeeDashboardData>>(
    api.DASHBOARD.EMPLOYEE
  );

export const getClientDashboard = () =>
  LawFirmCRMClient.get<ApiResponse<ClientDashboardData>>(api.DASHBOARD.CLIENT);

// ─── Query hooks ───────────────────────────────────────────────────────────
// Each hook calls exactly one endpoint. `enabled` lets a caller keep a hook
// mounted without firing it, so only the role-matching request is ever sent.

export const useSuperAdminDashboardQuery = (options?: {
  enabled?: boolean;
}) => {
  return useQuery({
    queryKey: dashboardKeys.superAdmin,
    queryFn: async () => {
      const res = await getSuperAdminDashboard();
      return normalizeSuperAdminDashboard(res.data?.data);
    },
    enabled: options?.enabled ?? true,
  });
};

export const useFirmAdminDashboardQuery = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: dashboardKeys.firm,
    queryFn: async () => {
      const res = await getFirmAdminDashboard();
      return normalizeFirmAdminDashboard(res.data?.data);
    },
    enabled: options?.enabled ?? true,
  });
};

export const useEmployeeDashboardQuery = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: dashboardKeys.employee,
    queryFn: async () => {
      const res = await getEmployeeDashboard();
      return normalizeEmployeeDashboard(res.data?.data);
    },
    enabled: options?.enabled ?? true,
  });
};

export const useClientDashboardQuery = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: dashboardKeys.client,
    queryFn: async () => {
      const res = await getClientDashboard();
      return normalizeClientDashboard(res.data?.data);
    },
    enabled: options?.enabled ?? true,
  });
};
