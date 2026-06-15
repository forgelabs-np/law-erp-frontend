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
} from "lucide-react";
import { ROUTES_CONFIG } from "@/shared/config";

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
    name: "Role Management",
    href: ROUTES_CONFIG.USER.ROLE_MANAGEMENT,
    icon: <Users size={16} />,
    section: "",
  },
  {
    name: "Menu Management",
    href: ROUTES_CONFIG.USER.MENU_MANAGEMENT,
    icon: <Users size={16} />,
    section: "",
  },
  {
    name: "My Files",
    href: ROUTES_CONFIG.USER.MY_FILES,
    icon: <FileText size={16} />,
    section: "Main",
  },
  {
    name: "Shared With Me",
    href: ROUTES_CONFIG.USER.SHARED_WITH_ME,
    icon: <FolderOpen size={16} />,
    section: "Main",
  },
  {
    name: "Folder",
    href: ROUTES_CONFIG.USER.FOLDER,
    icon: <Globe size={16} />,
    section: "Main",
  },
  {
    name: "Case Type Setup",
    href: ROUTES_CONFIG.USER.CASE_TYPE_SETUP,
    icon: <Shirt size={16} />,
    section: "Main",
  },
  {
    name: "Office Setup",
    href: ROUTES_CONFIG.USER.OFFICE_SETUP,
    icon: <Building2 size={16} />,
    section: "Marketing & Support",
  },
  {
    name: "Archive",
    href: ROUTES_CONFIG.USER.ARCHIVE,
    icon: <Archive size={16} />,
    section: "Marketing & Support",
  },
  {
    name: "Settings",
    href: "#",
    icon: <Settings size={16} />,
    section: "bottom",
  },
  {
    name: "Profile",
    href: "#",
    icon: <User size={16} />,
    section: "bottom",
  },
  {
    name: "Log Out",
    href: "#",
    icon: <LogOut size={16} />,
    section: "bottom",
  },
];
