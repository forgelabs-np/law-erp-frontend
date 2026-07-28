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

export const getAuditActionStyle = (action: AuditAction) => {
  const styleMap: Record<
    AuditAction,
    { color: string; background: string; icon: string; labelColor: string }
  > = {
    LOGIN: { color: "blue", background: "blue.50", icon: "LogIn", labelColor: "blue.700" },
    LOGOUT: { color: "gray", background: "gray.50", icon: "LogOut", labelColor: "gray.700" },
    LOGIN_FAILED: { color: "red", background: "red.50", icon: "XCircle", labelColor: "red.700" },
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
    PERMISSION_REVoked: {
      color: "orange",
      background: "orange.50",
      icon: "ShieldX",
      labelColor: "orange.700",
    },
  };

  return (
    styleMap[action] || {
      color: "gray",
      background: "gray.50",
      icon: "Activity",
      labelColor: "gray.700",
    }
  );
};

export const getActionBadgeColor = (action: AuditAction): string => {
  const style = getAuditActionStyle(action);
  return style.color;
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

export const groupAuditLogsByDate = (logs: any[]) => {
  const groups: Record<string, any[]> = {};

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
