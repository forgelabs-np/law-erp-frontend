import { CourtEventStatus, CourtEventType } from "@/pages/User/CaseManagement/types/matter.types";

export type TaskStatus = "todo" | "in_progress" | "completed";

export interface Task {
  id: string;
  title: string;
  dueDate: string;
  status: TaskStatus;
  matterId?: string;
}

/**
 * A court event (TARIK / PESHI) surfaced through the firm-wide calendar feed.
 * The calendar uses CourtEvent as the source of truth.
 */
export interface CalendarEvent {
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
