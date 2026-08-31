import { Navigate, useRoutes, type RouteObject } from "react-router-dom";
import { useEffect, useState } from "react";

import { Layout } from "../components";
import { ModuleRouteGuard } from "../components/ModuleRouteGuard";
import { AUTHENTICATION_ROUTES, USER_ROUTES } from "../constants";
import TokenService from "../service/service-token";
import { useRole } from "../hooks/useAuth";
import { checkAuthentication } from "@/api/auth";

/**
 * Strip the custom `moduleCode`, `requiredAction`, and `roles` properties
 * (not standard RouteObject props) from route objects before passing them
 * to React Router's `useRoutes`.
 */
const toRouterRoute = (route: (typeof USER_ROUTES)[number]): RouteObject => {
  const { moduleCode: _, requiredAction: __, roles: ___, ...routerRoute } =
    route;
  return routerRoute;
};

/**
 * Wrap a route element with ModuleRouteGuard when it has a moduleCode.
 * Passes `action` from the route's `requiredAction` so the guard
 * checks both ACCESS and the specified action (e.g. VIEW).
 */
const wrapWithGuard = (route: (typeof USER_ROUTES)[number]) => {
  const guardedElement = route.moduleCode ? (
    <ModuleRouteGuard
      moduleCode={route.moduleCode}
      action={route.requiredAction}
    >
      {route.element}
    </ModuleRouteGuard>
  ) : (
    route.element
  );

  return {
    ...route,
    element: guardedElement,
  };
};

export const AppRoutes = () => {
  const [isInitializing, setIsInitializing] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const userRole = useRole();

  useEffect(() => {
    const initializeAuth = async () => {
      const token = TokenService.getToken();
      const tokenDetails = TokenService.getTokenDetails();

      // If we have a valid access token (not expired), use it
      if (tokenDetails && tokenDetails.exp * 1000 > Date.now()) {
        setAuthenticated(true);
        setIsInitializing(false);
        return;
      }

      // If access token is expired but we have a refresh token, attempt refresh
      if (token?.refresh_token) {
        const refreshSuccess = await checkAuthentication();
        setAuthenticated(refreshSuccess === true);
      } else {
        // No valid tokens
        setAuthenticated(false);
      }

      setIsInitializing(false);
    };

    initializeAuth();
  }, []);

  // Listen for token changes (e.g., when MFA sets new tokens)
  useEffect(() => {
    const handleTokenChange = () => {
      const tokenDetails = TokenService.getTokenDetails();
      const isValid = tokenDetails && tokenDetails.exp * 1000 > Date.now();
      setAuthenticated(isValid || false);
    };

    window.addEventListener("tokenChanged", handleTokenChange);
    return () => window.removeEventListener("tokenChanged", handleTokenChange);
  }, []);

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
    return route.roles.includes(roleCode);
  });

  // Wrap each route with ModuleRouteGuard based on its moduleCode + requiredAction
  const guardedRoutes = filteredUserRoutes.map(wrapWithGuard);

  const userRoutes = [
    ...guardedRoutes.map(toRouterRoute),
    { path: "*", element: <Navigate to="/" replace /> },
  ];

  const routes = useRoutes(authenticated ? userRoutes : authRoutes);

  // Show loading state during auth initialization
  if (isInitializing) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          fontSize: "16px",
          color: "#666",
        }}
      >
        Loading...
      </div>
    );
  }

  if (authenticated) {
    return <Layout>{routes}</Layout>;
  }

  return routes;
};
