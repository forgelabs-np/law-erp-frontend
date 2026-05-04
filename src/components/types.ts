export const defaultSubMenu: SubMenuForm = {
  displayOrder: "",
  menuName: "",
  menuCode: "",
  privilege: [],
};

export interface SubMenuForm {
  id?: string;
  displayOrder: string;
  active?: boolean;
  menuName: string;
  menuCode: string;
  privilege: string[];
}
