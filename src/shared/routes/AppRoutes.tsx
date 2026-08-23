import { Navigate, useRoutes, type RouteObject } from "react-router-dom";

import { Layout } from "../components";
import { AUTHENTICATION_ROUTES, USER_ROUTES } from "../constants";
import TokenService from "../service/service-token";
import { useRole } from "../hooks/useAuth";

/**
 * Strip the custom `moduleCode` and `roles` properties (not standard RouteObject props)
 * from route objects before passing them to React Router's `useRoutes`.
 * This avoids any potential issues with extra properties on route objects.
 */
const toRouterRoute = (route: (typeof USER_ROUTES)[number]): RouteObject => {
  const { moduleCode: _, roles: __, ...routerRoute } = route;
  return routerRoute;
};

export const AppRoutes = () => {
  const authenticated = TokenService.isAuthenticated();
  const userRole = useRole();
  console.log("userRole", userRole);

  const authRoutes = [
    ...AUTHENTICATION_ROUTES,
    { path: "/", element: <Navigate to="/auth/login" replace /> },
    { path: "*", element: <Navigate to="/auth/login" replace /> },
  ];

  // Filter routes based on role if roles are specified
  const filteredUserRoutes = USER_ROUTES.filter((route) => {
    if (!route.roles) return true; // No role restriction, allow access
    // Handle both string role and object role with code property
    const roleCode =
      typeof userRole === "object" && (userRole as any)?.code
        ? (userRole as any).code
        : userRole;
    return route.roles.includes(roleCode); // Check if user's role code is in allowed roles
  });

  const userRoutes = [
    ...filteredUserRoutes.map(toRouterRoute),
    { path: "*", element: <Navigate to="/" replace /> },
  ];

  const routes = useRoutes(authenticated ? userRoutes : authRoutes);

  if (authenticated) {
    return <Layout>{routes}</Layout>;
  }

  return routes;
};
