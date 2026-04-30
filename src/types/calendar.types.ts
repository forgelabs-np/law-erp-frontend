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
  title: string;
  subtitle?: string;
  date: string;
  startTime: string;
  endTime: string;
  color: "blue" | "green" | "purple" | "orange";
}
