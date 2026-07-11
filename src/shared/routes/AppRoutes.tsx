import { Navigate, useRoutes } from "react-router-dom";

import { Layout } from "../components";
import { AUTHENTICATION_ROUTES, USER_ROUTES } from "../constants";
import TokenService from "../service/service-token";

export const AppRoutes = () => {
  const authenticated = TokenService.isAuthenticated();

  const authRoutes = [
    ...AUTHENTICATION_ROUTES,
    { path: "/", element: <Navigate to="/auth/login" replace /> },
    { path: "*", element: <Navigate to="/auth/login" replace /> },
  ];

  const userRoutes = [
    ...USER_ROUTES,
    { path: "*", element: <Navigate to="/" replace /> },
  ];

  const routes = useRoutes(authenticated ? userRoutes : authRoutes);

  if (authenticated) {
    return <Layout>{routes}</Layout>;
  }

  return routes;
};
