import type {
  FirmStats,
  GlobalCaseStats,
  UserStats,
} from "../../types/dashboard.types";

export type InsightType = "success" | "info" | "warning" | "danger";

export interface Insight {
  type: InsightType;
  title: string;
  description: string;
}

export interface KpiTrend {
  value: number;
  label: string;
}

export interface KpiCardData {
  label: string;
  value: number;
  trend?: KpiTrend;
  icon: React.ReactNode;
  color: string;
  sparklineColor: string;
  sparklineData: number[];
}

export interface FirmOverviewData extends FirmStats {
  activePercent: number;
  inactiveFirms: number;
}

export type CaseOverviewData = GlobalCaseStats;

export interface DashboardData {
  userStats: UserStats;
  firmStats: FirmOverviewData;
  caseStats: CaseOverviewData;
  todayEventsCount: number;
}

export interface RoleDistributionItem {
  label: string;
  value: number;
  color: string;
  icon: string;
}
