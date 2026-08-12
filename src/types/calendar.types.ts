export type TaskStatus = "todo" | "in_progress" | "completed";

export interface Task {
  id: string;
  title: string;
  dueDate: string;
  status: TaskStatus;
  matterId?: string;
}

export interface CalendarEvent {
  id: string;
  caseId: string;
  caseNumber: string;
  caseTitle: string;
  title: string;
  date: string;
  time: string;
  endTime: string;
  courtRoom: string;
  hearingType: string;
  status: string;
  advocateId: string;
  color?: "blue" | "green" | "purple" | "orange";
  subtitle?: string;
}
