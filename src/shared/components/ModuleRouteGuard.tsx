import { Navigate, useLocation } from "react-router-dom";
import { Box, Text } from "@chakra-ui/react";
import { useModulePermissions } from "@/shared/hooks/usePermissions";
import { useAuthStore } from "@/shared/stores/auth.store";
import { PermissionDenied } from "./PermissionDenied";

interface ModuleRouteGuardProps {
  moduleCode: string;
  /** Optional action to check (e.g. "VIEW"). If omitted, only checks ACCESS. */
  action?: string;
  children: React.ReactNode;
}

/**
 * Route-level permission guard.
 * Wraps a route element to enforce module + action permission.
 * The children (page component) are NOT mounted when permission is denied,
 * which prevents all API calls from executing.
 *
 * - Authentication is checked separately (not by this component).
 * - While /me data is loading, shows a loading state.
 * - When /me is available, checks enabled + ACCESS + optional action.
 * - On failure, renders PermissionDenied (page is never mounted).
 */
export function ModuleRouteGuard({
  moduleCode,
  action,
  children,
}: ModuleRouteGuardProps) {
  const location = useLocation();
  const isInitialized = useAuthStore((state) => state.isInitialized);
  const user = useAuthStore((state) => state.user);
  const perms = useModulePermissions(moduleCode);

  // ── Loading state: /me data not yet available ──
  // Do NOT show "Access Denied" — wait for permission data to load.
  // Do NOT grant temporary access — default is secure (deny).
  if (!isInitialized) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100%"
      >
        <Text color="gray.500">Loading...</Text>
      </Box>
    );
  }

  // ── Authentication check ──
  if (!user) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // ── Module enabled + ACCESS check ──
  if (!perms.enabled || !perms.canAccess) {
    return (
      <PermissionDenied
        title="Access Restricted"
        description={`You don't have permission to access this module. Contact your administrator if you believe this is an error.`}
        showDashboard={false}
      />
    );
  }

  // ── Action-level check (e.g. VIEW, CREDENTIAL_VIEW) ──
  if (action && !perms.hasAction(action)) {
    return (
      <PermissionDenied
        title="Permission Required"
        description={`You don't have the required permission to view this page. Please contact your administrator for access.`}
        showDashboard={false}
      />
    );
  }

  // ── Authorized: render the page ──
  return <>{children}</>;
}

/**
 * View-level guard: shows a "No Access" message when VIEW permission is missing.
 * Used INSIDE a page for sub-sections that require VIEW.
 */
export function ViewGuard({
  moduleCode,
  children,
}: Omit<ModuleRouteGuardProps, "action">) {
  const { canView, canAccess, enabled } = useModulePermissions(moduleCode);

  if (!enabled || !canAccess) {
    return null;
  }

  if (!canView) {
    return (
      <PermissionDenied
        title="No View Access"
        description="You don't have permission to view this content."
        showBack={false}
        showDashboard={false}
      />
    );
  }

  return <>{children}</>;
}
