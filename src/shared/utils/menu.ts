import { MenuItem, MenuResposeType } from "@/types/menu";

export function buildMenuListFromApi(
  menus: MenuResposeType[] = []
): MenuItem[] {
  return menus.flatMap((m) => {
    const menu: MenuItem = {
      menuId: m.id,
      menuCode: m.menuCode,
      menuName: m.menuName,
      moduleType: m.moduleType ?? "",
      privilege: m.privilege ?? [],
    };

    const subMenu: MenuItem[] =
      m.subMenus?.map((sub) => ({
        menuId: sub.id,
        menuCode: sub.menuCode,
        menuName: `${m.menuName} > ${sub.menuName}`,
        moduleType: sub.moduleType ?? m.moduleType ?? "",
        privilege: sub.privilege ?? [],
      })) ?? [];

    return [menu, ...subMenu];
  });
}
