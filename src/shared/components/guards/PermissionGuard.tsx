import { PropsWithChildren } from "react";

import { useHasPermission } from "@/shared/hooks/useAuth";

interface PermissionGuardProps {
  permission: string;
  fallback?: React.ReactNode;
}

export const PermissionGuard = ({
  permission,
  fallback = null,
  children,
}: PropsWithChildren<PermissionGuardProps>) => {
  const hasPermission = useHasPermission(permission);

  if (!hasPermission) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};
