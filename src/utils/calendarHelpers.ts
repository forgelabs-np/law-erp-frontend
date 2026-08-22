import { Task, TaskType } from "../types/Task";
import { CalendarEvent } from "../types/calendar.types";

export const getTaskColor = (type: TaskType, status: string): string => {
  if (status === "Completed") return "#10b981"; // Green
  if (status === "Overdue") return "#ef4444"; // Red

  switch (type) {
    case "Client Meeting":
      return "#3b82f6"; // Blue
    case "Court Hearing":
      return "#8b5cf6"; // Purple
    case "Filing":
    case "Review":
      return "#f97316"; // Orange
    case "Internal Task":
    case "Legal Research":
    default:
      return "#6b7280"; // Gray
  }
};

export const getHearingStatusColor = (status: string): string => {
  switch (status) {
    case "SCHEDULED":
      return "#3b82f6"; // Blue
    case "COMPLETED":
      return "#10b981"; // Green
    case "CANCELLED":
      return "#ef4444"; // Red
    case "ADJOURNED":
      return "#f97316"; // Orange
    default:
      return "#6b7280"; // Gray
  }
};

export const getHearingTypeBadgeColor = (hearingType: string): string => {
  switch (hearingType) {
    case "FIRST_HEARING":
      return "blue";
    case "STATUS_CONF":
      return "purple";
    case "ARGUMENT":
      return "red";
    case "JUDGMENT":
      return "green";
    case "EVIDENCE":
      return "orange";
    case "PLEA":
      return "pink";
    case "OTHER":
    default:
      return "gray";
  }
};

export const mapTaskToEvent = (task: Task) => {
  return {
    id: task.id,
    title: task.title,
    start: task.startDate,
    end: task.endDate,
    backgroundColor: getTaskColor(task.taskType, task.status),
    borderColor: "transparent",
    display: "block",
    extendedProps: {
      ...task,
    },
  };
};

export const mapCalendarEventToTask = (event: CalendarEvent): Task => {
  const taskType: TaskType = "Court Hearing";
  const priority: "Low" | "Medium" | "High" | "Critical" = "Medium";
  const taskStatus: "Pending" | "In Progress" | "Completed" | "Overdue" =
    event.status === "HELD" ? "Completed" : "Pending";

  const eventLabel =
    event.eventType.charAt(0) + event.eventType.slice(1).toLowerCase();
  // Combine date and time to create ISO datetime strings
  const startDateTime = `${event.scheduledDate}T${event.scheduledTime || "09:00:00"}`;
  const endDateTime = `${event.scheduledDate}T${event.endTime || event.scheduledTime || "10:00:00"}`;

  return {
    id: event.id,
    title: `${eventLabel} · ${event.matterTitle}`,
    description: `${eventLabel} - ${event.courtRoom || ""}`,
    taskType,
    priority,
    status: taskStatus,
    assignedLawyer: "", // Will be populated if advocate data is available
    client: event.matterTitle,
    caseName: event.matterTitle,
    caseNumber: event.matterNumber,
    startDate: startDateTime,
    endDate: endDateTime,
    color: getTaskColor(taskType, taskStatus),
  };
};
