import {
  LayoutGrid,
  Globe,
  Shirt,
  Users,
  Settings,
  LogOut,
  FileText,
  FolderOpen,
  Archive,
  Building2,
  User,
  LayoutTemplate,
  HelpCircle,
  Shield,
} from "lucide-react";
import { ROUTES_CONFIG } from "@/shared/config";
import { MdTask } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import TokenService from "@/shared/service/service-token";

export type UserRole = "SUPER_ADMIN" | "FIRM_ADMIN";

const handleLogout = () => {
  TokenService.clearToken();
  window.location.href = "/auth/login";
};

export const SIDEBAR_ITEMS = [
  {
    name: "Home",
    href: ROUTES_CONFIG.USER.HOME,
    icon: <LayoutGrid size={16} />,
    section: "",
  },
  {
    name: "User Management",
    href: ROUTES_CONFIG.USER.USER_MANAGEMENT,
    icon: <Users size={16} />,
    section: "",
  },
  {
    name: "Employee Management",
    href: ROUTES_CONFIG.USER.EMPLOYEE_MANAGEMENT,
    icon: <User size={16} />,
    section: "",
  },
  {
    name: "Task Calendar",
    href: ROUTES_CONFIG.USER.TASK_CALENDAR,
    icon: <MdTask size={16} />,
    section: "",
  },
  {
    name: "Role Management",
    href: ROUTES_CONFIG.USER.ROLE_MANAGEMENT,
    icon: <Users size={16} />,
    section: "",
  },
  {
    name: "Permission Management",
    href: ROUTES_CONFIG.USER.PERMISSION_MANAGEMENT,
    icon: <Users size={16} />,
    section: "",
  },
  {
    name: "Firm Management",
    href: ROUTES_CONFIG.USER.FIRM_MANAGEMENT,
    icon: <Building2 size={16} />,
    section: "",
  },
  {
    name: "Menu Management",
    href: ROUTES_CONFIG.USER.MENU_MANAGEMENT,
    icon: <Users size={16} />,
    section: "",
  },
  {
    name: "Templates",
    href: "#",
    icon: <LayoutTemplate size={16} />,
    section: "bottom",
  },
  {
    name: "Help & Docs",
    href: "#",
    icon: <HelpCircle size={16} />,
    section: "bottom",
  },
  {
    name: "Settings",
    href: "#",
    icon: <Settings size={16} />,
    section: "bottom",
  },
  {
    name: "Log Out",
    href: "#",
    icon: <LogOut size={16} />,
    section: "bottom",
    onClick: handleLogout,
  },
];

// Role-based sidebar menu mapping
const ROLE_SIDEBAR_ITEMS: Record<UserRole, typeof SIDEBAR_ITEMS> = {
  SUPER_ADMIN: [
    {
      name: "Home",
      href: ROUTES_CONFIG.USER.HOME,
      icon: <LayoutGrid size={16} />,
      section: "",
    },

    {
      name: "Role Management",
      href: ROUTES_CONFIG.USER.ROLE_MANAGEMENT,
      icon: <Users size={16} />,
      section: "",
    },
    {
      name: "Permission Management",
      href: ROUTES_CONFIG.USER.PERMISSION_MANAGEMENT,
      icon: <Users size={16} />,
      section: "",
    },
    {
      name: "Firm Management",
      href: ROUTES_CONFIG.USER.FIRM_MANAGEMENT,
      icon: <Building2 size={16} />,
      section: "",
    },
    {
      name: "Menu Management",
      href: ROUTES_CONFIG.USER.MENU_MANAGEMENT,
      icon: <Users size={16} />,
      section: "",
    },
    {
      name: "Audit Logs",
      href: ROUTES_CONFIG.SUPER_ADMIN.AUDIT_LOGS,
      icon: <Shield size={16} />,
      section: "",
    },
    {
      name: "Templates",
      href: "#",
      icon: <LayoutTemplate size={16} />,
      section: "bottom",
    },
    {
      name: "Help & Docs",
      href: "#",
      icon: <HelpCircle size={16} />,
      section: "bottom",
    },
    {
      name: "Settings",
      href: "#",
      icon: <Settings size={16} />,
      section: "bottom",
    },
    {
      name: "Log Out",
      href: "#",
      icon: <LogOut size={16} />,
      section: "bottom",
      onClick: handleLogout,
    },
  ],
  FIRM_ADMIN: [
    {
      name: "Home",
      href: ROUTES_CONFIG.USER.HOME,
      icon: <LayoutGrid size={16} />,
      section: "",
    },
    {
      name: "User Management",
      href: ROUTES_CONFIG.USER.USER_MANAGEMENT,
      icon: <Users size={16} />,
      section: "",
    },
    {
      name: "Employee Management",
      href: ROUTES_CONFIG.USER.EMPLOYEE_MANAGEMENT,
      icon: <User size={16} />,
      section: "",
    },
    {
      name: "Client Management",
      href: ROUTES_CONFIG.USER.CLIENT_MANAGEMENT,
      icon: <User size={16} />,
      section: "",
    },
    {
      name: "Task Calendar",
      href: ROUTES_CONFIG.USER.TASK_CALENDAR,
      icon: <MdTask size={16} />,
      section: "",
    },
    {
      name: "Templates",
      href: "#",
      icon: <LayoutTemplate size={16} />,
      section: "bottom",
    },
    {
      name: "Help & Docs",
      href: "#",
      icon: <HelpCircle size={16} />,
      section: "bottom",
    },
    {
      name: "Settings",
      href: "#",
      icon: <Settings size={16} />,
      section: "bottom",
    },
    {
      name: "Log Out",
      href: "#",
      icon: <LogOut size={16} />,
      section: "bottom",
      onClick: handleLogout,
    },
  ],
};

// Function to get sidebar items based on user role
export const getSidebarItemsByRole = (
  role: string | undefined
): typeof SIDEBAR_ITEMS => {
  if (!role) return ROLE_SIDEBAR_ITEMS.FIRM_ADMIN;

  const normalizedRole = role.toUpperCase().replace(" ", "_") as UserRole;

  if (normalizedRole === "SUPER_ADMIN") {
    return ROLE_SIDEBAR_ITEMS.SUPER_ADMIN;
  }

  return ROLE_SIDEBAR_ITEMS.FIRM_ADMIN;
};
