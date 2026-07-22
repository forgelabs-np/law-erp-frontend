export const ROUTES_CONFIG = {
  AUTHENTICATION: {
    FORGOT_PASSWORD: "/auth/forgot-password",
    LOGIN: "/auth/login",
    RESET_PASSWORD: "/auth/reset-password",
    SIGNUP: "/auth/signup",
  },
  USER: {
    CLIENT_DASHBOARD: "/client/dashboard",
    SOLO_DASHBOARD: "/solo/dashboard",
    ARCHIVE: "/archive",
    CASE_TYPE_SETUP: "/case-type-setup",
    FOLDER: "/folder",
    HOME: "/",
    MY_FILES: "/my-files",
    OFFICE_SETUP: "/office-setup",
    SHARED_WITH_ME: "/shared-with-me",
    USER_MANAGEMENT: "/user-management",
    ROLE_MANAGEMENT: "/role-management",
    MENU_MANAGEMENT: "/menu-management",
    PERMISSION_MANAGEMENT: "/permission-management",
    EMPLOYEE_MANAGEMENT: "/employee-management",
    FIRM_MANAGEMENT: "/firm-management",
    TASK_CALENDAR: "/task-calendar",
    CLIENT_MANAGEMENT: "/client-management",
  },
  SUPER_ADMIN: {
    AUDIT_LOGS: "/super-admin/audit-logs",
    FIRM_MODULES: "/firm-management/:firmId/modules",
  },

  NO_MATCH: "*",
};
