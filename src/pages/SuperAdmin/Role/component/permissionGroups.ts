import { getModuleConfig } from "@/shared/constants/moduleRegistry";

import { PermissionGroup } from "../types";

/** Minimal shape shared by every role-permission payload from the backend. */
export interface RolePermissionLike {
  id: string;
  action: string;
  moduleCode?: string;
  code?: string;
  isActive?: boolean;
  assigned?: boolean;
}

/** Resolves the display label for a module code using the shared registry. */
export const getModuleLabel = (moduleCode: string): string =>
  getModuleConfig(moduleCode)?.label ?? moduleCode;

/**
 * The backend returns `moduleCode` on ceiling payloads but only embeds it in
 * the permission `code` (`MODULE_CODE:ACTION`) on role payloads.
 */
export const moduleCodeOf = (permission: {
  moduleCode?: string;
  code?: string;
}): string =>
  permission.moduleCode ?? permission.code?.split(":")[0] ?? "OTHER";

/** Groups a flat permission list into renderable per-module cards. */
export const buildPermissionGroups = (
  permissions: RolePermissionLike[]
): PermissionGroup[] => {
  const grouped = permissions.reduce<Record<string, PermissionGroup>>(
    (acc, permission) => {
      const moduleCode = moduleCodeOf(permission);
      if (!acc[moduleCode]) {
        acc[moduleCode] = {
          moduleCode,
          moduleName: getModuleLabel(moduleCode),
          permissions: [],
        };
      }
      acc[moduleCode].permissions.push({
        id: permission.id,
        action: permission.action,
        disabled: permission.isActive === false,
      });
      return acc;
    },
    {}
  );

  return Object.values(grouped);
};

/** Builds the react-hook-form `permissions` record from selected permissions. */
export const buildSelectedPermissionRecord = (
  permissions: RolePermissionLike[]
): Record<string, string[]> =>
  permissions.reduce<Record<string, string[]>>((acc, permission) => {
    if (!permission.id) return acc;
    const moduleCode = moduleCodeOf(permission);
    if (!acc[moduleCode]) acc[moduleCode] = [];
    acc[moduleCode].push(permission.id);
    return acc;
  }, {});

/** Builds the initial selection from ceiling permissions flagged `assigned`. */
export const buildAssignedPermissionRecord = (
  permissions: RolePermissionLike[]
): Record<string, string[]> =>
  buildSelectedPermissionRecord(
    permissions.filter((permission) => permission.assigned === true)
  );

/**
 * Initial checkbox state for a role being edited inside its ceiling.
 *
 * `assigned` on the ceiling payload is the source of truth, but any permission
 * present in `currentPermissions` is merged in as well (and then intersected
 * with the ceiling) so a role never renders as under-selected when the backend
 * omits `assigned`.
 */
export const buildCeilingSelection = (
  available: RolePermissionLike[],
  current: RolePermissionLike[]
): Record<string, string[]> => {
  const selection = buildAssignedPermissionRecord(available);
  const currentRecord = buildSelectedPermissionRecord(current);

  Object.entries(currentRecord).forEach(([moduleCode, ids]) => {
    const availableIds = new Set(
      available
        .filter((permission) => moduleCodeOf(permission) === moduleCode)
        .map((permission) => permission.id)
    );
    const merged = new Set([
      ...(selection[moduleCode] ?? []),
      ...ids.filter((id) => availableIds.has(id)),
    ]);
    if (merged.size > 0) {
      selection[moduleCode] = Array.from(merged);
    }
  });

  return selection;
};
