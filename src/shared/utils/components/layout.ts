import { SIDEBAR_ITEMS } from "@/shared/constants";

export const getInitialExpandedSidebarMenu = (): string[] => {
  const pathname = window.location.pathname;

  const activeMenu = SIDEBAR_ITEMS.find((sidebarItem) =>
    pathname.startsWith(sidebarItem.href)
  )?.name;

  if (activeMenu) return [activeMenu];

  return [];
};
