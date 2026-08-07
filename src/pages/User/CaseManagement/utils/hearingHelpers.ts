import { Hearing } from "../types/hearing.types";
import { format, isToday, isYesterday, isThisWeek, isThisYear } from "date-fns";

export const groupHearingsByDate = (
  hearings: Hearing[]
): Record<string, Hearing[]> => {
  const grouped: Record<string, Hearing[]> = {};

  hearings.forEach((hearing) => {
    const date = new Date(hearing.date);
    let dateLabel: string;

    if (isToday(date)) {
      dateLabel = "Today";
    } else if (isYesterday(date)) {
      dateLabel = "Yesterday";
    } else if (isThisWeek(date)) {
      dateLabel = format(date, "EEEE"); // Day of week
    } else if (isThisYear(date)) {
      dateLabel = format(date, "MMM d");
    } else {
      dateLabel = format(date, "MMM d, yyyy");
    }

    if (!grouped[dateLabel]) {
      grouped[dateLabel] = [];
    }
    grouped[dateLabel].push(hearing);
  });

  return grouped;
};

export const formatHearingDate = (dateString: string) => {
  const date = new Date(dateString);
  return {
    date: format(date, "MMM d, yyyy"),
    time: format(date, "HH:mm"),
  };
};
