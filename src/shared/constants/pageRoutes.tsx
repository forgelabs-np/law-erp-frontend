import { ForgotPassword, Login, ResetPassword } from "@/pages/Authentication";
import {
  Archive,
  CaseTypeSetup,
  Folder,
  Home,
  MyFiles,
  OfficeSetup,
  SharedWithMe,
  UserManagement,
} from "@/pages/User";

import { ROUTES_CONFIG } from "../config";

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
];

export const AUTHENTICATION_ROUTES = [
  {
    path: ROUTES_CONFIG.AUTHENTICATION.FORGOT_PASSWORD,
    element: <ForgotPassword />,
  },
  {
    path: ROUTES_CONFIG.AUTHENTICATION.LOGIN,
    element: <Login />,
  },
  {
    path: ROUTES_CONFIG.AUTHENTICATION.RESET_PASSWORD,
    element: <ResetPassword />,
  },
];
