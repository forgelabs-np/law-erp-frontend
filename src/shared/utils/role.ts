/**
 * The authenticated user's role arrives from `/me` as a plain code string, but
 * a few legacy call sites stored an object. This resolver normalises both so
 * role checks stay in one place.
 */
export const resolveRoleCode = (role: unknown): string => {
  if (typeof role === "string") return role;
  if (role && typeof role === "object" && "code" in role) {
    const code = (role as { code?: unknown }).code;
    if (typeof code === "string") return code;
  }
  return "";
};

/** Super Admin bypasses per-permission checks on the backend. */
export const isSuperAdminRole = (role: unknown): boolean =>
  resolveRoleCode(role).toUpperCase() === "SUPER_ADMIN";
