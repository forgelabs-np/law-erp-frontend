import { ForgotPassword, ResetPassword } from "@/pages/Authentication";
import Login from "@/pages/Authentication/Login/Login";
import Signup from "@/pages/Authentication/SignUp";
import RoleSetup from "@/pages/SuperAdmin/Role/RoleManagement";
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

import { ROUTES_CONFIG } from "../config";
import PublicRoute from "../routes/PublicRoutes";

export const USER_ROUTES = [
  {
    path: ROUTES_CONFIG.USER.ARCHIVE,
    element: <Archive />,
  },
  {
    path: ROUTES_CONFIG.USER.CASE_TYPE_SETUP,
    element: <CaseTypeSetup />,
  },
  {
    path: ROUTES_CONFIG.USER.FOLDER,
    element: <Folder />,
  },
  {
    path: ROUTES_CONFIG.USER.CLIENT_DASHBOARD,
    element: <ClientDashboard />,
  },
  {
    path: "/calendar",
    element: <CalendarTasksPage />,
  },
  {
    path: ROUTES_CONFIG.USER.SOLO_DASHBOARD,
    element: <SoloDashboard />,
  },
  {
    path: ROUTES_CONFIG.USER.HOME,
    element: <Home />,
  },
  {
    path: ROUTES_CONFIG.USER.MY_FILES,
    element: <MyFiles />,
  },
  {
    path: ROUTES_CONFIG.USER.OFFICE_SETUP,
    element: <OfficeSetup />,
  },
  {
    path: ROUTES_CONFIG.USER.SHARED_WITH_ME,
    element: <SharedWithMe />,
  },
  {
    path: ROUTES_CONFIG.USER.USER_MANAGEMENT,
    element: <UserManagement />,
  },
  {
    path: ROUTES_CONFIG.USER.ROLE_MANAGEMENT,
    element: <RoleSetup />,
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
];
