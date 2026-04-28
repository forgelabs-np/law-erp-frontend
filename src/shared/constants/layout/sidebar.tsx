import { ChartIcon, FormIcon } from "@/shared/assets";
import { ROUTES_CONFIG } from "@/shared/config";

export const SIDEBAR_ITEMS = [
  {
    name: "Home",
    href: ROUTES_CONFIG.USER.HOME,
    icon: <FormIcon />,
  },
  {
    name: "User Management",
    href: ROUTES_CONFIG.USER.USER_MANAGEMENT,
    icon: <ChartIcon />,
  },
  {
    name: "My Files",
    href: ROUTES_CONFIG.USER.MY_FILES,
    icon: <FormIcon />,
  },
  {
    name: "Shared With Me",
    href: ROUTES_CONFIG.USER.SHARED_WITH_ME,
    icon: <ChartIcon />,
  },
  {
    name: "Folder",
    href: ROUTES_CONFIG.USER.FOLDER,
    icon: <FormIcon />,
  },
  {
    name: "Case Type Setup",
    href: ROUTES_CONFIG.USER.CASE_TYPE_SETUP,
    icon: <ChartIcon />,
  },
  {
    name: "Office Setup",
    href: ROUTES_CONFIG.USER.OFFICE_SETUP,
    icon: <FormIcon />,
  },
  {
    name: "Archive",
    href: ROUTES_CONFIG.USER.ARCHIVE,
    icon: <ChartIcon />,
  },

  // use this format in case of nested
  // {
  //   name: "Datatable",
  //   icon: <TableIcon />,
  //   parent: ROUTES_CONFIG.DATATABLE.DEFAULT,
  //   subItems: [
  //     {
  //       name: "Basic Datatable",
  //       href: ROUTES_CONFIG.DATATABLE.BASIC,
  //       icon: <TableIcon />,
  //     },
  //     {
  //       name: "Dynamic Datatable",
  //       href: ROUTES_CONFIG.DATATABLE.DYNAMIC,
  //       icon: <TableIcon />,
  //     },
  //   ],
  // },
];
