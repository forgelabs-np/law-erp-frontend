import { ForgotPassword, ResetPassword } from "@/pages/Authentication";
import Login from "@/pages/Authentication/Login/Login";
import { FirmHeroPanel } from "@/pages/Authentication/Login/LoginHeroPanel";
import { SuperAdminHeroPanel } from "@/pages/Authentication/Login/HeroPanels/SuperAdminHeroPanel";
import { ClientHeroPanel } from "@/pages/Authentication/Login/HeroPanels/ClientHeroPanel";
import Signup from "@/pages/Authentication/SignUp";
import ChangePassword from "@/pages/Authentication/ChangePassword/ChangePassword";
import MFASetup from "@/pages/Authentication/MFASetup/MFASetup";
import MFAVerification from "@/pages/Authentication/MFAVerification/MFAVerification";
import RoleSetup from "@/pages/SuperAdmin/Role/RoleManagement";
import UserRoleDetails from "@/pages/SuperAdmin/Role/UserRoleDetails/UserRoleDetails";
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
  UserProfilePage,
  UserPermissionsPage,
  UserActivityPage,
} from "@/pages/User";
import { CalendarTasksPage } from "@/pages/User/TaskAndCalendar/CalendarTasksPage";
import TaskCalendarPage from "@/pages/User/TaskCalendar/TaskCalendarPage";
import MattersListPage from "@/pages/User/CaseManagement/pages/MattersListPage";
import CreateMatterPage from "@/pages/User/CaseManagement/pages/CreateMatterPage";
import MatterDetailPage from "@/pages/User/CaseManagement/pages/MatterDetailPage";
import CourtCaseDetailPage from "@/pages/User/CaseManagement/pages/CourtCaseDetailPage";
import FirmActivityPage from "@/pages/User/CaseManagement/pages/FirmActivityPage";
import StaleMattersPage from "@/pages/User/CaseManagement/pages/StaleMattersPage";
import CaseDashboardPage from "@/pages/User/CaseManagement/pages/CaseDashboardPage";
import ScraperManagementPage from "@/pages/User/ScraperManagement/ScraperManagementPage";
import GlobalDashboardPage from "@/pages/User/CaseManagement/pages/GlobalDashboardPage";
import {
  ProjectDashboardPage,
  ProjectListPage,
  CreateProjectPage,
  EditProjectPage,
  ProjectDetailPage,
  RenewalTypesPage,
  ClientProjectsPage,
  ClientProjectDetailPage,
} from "@/pages/User/ProjectManagement";

