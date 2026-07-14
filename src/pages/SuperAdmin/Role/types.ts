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
