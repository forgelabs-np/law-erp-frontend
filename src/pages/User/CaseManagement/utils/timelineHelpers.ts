import { format, isToday, isYesterday, parseISO } from "date-fns";

import { MatterTimelineEvent } from "../types/matter.types";

export interface TimelineDateGroupData {
  label: string;
  events: MatterTimelineEvent[];
}

const groupLabel = (value: string): string => {
  const date = parseISO(value);
  if (Number.isNaN(date.getTime())) return "Unknown";
  if (isToday(date)) return `Today · ${format(date, "dd MMM yyyy")}`;
  if (isYesterday(date)) return `Yesterday · ${format(date, "dd MMM yyyy")}`;
  return format(date, "dd MMM yyyy");
};

/** Group already-ordered events by day, oldest first. */
export const groupEventsByDay = (
  events: MatterTimelineEvent[]
): TimelineDateGroupData[] => {
  const groups: TimelineDateGroupData[] = [];
  for (const event of events) {
    const label = groupLabel(event.createdAt);
    const last = groups[groups.length - 1];
    if (last && last.label === label) {
      last.events.push(event);
    } else {
      groups.push({ label, events: [event] });
    }
  }
  return groups;
};