import { ROUTES_CONFIG } from "../config";
import PublicRoute from "../routes/PublicRoutes";
import PermissionManagementTable from "@/pages/SuperAdmin/PermissionSetup/PermissionSetupTable";
import GlobalConfigurationPage from "@/pages/SuperAdmin/ConfigurationManagement/GlobalConfiguration/GlobalConfigurationPage";
import FirmConfigurationPage from "@/pages/SuperAdmin/ConfigurationManagement/FirmConfiguration/FirmConfigurationPage";

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
    path: ROUTES_CONFIG.USER.USER_PROFILE,
    element: <UserProfilePage />,
    moduleCode: "USER_MANAGEMENT",
  },
  {
    path: ROUTES_CONFIG.USER.USER_PERMISSIONS,
    element: <UserPermissionsPage />,
    moduleCode: "USER_MANAGEMENT",
  },
  {
    path: ROUTES_CONFIG.USER.USER_ACTIVITY,
    element: <UserActivityPage />,
    moduleCode: "USER_MANAGEMENT",
  },
  {
    path: ROUTES_CONFIG.USER.ROLE_MANAGEMENT,
    element: <RoleSetup />,
    moduleCode: "ROLE_MANAGEMENT",
  },
  {
    path: ROUTES_CONFIG.USER.ROLE_MANAGEMENT_DETAILS,
    element: <UserRoleDetails />,
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
    roles: ["FIRM_ADMIN"],
  },
  {
    path: ROUTES_CONFIG.USER.CASE_MANAGEMENT,
    element: <CaseDashboardPage />,
    moduleCode: "CASE_MANAGEMENT",
  },
  {
    path: ROUTES_CONFIG.USER.CASE_MANAGEMENT_MATTERS,
    element: <MattersListPage />,
    moduleCode: "CASE_MANAGEMENT",
  },
  {
    path: ROUTES_CONFIG.USER.CASE_MANAGEMENT_CREATE,
    element: <CreateMatterPage />,
    moduleCode: "CASE_MANAGEMENT",
  },
  {
    path: ROUTES_CONFIG.USER.CASE_MANAGEMENT_DETAIL,
    element: <MatterDetailPage />,
    moduleCode: "CASE_MANAGEMENT",
  },
  {
    path: ROUTES_CONFIG.USER.CASE_MANAGEMENT_COURT_CASE,
    element: <CourtCaseDetailPage />,
    moduleCode: "CASE_MANAGEMENT",
  },
  {
    path: ROUTES_CONFIG.USER.FIRM_ACTIVITY,
    element: <FirmActivityPage />,
    moduleCode: "CASE_MANAGEMENT",
  },
  {
    path: ROUTES_CONFIG.USER.STALE_MATTERS,
    element: <StaleMattersPage />,
    moduleCode: "CASE_MANAGEMENT",
  },
  {
    path: ROUTES_CONFIG.USER.SCRAPER_MANAGEMENT,
    element: <ScraperManagementPage />,
    moduleCode: "SCRAPER_MANAGEMENT",
  },
  {
    path: ROUTES_CONFIG.USER.GLOBAL_DASHBOARD,
    element: <GlobalDashboardPage />,
    moduleCode: "GLOBAL_DASHBOARD",
  },
  {
    path: ROUTES_CONFIG.USER.PROJECT_MANAGEMENT,
    element: <ProjectDashboardPage />,
    moduleCode: "PROJECT_MANAGEMENT",
  },
  {
    path: ROUTES_CONFIG.USER.PROJECT_MANAGEMENT_PROJECTS,
    element: <ProjectListPage />,
    moduleCode: "PROJECT_MANAGEMENT",
  },
  {
    path: ROUTES_CONFIG.USER.PROJECT_MANAGEMENT_CREATE,
    element: <CreateProjectPage />,
    moduleCode: "PROJECT_MANAGEMENT",
  },
  {
    path: ROUTES_CONFIG.USER.PROJECT_MANAGEMENT_EDIT,
    element: <EditProjectPage />,
    moduleCode: "PROJECT_MANAGEMENT",
  },
  {
    path: ROUTES_CONFIG.USER.PROJECT_MANAGEMENT_DETAIL,
    element: <ProjectDetailPage />,
    moduleCode: "PROJECT_MANAGEMENT",
  },
  {
    path: ROUTES_CONFIG.USER.PROJECT_MANAGEMENT_RENEWAL_TYPES,
    element: <RenewalTypesPage />,
    moduleCode: "PROJECT_MANAGEMENT",
  },
  {
    path: ROUTES_CONFIG.USER.CLIENT_PROJECTS,
    element: <ClientProjectsPage />,
    moduleCode: "PROJECT_MANAGEMENT",
    roles: ["CLIENT"],
  },
  {
    path: ROUTES_CONFIG.USER.CLIENT_PROJECT_DETAIL,
    element: <ClientProjectDetailPage />,
    moduleCode: "PROJECT_MANAGEMENT",
    roles: ["CLIENT"],
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
  {
    path: ROUTES_CONFIG.SUPER_ADMIN.GLOBAL_CONFIG,
    element: <GlobalConfigurationPage />,
    moduleCode: "GLOBAL_CONFIG",
  },
  {
    path: ROUTES_CONFIG.SUPER_ADMIN.FIRM_CONFIG,
    element: <FirmConfigurationPage />,
    moduleCode: "FIRM_CONFIG",
  },
];

export const AUTHENTICATION_ROUTES = [
  {
    path: ROUTES_CONFIG.AUTHENTICATION.FORGOT_PASSWORD,
    element: <ForgotPassword />,
  },
  {
    path: "/auth/login",
    element: (
      <PublicRoute
        Component={Login}
        variant="split"
        sideContent={<FirmHeroPanel />}
      />
    ),
  },
  {
    path: "/auth/client/login",
    element: (
      <PublicRoute
        Component={Login}
        variant="split"
        sideContent={<ClientHeroPanel />}
      />
    ),
  },
  {
    path: "/super-admin/login",
    element: (
      <PublicRoute
        Component={Login}
        variant="split"
        sideContent={<SuperAdminHeroPanel />}
      />
    ),
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
