import { useRoutes } from "react-router-dom";

import { Layout } from "../components";
import { AUTHENTICATION_ROUTES, USER_ROUTES } from "../constants";

export const AppRoutes = () => {
  // const authenticated = TokenService.isAuthenticated();
  const authenticated = true;

  const routes = useRoutes(authenticated ? USER_ROUTES : AUTHENTICATION_ROUTES);

  if (authenticated) {
    return <Layout>{routes}</Layout>;
  }

  return routes;
};
