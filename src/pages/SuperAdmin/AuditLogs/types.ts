export type AuditAction =
  | "LOGIN"
  | "LOGOUT"
  | "LOGIN_FAILED"
  | "PASSWORD_CHANGED"
  | "USER_CREATED"
  | "USER_UPDATED"
  | "USER_DELETED"
  | "CLIENT_CREATED"
  | "CLIENT_UPDATED"
  | "CLIENT_DELETED"
  | "CASE_CREATED"
  | "CASE_UPDATED"
  | "CASE_DELETED"
  | "DOCUMENT_UPLOADED"
  | "DOCUMENT_DELETED"
  | "PAYMENT_RECORDED"
  | "FIRM_CREATED"
  | "FIRM_UPDATED"
  | "FIRM_DELETED"
  | "ROLE_CREATED"
  | "ROLE_UPDATED"
  | "ROLE_DELETED"
  | "PERMISSION_GRANTED"
  | "PERMISSION_REVoked";

export type EntityType =
  | "USER"
  | "CLIENT"
  | "CASE"
  | "DOCUMENT"
  | "FIRM"
  | "ROLE"
  | "MODULE"
  | "PERMISSION";

export type UserType = "SUPER_ADMIN" | "ADMIN" | "LAWYER" | "CLIENT" | "STAFF";

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
  content: AuditLog[];
}

export interface AuditFilters {
  action?: AuditAction;
  fromDate?: string;
  toDate?: string;
  page: number;
  size: number;
}
