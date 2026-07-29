import { Navigate, useRoutes, type RouteObject } from "react-router-dom";

import { Layout } from "../components";
import { AUTHENTICATION_ROUTES, USER_ROUTES } from "../constants";
import TokenService from "../service/service-token";

/**
 * Strip the custom `moduleCode` property (not a standard RouteObject prop)
 * from route objects before passing them to React Router's `useRoutes`.
 * This avoids any potential issues with extra properties on route objects.
 */
const toRouterRoute = (route: (typeof USER_ROUTES)[number]): RouteObject => {
  const { moduleCode: _, ...routerRoute } = route;
  return routerRoute;
};

export const AppRoutes = () => {
  const authenticated = TokenService.isAuthenticated();

  const authRoutes = [
    ...AUTHENTICATION_ROUTES,
    { path: "/", element: <Navigate to="/auth/login" replace /> },
    { path: "*", element: <Navigate to="/auth/login" replace /> },
  ];

  const userRoutes = [
    ...USER_ROUTES.map(toRouterRoute),
    { path: "*", element: <Navigate to="/" replace /> },
  ];

  const routes = useRoutes(authenticated ? userRoutes : authRoutes);

  if (authenticated) {
    return <Layout>{routes}</Layout>;
  }

  return routes;
};
