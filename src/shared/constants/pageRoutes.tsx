import { ForgotPassword, ResetPassword } from "@/pages/Authentication";
import Login from "@/pages/Authentication/Login/Login";
import Signup from "@/pages/Authentication/SignUp";
import ChangePassword from "@/pages/Authentication/ChangePassword/ChangePassword";
import MFASetup from "@/pages/Authentication/MFASetup/MFASetup";
import MFAVerification from "@/pages/Authentication/MFAVerification/MFAVerification";
import RoleSetup from "@/pages/SuperAdmin/Role/RoleManagement";
import MenuManagement from "@/pages/SuperAdmin/MenuSetup/MenuManagement";
import FirmManagement from "@/pages/SuperAdmin/FirmManagement/FirmManagementTable";
import AuditLogs from "@/pages/SuperAdmin/AuditLogs/AuditLogs";
import FirmModules from "@/pages/SuperAdmin/FirmModules/FirmModules";
import EmployeeManagement from "@/pages/User/EmployeeManagement/EmployeeManagementTable";
import ClientManagement from "@/pages/User/ClientManagement/ClientManagement";
import {
  Archive,
  CaseTypeSetup,
  ClientDashboard,
  Folder,
  Home,
  MyFiles,
  OfficeSetup,
  SharedWithMe,
  SoloDashboard,
  UserManagement,
} from "@/pages/User";
import { CalendarTasksPage } from "@/pages/User/TaskAndCalendar/CalendarTasksPage";
import TaskCalendarPage from "@/pages/User/TaskCalendar/TaskCalendarPage";

import { ROUTES_CONFIG } from "../config";
import PublicRoute from "../routes/PublicRoutes";
import PermissionManagementTable from "@/pages/SuperAdmin/PermissionSetup/PermissionSetupTable";

export const USER_ROUTES = [
  {
    path: ROUTES_CONFIG.USER.ARCHIVE,
    element: <Archive />,
    moduleCode: "ARCHIVE",
  },
  {
    path: ROUTES_CONFIG.USER.CASE_TYPE_SETUP,
    element: <CaseTypeSetup />,
    moduleCode: "CASE_TYPE_SETUP",
  },
  {
    path: ROUTES_CONFIG.USER.FOLDER,
    element: <Folder />,
    moduleCode: "DOCUMENT_MANAGEMENT",
  },
  {
    path: ROUTES_CONFIG.USER.CLIENT_DASHBOARD,
    element: <ClientDashboard />,
    moduleCode: "HOME",
  },
  {
    path: "/calendar",
    element: <CalendarTasksPage />,
    moduleCode: "TASK_CALENDAR",
  },
  {
    path: ROUTES_CONFIG.USER.SOLO_DASHBOARD,
    element: <SoloDashboard />,
    moduleCode: "HOME",
  },
  {
    path: ROUTES_CONFIG.USER.HOME,
    element: <Home />,
    moduleCode: "HOME",
  },
  {
    path: ROUTES_CONFIG.USER.MY_FILES,
    element: <MyFiles />,
    moduleCode: "DOCUMENT_MANAGEMENT",
  },
  {
    path: ROUTES_CONFIG.USER.OFFICE_SETUP,
    element: <OfficeSetup />,
    moduleCode: "FIRM_MANAGEMENT",
  },
  {
    path: ROUTES_CONFIG.USER.SHARED_WITH_ME,
    element: <SharedWithMe />,
    moduleCode: "DOCUMENT_MANAGEMENT",
  },
  {
    path: ROUTES_CONFIG.USER.USER_MANAGEMENT,
    element: <UserManagement />,
    moduleCode: "USER_MANAGEMENT",
  },
  {
    path: ROUTES_CONFIG.USER.ROLE_MANAGEMENT,
    element: <RoleSetup />,
    moduleCode: "ROLE_MANAGEMENT",
  },
  {
    path: ROUTES_CONFIG.USER.MENU_MANAGEMENT,
    element: <MenuManagement />,
    moduleCode: "MENU_MANAGEMENT",
  },
  {
    path: ROUTES_CONFIG.USER.PERMISSION_MANAGEMENT,
    element: <PermissionManagementTable />,
    moduleCode: "PERMISSION_MANAGEMENT",
  },
  {
    path: ROUTES_CONFIG.USER.FIRM_MANAGEMENT,
    element: <FirmManagement />,
    moduleCode: "FIRM_MANAGEMENT",
  },
  {
    path: ROUTES_CONFIG.USER.EMPLOYEE_MANAGEMENT,
    element: <EmployeeManagement />,
    moduleCode: "EMPLOYEE_MANAGEMENT",
  },
  {
    path: ROUTES_CONFIG.USER.TASK_CALENDAR,
    element: <TaskCalendarPage />,
    moduleCode: "TASK_CALENDAR",
  },
  {
    path: ROUTES_CONFIG.USER.CLIENT_MANAGEMENT,
    element: <ClientManagement />,
    moduleCode: "CLIENT_MANAGEMENT",
  },
  {
    path: ROUTES_CONFIG.SUPER_ADMIN.AUDIT_LOGS,
    element: <AuditLogs />,
    moduleCode: "AUDIT_LOGS",
  },
  {
    path: ROUTES_CONFIG.SUPER_ADMIN.FIRM_MODULES,
    element: <FirmModules />,
    moduleCode: "FIRM_MANAGEMENT",
  },
];

export const AUTHENTICATION_ROUTES = [
  {
    path: ROUTES_CONFIG.AUTHENTICATION.FORGOT_PASSWORD,
    element: <ForgotPassword />,
  },
  {
    path: "/auth/login",
    element: <PublicRoute Component={Login} />,
  },
  {
    path: "/auth/client/login",
    element: <PublicRoute Component={Login} />,
  },
  {
    path: "/super-admin/login",
    element: <PublicRoute Component={Login} hasSideContent={false} />,
  },

  {
    path: "/auth/register/solo",
    element: <PublicRoute Component={Signup} />,
  },
  {
    path: "/auth/register/client",
    element: <PublicRoute Component={Signup} />,
  },
  {
    path: ROUTES_CONFIG.AUTHENTICATION.RESET_PASSWORD,
    element: <ResetPassword />,
  },
  {
    path: ROUTES_CONFIG.AUTHENTICATION.CHANGE_PASSWORD,
    element: <PublicRoute Component={ChangePassword} />,
  },
  {
    path: ROUTES_CONFIG.AUTHENTICATION.MFA_SETUP,
    element: <PublicRoute Component={MFASetup} />,
  },
  {
    path: ROUTES_CONFIG.AUTHENTICATION.MFA_VERIFICATION,
    element: <PublicRoute Component={MFAVerification} />,
  },
];
