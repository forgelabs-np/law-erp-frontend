import { MODULE_TYPE } from "@/components/ModuleMenuFields";

export type SubMenuResponseType = {
  id: string;
  menuName: string;
  menuCode: string;
  moduleType: MODULE_TYPE;
  active?: boolean;
  privilege?: string | string[];
  displayOrder: string;
};

export type MenuResposeType = {
  id: string;
  menuName: string;
  menuCode: string;
  moduleType: MODULE_TYPE;
  active?: boolean;
  privilege?: string | string[];
  displayOrder: string;
  subMenus?: SubMenuResponseType[];
};

export type DropdownMenuResposeType = {
  moduleType: MODULE_TYPE;
  menus: MenuResposeType[];
};

export type MenuItem = {
  menuId?: string;
  menuCode: string;
  menuName: string;
  moduleType: string;
  privilege?: string | string[];
};
