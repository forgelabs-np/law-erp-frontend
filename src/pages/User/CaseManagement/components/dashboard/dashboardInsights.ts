import type { Insight } from "./types";
import type { GlobalDashboardData } from "../../types/dashboard.types";

/**
 * Generate dashboard insights from real API data.
 * Returns structured insight objects for the Quick Insights section.
 */
export function getDashboardInsights(
  data: GlobalDashboardData | undefined
): Insight[] {
  if (!data) return [];

  const insights: Insight[] = [];
  const { userStats, firmStats, caseStats } = data;

  // System operational
  insights.push({
    type: "success",
    title: "All systems operational",
    description: "Everything is running smoothly.",
  });

  // User growth — active vs total ratio
  if (userStats.totalUsers > 0) {
    const activeRatio = userStats.activeUsers / userStats.totalUsers;
    const percent = Math.round(activeRatio * 100);
    insights.push({
      type: "info",
      title: "User activity",
      description:
        activeRatio === 1
          ? `All ${userStats.totalUsers} users are active.`
          : `${userStats.activeUsers} of ${userStats.totalUsers} users are active (${percent}%).`,
    });
  }

  // Active matters
  if (caseStats.activeMatters > 0) {
    insights.push({
      type: "info",
      title: "Active matters",
      description: `${caseStats.activeMatters} matter${caseStats.activeMatters !== 1 ? "s" : ""} currently active.`,
    });
  }

  // Stale matters — attention needed
  if (caseStats.staleMatters > 0) {
    insights.push({
      type: "warning",
      title: "Attention needed",
      description: `${caseStats.staleMatters} matter${caseStats.staleMatters !== 1 ? "s" : ""} ${caseStats.staleMatters === 1 ? "is" : "are"} stale.`,
    });
  } else {
    insights.push({
      type: "success",
      title: "No stale matters",
      description: "All matters are up to date.",
    });
  }

  // Firm status
  if (firmStats.suspendedFirms > 0) {
    insights.push({
      type: "danger",
      title: "Suspended firms",
      description: `${firmStats.suspendedFirms} firm${firmStats.suspendedFirms !== 1 ? "s" : ""} suspended.`,
    });
  }

  // Today's events
  if (caseStats.todayEvents > 0) {
    insights.push({
      type: "info",
      title: "Today's events",
      description: `${caseStats.todayEvents} event${caseStats.todayEvents !== 1 ? "s" : ""} scheduled today.`,
    });
  }

  return insights;
}
