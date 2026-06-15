export interface SubMenuPayload {
  id?: string;
  displayOrder: string;
  menuName: string;
  menuCode: string;
  privilege: string[];
}

export interface ModuleMenuPayload {
  id?: string;
  moduleType?: string;
  menuName: string;
  menuCode: string;
  displayOrder: string;
  privilege: string[];
  subMenus: SubMenuPayload[];
}

export interface MenuSetupFormValues {
  menu: {
    displayOrder: string;
    menuName: string;
    menuCode: string;
    privilege: string[];
    subMenus: SubMenuPayload[];
    moduleType?: string;
  };
}
