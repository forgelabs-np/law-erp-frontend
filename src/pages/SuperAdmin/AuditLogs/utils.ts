import { AUDIT_ACTIONS, AuditAction, AuditLog, EntityType } from "./types";

// ─── Label formatting ─────────────────────────────────────────────────────────

const ACRONYMS = new Set([
  "MFA",
  "IP",
  "ID",
  "API",
  "OTP",
  "URL",
  "PDF",
  "CRM",
]);

const toTitleCase = (value: string): string =>
  value
    .split("_")
    .filter(Boolean)
    .map((word) => {
      const upper = word.toUpperCase();
      if (ACRONYMS.has(upper)) return upper;
      return upper.charAt(0) + upper.slice(1).toLowerCase();
    })
    .join(" ");

/**
 * "USER_PERMISSION_CHANGED" -> "User Permission Changed".
 * Single source of truth used by badges, filters and details so actions are
 * never formatted independently in each component.
 */
export const formatAuditAction = (action: AuditAction | string): string =>
  action ? toTitleCase(action) : action;

/** "FIRM_MODULE" -> "Firm Module" (used for entity labels). */
export const formatEntityTypeLabel = (
  entityType: EntityType | string
): string => (entityType ? toTitleCase(entityType) : entityType);

// ─── Action presentation ──────────────────────────────────────────────────────

export interface AuditActionStyle {
  color: string;
  background: string;
  icon: string;
  labelColor: string;
}

/**
 * Hand-picked styles for well-known actions. Actions without an entry fall
 * back to a tone/icon derived from the action name below, so newly added
 * backend actions still render consistently.
 */
const ACTION_STYLE_OVERRIDES: Partial<Record<AuditAction, AuditActionStyle>> = {
  LOGIN: {
    color: "blue",
    background: "blue.50",
    icon: "LogIn",
    labelColor: "blue.700",
  },
  LOGOUT: {
    color: "gray",
    background: "gray.50",
    icon: "LogOut",
    labelColor: "gray.700",
  },
  LOGIN_FAILED: {
    color: "red",
    background: "red.50",
    icon: "XCircle",
    labelColor: "red.700",
  },
  PASSWORD_CHANGED: {
    color: "blue",
    background: "blue.50",
    icon: "Key",
    labelColor: "blue.700",
  },
  USER_CREATED: {
    color: "green",
    background: "green.50",
    icon: "UserPlus",
    labelColor: "green.700",
  },
  USER_UPDATED: {
    color: "blue",
    background: "blue.50",
    icon: "UserCog",
    labelColor: "blue.700",
  },
  USER_DELETED: {
    color: "red",
    background: "red.50",
    icon: "UserMinus",
    labelColor: "red.700",
  },
  CLIENT_CREATED: {
    color: "green",
    background: "green.50",
    icon: "UserPlus",
    labelColor: "green.700",
  },
  CLIENT_UPDATED: {
    color: "blue",
    background: "blue.50",
    icon: "UserCog",
    labelColor: "blue.700",
  },
  CLIENT_DELETED: {
    color: "red",
    background: "red.50",
    icon: "UserMinus",
    labelColor: "red.700",
  },
  CASE_CREATED: {
    color: "green",
    background: "green.50",
    icon: "FilePlus",
    labelColor: "green.700",
  },
  CASE_UPDATED: {
    color: "blue",
    background: "blue.50",
    icon: "FileEdit",
    labelColor: "blue.700",
  },
  CASE_DELETED: {
    color: "red",
    background: "red.50",
    icon: "FileX",
    labelColor: "red.700",
  },
  DOCUMENT_UPLOADED: {
    color: "green",
    background: "green.50",
    icon: "Upload",
    labelColor: "green.700",
  },
  DOCUMENT_DELETED: {
    color: "red",
    background: "red.50",
    icon: "Trash2",
    labelColor: "red.700",
  },
  PAYMENT_RECORDED: {
    color: "green",
    background: "green.50",
    icon: "DollarSign",
    labelColor: "green.700",
  },
  FIRM_CREATED: {
    color: "green",
    background: "green.50",
    icon: "Building2",
    labelColor: "green.700",
  },
  FIRM_UPDATED: {
    color: "blue",
    background: "blue.50",
    icon: "Building2",
    labelColor: "blue.700",
  },
  FIRM_DELETED: {
    color: "red",
    background: "red.50",
    icon: "Building2",
    labelColor: "red.700",
  },
  ROLE_CREATED: {
    color: "green",
    background: "green.50",
    icon: "ShieldPlus",
    labelColor: "green.700",
  },
  ROLE_UPDATED: {
    color: "blue",
    background: "blue.50",
    icon: "Shield",
    labelColor: "blue.700",
  },
  ROLE_DELETED: {
    color: "red",
    background: "red.50",
    icon: "ShieldMinus",
    labelColor: "red.700",
  },
  PERMISSION_GRANTED: {
    color: "purple",
    background: "purple.50",
    icon: "ShieldCheck",
    labelColor: "purple.700",
  },
  PERMISSION_REVOKED: {
    color: "orange",
    background: "orange.50",
    icon: "ShieldX",
    labelColor: "orange.700",
  },
  PERMISSION_REVoked: {
    color: "orange",
    background: "orange.50",
    icon: "ShieldX",
    labelColor: "orange.700",
  },
};

