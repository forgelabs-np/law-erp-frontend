import { TravelConnectSidePanel } from "@/pages/Authentication/Login/DotMap";

import { UnAuthLayoutAdmin } from "../components/layout/UnAuthLayout";

const PublicRoute = ({
  Component,
}: {
  Component: React.ComponentType;
  hasSideContent?: boolean;
}) => {
  //   const token = TokenService.getToken();

  //   if (token?.accessToken) {
  //     return <Navigate to="/" replace />;
  //   }

  return (
    <UnAuthLayoutAdmin sideContent={<TravelConnectSidePanel />}>
      <Component />
    </UnAuthLayoutAdmin>
  );
};

export default PublicRoute;
