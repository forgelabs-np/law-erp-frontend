import {
  formatDistanceToNowStrict,
  format,
  isToday,
  isYesterday,
} from "date-fns";

/**
 * Format a notification timestamp into a human-friendly string.
 *
 * - Recent: "just now", "5 min ago", "2 hours ago"
 * - Yesterday: "Yesterday"
 * - Older: formatted date
 */
export const formatNotificationTime = (dateString: string): string => {
  if (!dateString) return "";

  try {
    const date = new Date(dateString);

    if (isNaN(date.getTime())) return "";

    if (isToday(date)) {
      const distance = formatDistanceToNowStrict(date, { addSuffix: false });
      if (distance === "0 seconds") return "just now";
      return `${distance} ago`;
    }

    if (isYesterday(date)) {
      return "Yesterday";
    }

    return format(date, "MMM d, yyyy");
  } catch {
    return "";
  }
};

/**
 * Display-friendly notification count.
 * For counts > 99, returns "99+".
 */
export const formatNotificationCount = (count: number): string => {
  if (count <= 0) return "";
  if (count > 99) return "99+";
  return String(count);
};