const hasRedTone = (action: string): boolean =>
  /FAILED|DELETED|CANCELLED|REVOKED|DEACTIVATED|DISABLED|SUSPENDED/.test(
    action
  ) ||
  (/BLOCKED/.test(action) && !/UNBLOCKED/.test(action));

const hasGreenTone = (action: string): boolean =>
  /CREATED|UPLOADED|APPROVED|COMPLETED|RECORDED|ASSIGNED|GRANTED|HELD|FILED|SENT|ACTIVATED|ENABLED|ADDED/.test(
    action
  );

const hasBlueTone = (action: string): boolean =>
  /UPDATED|CHANGED|SCHEDULED|CONFIGURED|TESTED|REFRESHED|REVEALED|SHARED|REOPENED|RESET|ADJOURNED|UNBLOCKED/.test(
    action
  );

const TONE_STYLES: Record<
  "red" | "green" | "blue",
  Omit<AuditActionStyle, "icon">
> = {
  red: { color: "red", background: "red.50", labelColor: "red.700" },
  green: { color: "green", background: "green.50", labelColor: "green.700" },
  blue: { color: "blue", background: "blue.50", labelColor: "blue.700" },
};

const CATEGORY_ICONS: Array<{ prefix: string; icon: string }> = [
  { prefix: "LOGIN", icon: "LogIn" },
  { prefix: "LOGOUT", icon: "LogOut" },
  { prefix: "PASSWORD", icon: "Key" },
  { prefix: "TOKEN", icon: "RefreshCw" },
  { prefix: "MFA", icon: "ShieldCheck" },
  { prefix: "USER", icon: "User" },
  { prefix: "CLIENT", icon: "User" },
  { prefix: "ROLE", icon: "Shield" },
  { prefix: "PERMISSION", icon: "ShieldCheck" },
  { prefix: "MODULE", icon: "LayoutGrid" },
  { prefix: "FIRM", icon: "Building2" },
  { prefix: "CASE", icon: "Briefcase" },
  { prefix: "MATTER", icon: "Briefcase" },
  { prefix: "COURT", icon: "Scale" },
  { prefix: "HEARING", icon: "Gavel" },
  { prefix: "DOCUMENT", icon: "FileText" },
  { prefix: "INVOICE", icon: "Receipt" },
  { prefix: "PAYMENT", icon: "CreditCard" },
  { prefix: "EMAIL", icon: "Mail" },
  { prefix: "CONFIG", icon: "Settings" },
  { prefix: "SYSTEM", icon: "Settings" },
  { prefix: "PROJECT", icon: "FolderKanban" },
  { prefix: "CREDENTIAL", icon: "KeyRound" },
  { prefix: "RENEWAL", icon: "RefreshCw" },
  { prefix: "DEPARTMENT", icon: "Building2" },
];

const getActionTone = (action: string): Omit<AuditActionStyle, "icon"> => {
  if (hasRedTone(action)) return TONE_STYLES.red;
  if (hasGreenTone(action)) return TONE_STYLES.green;
  if (hasBlueTone(action)) return TONE_STYLES.blue;
  return { color: "gray", background: "gray.50", labelColor: "gray.700" };
};

const getActionCategoryIcon = (action: string): string => {
  const prefix = action.split("_")[0] ?? "";
  return (
    CATEGORY_ICONS.find((entry) => entry.prefix === prefix)?.icon ?? "Activity"
  );
};

export const getAuditActionStyle = (action: AuditAction): AuditActionStyle => {
  const override = ACTION_STYLE_OVERRIDES[action];
  if (override) return override;

  const tone = getActionTone(action);
  return {
    ...tone,
    icon: getActionCategoryIcon(action),
  };
};

export const getActionBadgeColor = (action: AuditAction): string => {
  const style = getAuditActionStyle(action);
  return style.color;
};

export const truncateSummary = (
  summary: string,
  maxLength: number = 50
): string => {
  if (!summary || summary.length <= maxLength) return summary;
  return summary.substring(0, maxLength) + "...";
};

/**
 * Filter dropdown options. Labels are human readable ("Case Updated") while
 * values stay the raw backend codes; reused by every audit view so no second
 * list of actions is maintained.
 */
export const ACTION_OPTIONS = [
  { label: "All", value: "" },
  ...AUDIT_ACTIONS.map((action) => ({
    label: formatAuditAction(action),
    value: action,
  })),
];

// ─── Date grouping ────────────────────────────────────────────────────────────

export const formatAuditDate = (
  dateString: string
): { date: string; time: string } => {
  const date = new Date(dateString);

  const dateOptions: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "short",
    year: "numeric",
  };

  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };

  return {
    date: date.toLocaleDateString("en-GB", dateOptions),
    time: date.toLocaleTimeString("en-US", timeOptions),
  };
};

export const groupAuditLogsByDate = (logs: AuditLog[]) => {
  const groups: Record<string, AuditLog[]> = {};

  logs.forEach((log) => {
    const date = new Date(log.createdAt);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    let dateKey: string;

    if (date.toDateString() === today.toDateString()) {
      dateKey = "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      dateKey = "Yesterday";
    } else {
      dateKey = date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });
    }

    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(log);
  });

  return groups;
};
