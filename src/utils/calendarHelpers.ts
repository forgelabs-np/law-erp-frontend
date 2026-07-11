import { Task, TaskType } from "../types/Task";

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
