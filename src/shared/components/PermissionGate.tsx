import React from "react";
import { useModulePermissions } from "@/shared/hooks/usePermissions";
import type { PermissionAction } from "@/shared/hooks/usePermissions";

interface PermissionGateProps {
  moduleCode: string;
  action?: PermissionAction;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

/**
 * Declarative permission gate component.
 *
 * Renders children only when the user has the required permission.
 * If an `action` is provided, checks that specific action.
 * If no `action` is provided, only checks that the module is enabled and ACCESS is granted.
 *
 * @example
 * <PermissionGate moduleCode="CLIENT_MANAGEMENT" action="CREATE">
 *   <Button>Add Client</Button>
 * </PermissionGate>
 *
 * @example
 * <PermissionGate moduleCode="CLIENT_MANAGEMENT" action="CREATE" fallback={null}>
 *   <Button>Add Client</Button>
 * </PermissionGate>
 */
export function PermissionGate({
  moduleCode,
  action,
  fallback = null,
  children,
}: PermissionGateProps) {
  const perms = useModulePermissions(moduleCode);

  if (action) {
    if (!perms.hasAction(action)) {
      return <>{fallback}</>;
    }
  } else {
    if (!perms.enabled || !perms.canAccess) {
      return <>{fallback}</>;
    }
  }

  return <>{children}</>;
}
