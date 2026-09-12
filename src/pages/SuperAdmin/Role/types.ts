import { SubMenuForm } from "@/components/types";

export interface RolePermissionItem {
  menuId: string;
  privilege: string[];
}

export interface RoleSetupPayload {
  id?: string;
  name: string;
  code: string;
  description: string;
  permissionIds: string[];
}

type ModuleField = {
  displayOrder: string;
  menuName: string;
  menuCode: string;
  privilege: string[];
  subMenus: SubMenuForm[];
};

export interface RoleFormValues {
  name: string;
  description: string;
  code: string;
  permissions?: Record<string, string[]>;
  CRM?: ModuleField;
  CMS?: ModuleField;
  menu?: ModuleField;
}

/** A single selectable permission inside a module card. */
export interface PermissionOption {
  id: string;
  action: string;
  /** Rendered but not selectable (e.g. backend marks the permission inactive). */
  disabled?: boolean;
}

/** Permissions grouped by their owning module, ready for rendering. */
export interface PermissionGroup {
  moduleCode: string;
  moduleName: string;
  permissions: PermissionOption[];
}

/**
 * Flattens the `permissions` record held in the role form into the complete
 * list of selected permission ids expected by the full-replacement PUT APIs.
 */
export const flattenPermissionIds = (
  permissions: RoleFormValues["permissions"]
): string[] =>
  Object.values(permissions ?? {})
    .flat()
    .filter((id): id is string => typeof id === "string" && id.length > 0);
