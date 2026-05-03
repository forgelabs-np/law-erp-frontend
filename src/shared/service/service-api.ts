export const api = {
  login: "auth/login",
  signup: "auth/register/solo",
  refreshToken: "auth/refresh",
  loginClient: "auth/client/login",
  registerClient: "auth/register/client",
  superAdminLogin: "super-admin/login",
  USER_MANAGEMENT: {
    ROLE_SETUP: {
      GET_ROLES: "admin/roles",
      ADD_EDIT: "admin/roles",
      GET_BY_ID: "admin/roles/{roleId}",
      TOGGLE: "admin/roles/{roleId}/toggle",
      DROPDOWN: "admin/roles/dropdown",
    },
    PERMISSION_SETUP: {
      GET_PERMISSIONS: "admin/permissions",
    },
  },
};
