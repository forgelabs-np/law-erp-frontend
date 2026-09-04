import { ApiResponse } from "@/shared/types/response";

/**
 * Canonical list of audit actions the backend can emit.
 * Used to derive the `AuditAction` union, the action filter dropdown and the
 * per-action presentation defaults so every audit view stays in sync.
 */
export const AUDIT_ACTIONS = [
  // Authentication
  "LOGIN",
  "LOGOUT",
  "LOGIN_FAILED",
  "PASSWORD_CHANGED",
  "TOKEN_REFRESHED",
  "MFA_ENABLED",
  "MFA_RESET",
  // Users & Clients
  "USER_CREATED",
  "USER_UPDATED",
  "USER_DELETED",
  "USER_DEACTIVATED",
  "USER_ACTIVATED",
  "USER_ROLE_CHANGED",
  "USER_BLOCKED",
  "USER_UNBLOCKED",
  "CLIENT_CREATED",
  "CLIENT_UPDATED",
  "CLIENT_DELETED",
  "CLIENT_PORTAL_ENABLED",
  "CLIENT_PORTAL_DISABLED",
  // Cases, Matters & Court
  "CASE_CREATED",
  "CASE_UPDATED",
  "CASE_DELETED",
  "CASE_ASSIGNED",
  "CASE_STATUS_CHANGED",
  "CASE_ARCHIVED",
  "CASE_REOPENED",
  "MATTER_CREATED",
  "MATTER_UPDATED",
  "COURT_CASE_CREATED",
  "COURT_CASE_UPDATED",
  "COURT_CASE_STAGE_CHANGED",
  "COURT_CASE_CLOSED",
  "APPEAL_FILED",
  "JUDGMENT_RECORDED",
  "COURT_EVENT_SCHEDULED",
  "COURT_EVENT_UPDATED",
  "COURT_EVENT_HELD",
  "COURT_EVENT_ADJOURNED",
  "COURT_EVENT_CANCELLED",
  // Documents, Invoices & Payments
  "DOCUMENT_UPLOADED",
  "DOCUMENT_DELETED",
  "DOCUMENT_DOWNLOADED",
  "DOCUMENT_SHARED",
  "INVOICE_CREATED",
  "INVOICE_UPDATED",
  "INVOICE_DELETED",
  "INVOICE_APPROVED",
  "INVOICE_SENT",
  "PAYMENT_RECORDED",
  "HEARING_SCHEDULED",
  "HEARING_UPDATED",
  "HEARING_CANCELLED",
  // Firms
  "FIRM_CREATED",
  "FIRM_UPDATED",
  "FIRM_DELETED",
  "FIRM_SUSPENDED",
  "FIRM_MODULE_ENABLED",
  "FIRM_MODULE_DISABLED",
  "FIRM_MODULE_CONFIGURED",
  // Roles & Permissions
  "ROLE_ASSIGNED",
  "ROLE_UPDATED",
  "ROLE_CREATED",
  "ROLE_DELETED",
  "ROLE_ACTIVATED",
  "ROLE_DEACTIVATED",
  "ROLE_PERMISSION_CHANGED",
  "PERMISSION_CREATED",
  "PERMISSION_DELETED",
  "PERMISSION_ACTIVATED",
  "PERMISSION_DEACTIVATED",
  "PERMISSION_UPDATED",
  "PERMISSION_GRANTED",
  "PERMISSION_REVOKED",
  "PERMISSION_REVoked",
  // Modules
  "MODULE_CREATED",
  "MODULE_ACTIVATED",
  "MODULE_DEACTIVATED",
  "MODULE_UPDATED",
  "MODULE_DELETED",
  // Email & Configuration
  "EMAIL_SENT",
  "EMAIL_FAILED",
  "EMAIL_CONFIG_UPDATED",
  "EMAIL_CONFIG_TESTED",
  "EMAIL_CONFIG_DELETED",
  "CONFIG_UPDATED",
  "CONFIG_DELETED",
  // Projects, Credentials & Renewals
  "PROJECT_CREATED",
  "PROJECT_UPDATED",
  "PROJECT_COMPLETED",
  "CREDENTIAL_ADDED",
  "CREDENTIAL_REVEALED",
  "RENEWAL_CREATED",
  "RENEWAL_COMPLETED",
] as const;

export type AuditAction = (typeof AUDIT_ACTIONS)[number];

/** Entity types the audit entity-history endpoint supports. */
export const AUDIT_ENTITY_TYPES = [
  "USER",
  "CLIENT",
  "FIRM",
  "FIRM_MODULE",
  "ROLE",
  "ROLE_PERMISSION",
  "PERMISSION",
  "MODULE",
  "CASE",
  "DOCUMENT",
  "INVOICE",
  "PAYMENT",
  "HEARING",
  "DEPARTMENT",
  "AUTH",
  "MATTER",
  "COURT_CASE",
  "COURT_EVENT",
  "EMAIL_CONFIG",
  "SYSTEM_CONFIG",
  "PROJECT",
  "CREDENTIAL",
  "RENEWAL",
] as const;

export type EntityType = (typeof AUDIT_ENTITY_TYPES)[number];

export type UserType =
  | "SUPER_ADMIN"
  | "ADMIN"
  | "LAWYER"
  | "CLIENT"
  | "STAFF"
  | "S";

export interface AuditLog {
  id: string;
  firmId: string;
  userId: string;
  userType: UserType;
  action: AuditAction;
  entityType: EntityType;
  entityId: string;
  summary: string;
  ipAddress: string;
  createdAt: string;
}

export interface AuditLogData {
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
  number: number;
  size: number;
  numberOfElements: number;
  empty: boolean;
  content: AuditLog[];
}

export type AuditLogResponse = ApiResponse<AuditLogData>;

/** Shared pagination contract: page is zero-based. */
export interface AuditLogPagination {
  page: number;
  size: number;
}

export interface AuditFilters extends AuditLogPagination {
  action?: AuditAction;
  fromDate?: string;
  toDate?: string;
}

/** GET /super-admin/audit/users/{userId} query parameters. */
export interface UserAuditLogParams extends AuditLogPagination {
  fromDate?: string;
  toDate?: string;
}

/** GET /super-admin/audit/firms/{firmId} query parameters. */
export interface FirmAuditLogParams extends AuditLogPagination {
  action?: AuditAction;
  fromDate?: string;
  toDate?: string;
}

/** GET /super-admin/audit/entities/{entityType}/{entityId} query parameters. */
export type EntityHistoryParams = AuditLogPagination;
