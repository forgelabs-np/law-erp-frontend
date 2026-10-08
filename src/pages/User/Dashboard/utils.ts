import { format, parseISO } from "date-fns";

import { DashboardEventItem } from "@/api/dashboard";
import { priceWithComma } from "@/shared/utils/priceWithComma";
import { resolveRoleCode } from "@/shared/utils/role";

// ════════════════════════════════════════════════════════════════════════════
// ROLE → DASHBOARD RESOLUTION
//
// A single mapping decides which endpoint is called and which dashboard UI is
// rendered. Permission (`DASHBOARD_MANAGEMENT` + `VIEW`) decides whether the
// user can reach the dashboard at all — see ModuleRouteGuard.
// ════════════════════════════════════════════════════════════════════════════

/** The five roles the backend can authenticate. */
export type DashboardRole =
  | "SUPER_ADMIN"
  | "FIRM_ADMIN"
  | "ADVOCATE"
  | "PARALEGAL"
  | "CLIENT";

/** The four dashboards. ADVOCATE and PARALEGAL share the employee dashboard. */
export type DashboardKind =
  | "SUPER_ADMIN"
  | "FIRM_ADMIN"
  | "EMPLOYEE"
  | "CLIENT";

export const ROLE_TO_DASHBOARD: Record<DashboardRole, DashboardKind> = {
  SUPER_ADMIN: "SUPER_ADMIN",
  FIRM_ADMIN: "FIRM_ADMIN",
  ADVOCATE: "EMPLOYEE",
  PARALEGAL: "EMPLOYEE",
  CLIENT: "CLIENT",
};

const KNOWN_ROLES: DashboardRole[] = [
  "SUPER_ADMIN",
  "FIRM_ADMIN",
  "ADVOCATE",
  "PARALEGAL",
  "CLIENT",
];

/**
 * Resolve the dashboard role from whatever the auth store holds.
 * Returns `null` when the role is missing or not one we have a dashboard for —
 * callers must NOT fall back to another role's dashboard.
 */
export const resolveDashboardRole = (role: unknown): DashboardRole | null => {
  const code = resolveRoleCode(role).trim().toUpperCase().replace(/\s+/g, "_");
  if (!code) return null;
  return KNOWN_ROLES.find((known) => known === code) ?? null;
};

// ─── Formatting helpers ────────────────────────────────────────────────────

/** True only for real, finite numbers — never for `undefined`/`null`. */
export const isMetric = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value);

export const formatMetric = (value: number | undefined | null): string =>
  isMetric(value) ? String(value) : "—";

export const formatAmount = (
  value: number | undefined | null,
  currency = "NPR"
): string => {
  if (!isMetric(value)) return "—";
  return `${currency} ${priceWithComma(value)}`;
};

/** `ACTIVE` → `Active`, `IN_REVIEW` → `In Review`. */
export const humanizeLabel = (value?: string | null): string => {
  if (!value) return "";
  return value
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

/** HTTP status of an API error, when present. */
export const getErrorStatus = (error: unknown): number | null => {
  const candidate = error as { response?: { status?: number } };
  return typeof candidate?.response?.status === "number"
    ? candidate.response.status
    : null;
};

/** Human-readable message from an API error, with a safe fallback. */
export const getDashboardErrorMessage = (error: unknown): string => {
  const candidate = error as {
    response?: {
      data?: { message?: string; error?: { errorMessage?: string } };
    };
  };
  return (
    candidate?.response?.data?.message ??
    candidate?.response?.data?.error?.errorMessage ??
    "Something went wrong while loading your dashboard. Please try again."
  );
};

/** `active / total` as a whole-number percentage (0 when total is 0). */
export const percentOf = (
  value: number | undefined | null,
  total: number | undefined | null
): number => {
  if (!isMetric(value) || !isMetric(total) || total <= 0) return 0;
  return Math.min(100, Math.round((value / total) * 100));
};

export interface DayBar {
  label: string;
  value: number;
  tooltipLabel: string;
}

/**
 * Group scheduled items into per-day counts for the dashboard bar charts.
 * Only days that actually have events are returned — nothing is invented.
 */
export const groupEventsByDay = (
  events: DashboardEventItem[],
  maxDays = 10
): DayBar[] => {
  const counts = new Map<string, number>();

  events.forEach((event) => {
    if (!event.scheduledDate) return;
    counts.set(event.scheduledDate, (counts.get(event.scheduledDate) ?? 0) + 1);
  });

  return [...counts.entries()]
    .sort(([left], [right]) => left.localeCompare(right))
    .slice(0, maxDays)
    .map(([date, count]) => {
      const parsed = parseISO(date);
      const valid = !Number.isNaN(parsed.getTime());
      return {
        label: valid ? format(parsed, "dd MMM") : date,
        value: count,
        tooltipLabel: valid ? format(parsed, "EEE dd MMM yyyy") : date,
      };
    });
};

/** Whole days from today until `value` (negative when in the past). */
export const daysUntil = (value?: string | null): number | null => {
  if (!value) return null;
  const date = parseISO(value);
  if (Number.isNaN(date.getTime())) return null;
  const today = new Date();
  return Math.round(
    (new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime() -
      new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
      ).getTime()) /
      86400000
  );
};

/** "Today" / "Tomorrow" / "In 4 days" for a scheduled date. */
export const relativeDayLabel = (value?: string | null): string => {
  const days = daysUntil(value);
  if (days === null) return "Scheduled";
  if (days === 0) return "Today";
  if (days === 1) return "Tomorrow";
  if (days < 0) return `${Math.abs(days)} days ago`;
  return `In ${days} days`;
};

export interface DateParts {
  day: string;
  month: string;
  year: string;
}

/** Split an ISO date into display parts. Returns `null` for invalid input. */
export const toDateParts = (value?: string | null): DateParts | null => {
  if (!value) return null;
  const date = parseISO(value);
  if (Number.isNaN(date.getTime())) return null;
  return {
    day: format(date, "dd"),
    month: format(date, "MMM").toUpperCase(),
    year: format(date, "yyyy"),
  };
};
