import {
  LayoutGrid,
  Users,
  User,
  Building2,
  Shield,
  LayoutTemplate,
  HelpCircle,
  Settings,
  LogOut,
  FileText,
  FolderOpen,
  Archive,
} from "lucide-react";
import { MdTask } from "react-icons/md";
import { ComponentType } from "react";

import { ROUTES_CONFIG } from "@/shared/config";

type IconComponent = ComponentType<{
  size?: number | string;
  color?: string;
}>;

export type ModuleSection =
  | "General"
  | "Main"
  | "Administration"
  | "Support";

export interface ModuleRegistryEntry {
  moduleCode: string;
  label: string;
  path: string;
  icon: IconComponent;
  section: ModuleSection;
  order: number;
  badge?: string;
  hidden?: boolean;
  requiresFirm?: boolean;
  requiresSuperAdmin?: boolean;
  featureFlag?: string;
  children?: string[];
  parent?: string;
  menuType?: string;
}

export type ModuleConfig = Pick<
  ModuleRegistryEntry,
  "label" | "path" | "icon" | "section" | "order"
>;

export const MODULE_REGISTRY: Record<string, ModuleRegistryEntry> = {
  HOME: {
    moduleCode: "HOME",
    label: "Dashboard",
    path: ROUTES_CONFIG.USER.HOME,
    icon: LayoutGrid,
    section: "General",
    order: 1,
  },
  CLIENT_MANAGEMENT: {
    moduleCode: "CLIENT_MANAGEMENT",
    label: "Client Management",
    path: ROUTES_CONFIG.USER.CLIENT_MANAGEMENT,
    icon: Users,
    section: "Main",
    order: 10,
  },
  CASE_MANAGEMENT: {
    moduleCode: "CASE_MANAGEMENT",
    label: "Cases",
    path: "/cases",
    icon: FileText,
    section: "Main",
    order: 11,
  },
  EMPLOYEE: {
    moduleCode: "EMPLOYEE",
    label: "Employee Management",
    path: ROUTES_CONFIG.USER.EMPLOYEE_MANAGEMENT,
    icon: User,
    section: "Main",
    order: 12,
  },
  TASK_CALENDAR: {
    moduleCode: "TASK_CALENDAR",
    label: "Task Calendar",
    path: ROUTES_CONFIG.USER.TASK_CALENDAR,
    icon: MdTask,
    section: "Main",
    order: 13,
  },
  DOCUMENT_MANAGEMENT: {
    moduleCode: "DOCUMENT_MANAGEMENT",
    label: "Documents",
    path: ROUTES_CONFIG.USER.FOLDER,
    icon: FolderOpen,
    section: "Main",
    order: 14,
  },
  ARCHIVE: {
    moduleCode: "ARCHIVE",
    label: "Archive",
    path: ROUTES_CONFIG.USER.ARCHIVE,
    icon: Archive,
    section: "Main",
    order: 15,
  },
  CASE_TYPE_SETUP: {
    moduleCode: "CASE_TYPE_SETUP",
    label: "Case Type Setup",
    path: ROUTES_CONFIG.USER.CASE_TYPE_SETUP,
    icon: FileText,
    section: "Main",
    order: 16,
  },
  USER_MANAGEMENT: {
    moduleCode: "USER_MANAGEMENT",
    label: "User Management",
    path: ROUTES_CONFIG.USER.USER_MANAGEMENT,
    icon: Users,
    section: "Administration",
    order: 20,
  },
  ROLE_MANAGEMENT: {
    moduleCode: "ROLE_MANAGEMENT",
    label: "Role Management",
    path: ROUTES_CONFIG.USER.ROLE_MANAGEMENT,
    icon: Users,
    section: "Administration",
    order: 21,
  },
  PERMISSION_MANAGEMENT: {
    moduleCode: "PERMISSION_MANAGEMENT",
    label: "Permission Management",
    path: ROUTES_CONFIG.USER.PERMISSION_MANAGEMENT,
    icon: Users,
    section: "Administration",
    order: 22,
  },
  FIRM_MANAGEMENT: {
    moduleCode: "FIRM_MANAGEMENT",
    label: "Firm Management",
    path: ROUTES_CONFIG.USER.FIRM_MANAGEMENT,
    icon: Building2,
    section: "Administration",
    order: 23,
  },
  MENU_MANAGEMENT: {
    moduleCode: "MENU_MANAGEMENT",
    label: "Menu Management",
    path: ROUTES_CONFIG.USER.MENU_MANAGEMENT,
    icon: Users,
    section: "Administration",
    order: 24,
  },
  AUDIT_LOGS: {
    moduleCode: "AUDIT_LOGS",
    label: "Audit Logs",
    path: ROUTES_CONFIG.SUPER_ADMIN.AUDIT_LOGS,
    icon: Shield,
    section: "Administration",
    order: 25,
  },
  TEMPLATES: {
    moduleCode: "TEMPLATES",
    label: "Templates",
    path: "#",
    icon: LayoutTemplate,
    section: "Support",
    order: 90,
  },
  HELP_DOCS: {
    moduleCode: "HELP_DOCS",
    label: "Help & Docs",
    path: "#",
    icon: HelpCircle,
    section: "Support",
    order: 91,
  },
  SETTINGS: {
    moduleCode: "SETTINGS",
    label: "Settings",
    path: "#",
    icon: Settings,
    section: "Support",
    order: 92,
  },
  LOGOUT: {
    moduleCode: "LOGOUT",
    label: "Log Out",
    path: "#",
    icon: LogOut,
    section: "Support",
    order: 93,
  },
};

export const SIDEBAR_SECTION_ORDER: ModuleSection[] = [
  "General",
  "Main",
  "Administration",
];

const warnUnknownModule = (moduleCode: string) => {
  if (import.meta.env.DEV) {
    console.warn(`Unknown module code: ${moduleCode}`);
  }
};

export const getModuleConfig = (moduleCode: string): ModuleConfig | null => {
  const entry = MODULE_REGISTRY[moduleCode];
  if (!entry) {
    return null;
  }

  return {
    label: entry.label,
    path: entry.path,
    icon: entry.icon,
    section: entry.section,
    order: entry.order,
  };
};

export const getModuleIcon = (moduleCode: string): IconComponent => {
  return getModuleConfig(moduleCode)?.icon ?? LayoutGrid;
};

export interface ModuleSidebarData extends ModuleConfig {
  moduleCode: string;
}

export const mapEnabledModulesToSidebarData = (
  modules: { moduleCode: string; enabled: boolean }[]
): ModuleSidebarData[] => {
  return modules
    .filter((module) => module.enabled)
    .map((module) => {
      const config = getModuleConfig(module.moduleCode);
      if (!config) {
        warnUnknownModule(module.moduleCode);
        return null;
      }

      return {
        moduleCode: module.moduleCode,
        ...config,
      };
    })
    .filter((item): item is ModuleSidebarData => item !== null)
    .sort((a, b) => a.order - b.order);
};

export const groupSidebarItemsBySection = <T extends { section: string }>(
  items: T[]
): Record<string, T[]> => {
  return items.reduce<Record<string, T[]>>((grouped, item) => {
    if (!grouped[item.section]) {
      grouped[item.section] = [];
    }
    grouped[item.section].push(item);
    return grouped;
  }, {});
};
