import { ComponentType } from "react";

import { useAuthStore } from "@/shared/stores/auth.store";

import { ClientDashboard } from "./ClientDashboard";
import { DashboardSkeleton, UnsupportedRoleState } from "./components";
import { EmployeeDashboard } from "./EmployeeDashboard";
import { FirmAdminDashboard } from "./FirmAdminDashboard";
import { SuperAdminDashboard } from "./SuperAdminDashboard";
import {
  DashboardKind,
  ROLE_TO_DASHBOARD,
  resolveDashboardRole,
} from "./utils";

/**
 * Role → dashboard component. Purpose-built components, no generic engine:
 * each dashboard owns its own query, loading, error and empty states, so only
 * the endpoint matching the authenticated role is ever requested.
 */
const DASHBOARDS: Record<DashboardKind, ComponentType> = {
  SUPER_ADMIN: SuperAdminDashboard,
  FIRM_ADMIN: FirmAdminDashboard,
  EMPLOYEE: EmployeeDashboard,
  CLIENT: ClientDashboard,
};

/**
 * Single entry point for the dashboard route. Access is already enforced by
 * ModuleRouteGuard (`DASHBOARD_MANAGEMENT` + `VIEW`); the role only decides
 * which dashboard experience is rendered.
 */
export const DashboardPage = () => {
  const role = useAuthStore((state) => state.role);
  const isInitialized = useAuthStore((state) => state.isInitialized);

  // Role not resolved yet — never guess and never show another role's data.
  if (!isInitialized) {
    return <DashboardSkeleton />;
  }

  const dashboardRole = resolveDashboardRole(role);

  if (!dashboardRole) {
    return <UnsupportedRoleState />;
  }

  const Dashboard = DASHBOARDS[ROLE_TO_DASHBOARD[dashboardRole]];

  return <Dashboard />;
};

export default DashboardPage;
