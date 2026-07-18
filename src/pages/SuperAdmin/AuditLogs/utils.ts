import { AuditAction } from "./types";

export const formatAuditDate = (dateString: string): { date: string; time: string } => {
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

export const getActionBadgeColor = (action: AuditAction): string => {
  const createActions: AuditAction[] = [
    "LOGIN",
    "USER_CREATED",
    "CLIENT_CREATED",
    "CASE_CREATED",
    "FIRM_CREATED",
    "ROLE_CREATED",
    "DOCUMENT_UPLOADED",
  ];
  
  const updateActions: AuditAction[] = [
    "USER_UPDATED",
    "CLIENT_UPDATED",
    "CASE_UPDATED",
    "FIRM_UPDATED",
    "ROLE_UPDATED",
    "PASSWORD_CHANGED",
  ];
  
  const statusActions: AuditAction[] = [
    "PERMISSION_GRANTED",
    "PERMISSION_REVoked",
  ];
  
  const deleteActions: AuditAction[] = [
    "USER_DELETED",
    "CLIENT_DELETED",
    "CASE_DELETED",
    "FIRM_DELETED",
    "ROLE_DELETED",
    "DOCUMENT_DELETED",
  ];
  
  if (createActions.includes(action)) return "green";
  if (updateActions.includes(action)) return "blue";
  if (statusActions.includes(action)) return "purple";
  if (deleteActions.includes(action)) return "red";
  
  return "gray";
};

export const truncateSummary = (summary: string, maxLength: number = 50): string => {
  if (!summary || summary.length <= maxLength) return summary;
  return summary.substring(0, maxLength) + "...";
};

export const ACTION_OPTIONS = [
  { label: "All", value: "" },
  { label: "LOGIN", value: "LOGIN" },
  { label: "LOGOUT", value: "LOGOUT" },
  { label: "LOGIN_FAILED", value: "LOGIN_FAILED" },
  { label: "PASSWORD_CHANGED", value: "PASSWORD_CHANGED" },
  { label: "USER_CREATED", value: "USER_CREATED" },
  { label: "USER_UPDATED", value: "USER_UPDATED" },
  { label: "USER_DELETED", value: "USER_DELETED" },
  { label: "CLIENT_CREATED", value: "CLIENT_CREATED" },
  { label: "CLIENT_UPDATED", value: "CLIENT_UPDATED" },
  { label: "CLIENT_DELETED", value: "CLIENT_DELETED" },
  { label: "CASE_CREATED", value: "CASE_CREATED" },
  { label: "CASE_UPDATED", value: "CASE_UPDATED" },
  { label: "CASE_DELETED", value: "CASE_DELETED" },
  { label: "DOCUMENT_UPLOADED", value: "DOCUMENT_UPLOADED" },
  { label: "DOCUMENT_DELETED", value: "DOCUMENT_DELETED" },
  { label: "PAYMENT_RECORDED", value: "PAYMENT_RECORDED" },
  { label: "FIRM_CREATED", value: "FIRM_CREATED" },
  { label: "FIRM_UPDATED", value: "FIRM_UPDATED" },
  { label: "FIRM_DELETED", value: "FIRM_DELETED" },
  { label: "ROLE_CREATED", value: "ROLE_CREATED" },
  { label: "ROLE_UPDATED", value: "ROLE_UPDATED" },
  { label: "ROLE_DELETED", value: "ROLE_DELETED" },
  { label: "PERMISSION_GRANTED", value: "PERMISSION_GRANTED" },
  { label: "PERMISSION_REVoked", value: "PERMISSION_REVoked" },
];
