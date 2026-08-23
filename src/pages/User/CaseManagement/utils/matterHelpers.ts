import { format, parseISO } from "date-fns";

import { ApiErrorResponse } from "@/shared/types/response";

import {
  CourtCaseStage,
  CourtCaseStatus,
  CourtEventStatus,
  CourtEventType,
  MatterStatus,
  MatterType,
  NextEventType,
  OutcomeType,
  PartyRepresentation,
  PartyType,
  RelationType,
  TimelineEventType,
} from "../types/matter.types";

/** Extract the user-facing backend message from an API error. */
export const getApiErrorMessage = (
  error: ApiErrorResponse | null | undefined,
  fallback: string
): string => {
  return (
    error?.response?.data?.message ??
    error?.response?.data?.error?.errorMessage ??
    fallback
  );
};

export const formatDate = (value?: string | null): string => {
  if (!value) return "-";
  const date = parseISO(value);
  if (Number.isNaN(date.getTime())) return value;
  return format(date, "dd MMM yyyy");
};

export const formatDateTime = (value?: string | null): string => {
  if (!value) return "-";
  const date = parseISO(value);
  if (Number.isNaN(date.getTime())) return value;
  return format(date, "dd MMM yyyy, h:mm a");
};

export const formatTime = (value?: string | null): string => {
  if (!value) return "-";
  // API time strings look like "10:30:00"
  const [, hour = "", minute = ""] = value.split(":");
  if (!hour) return value;
  return `${hour}:${minute}`;
};

const toLabel = (value: string) =>
  value
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());

export const matterTypeLabel = (type?: MatterType | null): string => {
  if (!type) return "-";
  return type === "CIVIL" ? "Civil" : "Criminal";
};

export const matterStatusLabel = (status?: MatterStatus | null): string => {
  if (!status) return "-";
  return toLabel(status);
};

export const relationTypeLabel = (relation?: RelationType | null): string => {
  if (!relation) return "-";
  return toLabel(relation);
};

export const partyTypeLabel = (type?: PartyType | null): string => {
  if (!type) return "-";
  return toLabel(type);
};

export const representationLabel = (
  representation?: PartyRepresentation | null
): string => {
  if (!representation) return "-";
  return toLabel(representation);
};

export const courtCaseStatusLabel = (
  status?: CourtCaseStatus | null
): string => {
  if (!status) return "-";
  return toLabel(status);
};

export const courtCaseStageLabel = (stage?: CourtCaseStage | null): string => {
  if (!stage) return "-";
  return toLabel(stage);
};

export const courtEventTypeLabel = (type?: CourtEventType | null): string => {
  if (!type) return "-";
  return toLabel(type);
};

export const courtEventStatusLabel = (
  status?: CourtEventStatus | null
): string => {
  if (!status) return "-";
  return toLabel(status);
};

export const outcomeTypeLabel = (type?: OutcomeType | null): string => {
  if (!type) return "-";
  return toLabel(type);
};

export const nextEventTypeLabel = (type?: NextEventType | null): string => {
  if (!type) return "-";
  return toLabel(type);
};

export const timelineEventTypeLabel = (
  type?: TimelineEventType | null
): string => {
  if (!type) return "-";
  return toLabel(type);
};

/** Badge color scheme per entity status (used with Chakra Badge). */
export const matterStatusColorScheme = (status: MatterStatus): string => {
  switch (status) {
    case "ACTIVE":
      return "green";
    case "DORMANT":
      return "yellow";
    case "CLOSED":
      return "gray";
  }
};

export const matterTypeColorScheme = (type: MatterType): string => {
  return type === "CIVIL" ? "blue" : "red";
};

export const courtCaseStatusColorScheme = (status: CourtCaseStatus): string => {
  switch (status) {
    case "ACTIVE":
      return "green";
    case "JUDGMENT_AWAITED":
      return "yellow";
    case "DECIDED":
      return "teal";
    case "APPEALED":
      return "purple";
    case "REMANDED":
      return "orange";
    case "CLOSED":
      return "gray";
    case "WITHDRAWN":
      return "gray";
  }
};

export const courtEventStatusColorScheme = (
  status: CourtEventStatus
): string => {
  switch (status) {
    case "SCHEDULED":
      return "blue";
    case "HELD":
      return "green";
    case "ADJOURNED":
      return "orange";
    case "CANCELED":
      return "red";
  }
};

export const relationTypeColorScheme = (relation: RelationType): string => {
  switch (relation) {
    case "ORIGINAL":
      return "blue";
    case "APPEAL":
      return "purple";
    case "CROSS_APPEAL":
      return "purple";
    case "REMAND":
      return "orange";
    case "REVISION":
      return "teal";
    case "WRIT":
      return "red";
    case "REVIEW":
      return "cyan";
  }
};

export const confidenceColorScheme = (confidence: string): string => {
  switch (confidence) {
    case "HIGH":
      return "green";
    case "MEDIUM":
      return "yellow";
    default:
      return "gray";
  }
};

/**
 * Stage choices offered to the user for a matter type.
 *
 * This is intentionally a *suggestion* list: the backend remains the
 * single authority on legal transitions and returns a business-rule error
 * (shown in a toast) when a transition is not allowed.
 */
export const getStageOptions = (matterType: MatterType): CourtCaseStage[] => {
  const shared: CourtCaseStage[] = [
    "FILED",
    "JUDGMENT_AWAITED",
    "JUDGMENT_DELIVERED",
    "APPEAL",
    "EXECUTION",
    "CLOSED",
  ];

  if (matterType === "CIVIL") {
    return [
      ...shared,
      "UNDER_SUMMONS",
      "RESPONSE_PENDING",
      "MEDIATION",
      "EVIDENCE",
      "ARGUMENT",
    ];
  }

  return [
    ...shared,
    "FIR_REGISTERED",
    "UNDER_INVESTIGATION",
    "CHARGE_SHEET_FILED",
    "PLEA",
    "TRIAL",
    "SENTENCING",
  ];
};

/** Human readable default title for a court event. */
export const courtEventTitle = (event: {
  eventType: CourtEventType;
  scheduledDate: string;
}): string => {
  return `${courtEventTypeLabel(event.eventType)} · ${formatDate(
    event.scheduledDate
  )}`;
};
