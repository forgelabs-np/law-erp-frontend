import { useMemo } from "react";
import { useGlobalDashboardQuery } from "../../api/dashboard.api";
import type { FirmOverviewData } from "./types";

/**
 * Centralized hook for all Global Dashboard data.
 * Wraps the existing API hook and adds computed fields.
 */
export function useGlobalDashboard(days: number = 30) {
  const query = useGlobalDashboardQuery(days);

  const computedData = useMemo(() => {
    if (!query.data) return undefined;

    const {
      userStats,
      firmStats,
      caseStats,
      scraperStats,
      recentActivity,
      userTrends,
      firmTrends,
      matterTrends,
    } = query.data;

    // Compute firm overview data
    const inactiveFirms =
      firmStats.totalFirms - firmStats.activeFirms - firmStats.suspendedFirms;
    const firmOverview: FirmOverviewData = {
      ...firmStats,
      activePercent:
        firmStats.totalFirms > 0
          ? Math.round((firmStats.activeFirms / firmStats.totalFirms) * 100)
          : 0,
      inactiveFirms: Math.max(0, inactiveFirms),
    };

    return {
      userStats,
      firmStats: firmOverview,
      caseStats,
      scraperStats,
      recentActivity: recentActivity ?? [],
      userTrends: userTrends ?? [],
      firmTrends: firmTrends ?? [],
      matterTrends: matterTrends ?? [],
    };
  }, [query.data]);

  return {
    ...query,
    computedData,
  };
}
