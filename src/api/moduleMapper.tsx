import React from "react";

import { Module, SubModule } from "@/api/modules";
import { ChartIcon, FormIcon, TableIcon } from "@/shared/assets";
import { ROUTES_CONFIG } from "@/shared/config";
import { SidebarItemProps } from "@/shared/types";

// Map module codes to icons
const getModuleIcon = (code: string): React.ReactNode => {
  const iconMap: Record<string, React.ReactNode> = {
    DASHBOARD: <ChartIcon />,
    USER_MANAGEMENT: <TableIcon />,
    FILE_MANAGEMENT: <FormIcon />,
    ROLE_MANAGEMENT: <TableIcon />,
    SETTINGS: <FormIcon />,
  };
  return iconMap[code] || <FormIcon />;
};

// Map module and submodule codes to routes
const getModuleRoute = (moduleCode: string, subModuleCode?: string): string => {
  const routeMap: Record<string, string> = {
    // Module level routes
    "DASHBOARD": ROUTES_CONFIG.USER.HOME,
    "USER_MANAGEMENT": ROUTES_CONFIG.USER.USER_MANAGEMENT,
    "FILE_MANAGEMENT": ROUTES_CONFIG.USER.MY_FILES,
    "ROLE_MANAGEMENT": ROUTES_CONFIG.USER.HOME, // placeholder

    // Sub-module routes
    "ANALYTICS": ROUTES_CONFIG.USER.HOME,
    "REPORTS": ROUTES_CONFIG.USER.HOME,
    "USERS": ROUTES_CONFIG.USER.USER_MANAGEMENT,
    "ROLES": ROUTES_CONFIG.USER.HOME,
    "PERMISSIONS": ROUTES_CONFIG.USER.HOME,
    "MY_FILES": ROUTES_CONFIG.USER.MY_FILES,
    "SHARED": ROUTES_CONFIG.USER.SHARED_WITH_ME,
    "CASE_TYPE_SETUP": ROUTES_CONFIG.USER.CASE_TYPE_SETUP,
    "OFFICE_SETUP": ROUTES_CONFIG.USER.OFFICE_SETUP,
    "ARCHIVE": ROUTES_CONFIG.USER.ARCHIVE,
  };

  const key = subModuleCode || moduleCode;
  return routeMap[key] || "#";
};

// Transform SubModule to SidebarItemProps
const transformSubModule = (subModule: SubModule): SidebarItemProps => {
  return {
    name: subModule.name,
    href: getModuleRoute(subModule.code),
    icon: getModuleIcon(subModule.code),
    isChild: true,
  };
};

// Transform Module to SidebarItemProps with nested submodules
export const transformModuleToSidebarItem = (module: Module): SidebarItemProps => {
  const subItems = module.subModules
    .filter((sub) => sub.active)
    .sort((a, b) => a.displayOrder - b.displayOrder)
    .map(transformSubModule);

  return {
    name: module.name,
    href: subItems.length === 0 ? getModuleRoute(module.code) : undefined,
    icon: getModuleIcon(module.code),
    subItems: subItems.length > 0 ? subItems : undefined,
  };
};

// Transform API response to sidebar items array
export const mapModulesToSidebarItems = (modules: Module[]): SidebarItemProps[] => {
  return modules
    .filter((module) => module.active)
    .sort((a, b) => a.displayOrder - b.displayOrder)
    .map(transformModuleToSidebarItem);
};
