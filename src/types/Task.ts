export type TaskStatus = "Pending" | "In Progress" | "Completed" | "Overdue";
export type TaskPriority = "Low" | "Medium" | "High" | "Critical";
export type TaskType =
  | "Court Hearing"
  | "Client Meeting"
  | "Legal Research"
  | "Filing"
  | "Review"
  | "Internal Task";

export interface Task {
  id: string;
  title: string;
  description?: string;
  taskType: TaskType;
  priority: TaskPriority;
  status: TaskStatus;
  assignedLawyer: string;
  client: string;
  caseName?: string;
  caseNumber?: string;
  startDate: string; // ISO 8601 string or Date
  endDate: string; // ISO 8601 string or Date
  reminder?: boolean;
  notes?: string;
  attachments?: string[];
  comments?: string[];
  color?: string; // For calendar rendering
}
