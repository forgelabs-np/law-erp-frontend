import { useMemo } from "react";

import { useGetModuleMenusQuery } from "@/api/menuSetup";
import {
  PermissionResponse,
  useGetPermissionsQuery,
} from "@/api/permissionSetup";
import { ApiResponse } from "@/shared/types/response";

export interface ModulePermissionGroup {
  moduleCode: string;
  moduleName: string;
  permissions: PermissionResponse[];
}

/**
 * Shared permission grouping used by every permission assignment screen
 * (Role Management, Role Templates). Groups the permission matrix by module
 * code prefix; permissions without a matching module fall into "OTHER".
 */
export const useModulePermissionGroups = () => {
  const { data: permissionsResponse, isLoading: isLoadingPermissions } =
    useGetPermissionsQuery();
  const { data: modulesResponse, isLoading: isLoadingModules } =
    useGetModuleMenusQuery();

  const isLoading = isLoadingPermissions || isLoadingModules;

  const allPermissions: PermissionResponse[] = useMemo(
    () =>
      (permissionsResponse as unknown as ApiResponse<PermissionResponse[]>)
        ?.data ?? [],
    [permissionsResponse]
  );

  const allModules = useMemo(
    () =>
      (modulesResponse as unknown as ApiResponse<
        { name: string; code: string }[]
      >)?.data ?? [],
    [modulesResponse]
  );

  const groups: ModulePermissionGroup[] = useMemo(() => {
    return allModules
      .map((mod) => {
        const modCode = mod.code;
        const permsForModule = allPermissions.filter((perm) => {
          const permModuleCode = perm.code?.split(":")[0];
          return permModuleCode === modCode;
        });
        return {
          moduleCode: modCode,
          moduleName: mod.name,
          permissions: permsForModule,
        };
      })
      .filter((group) => group.permissions.length > 0);
  }, [allModules, allPermissions]);

  const knownModuleCodes = useMemo(
    () => new Set(allModules.map((m) => m.code)),
    [allModules]
  );
  const orphanPermissions = useMemo(
    () =>
      allPermissions.filter((perm) => {
        const permModuleCode = perm.code?.split(":")[0];
        return !permModuleCode || !knownModuleCodes.has(permModuleCode);
      }),
    [allPermissions, knownModuleCodes]
  );

  return {
    isLoading,
    groups,
    orphanPermissions,
  };
};
