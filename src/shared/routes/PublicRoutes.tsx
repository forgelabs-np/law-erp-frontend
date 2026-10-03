import { UnAuthLayoutAdmin } from "../components/layout/UnAuthLayout";

const PublicRoute = ({
  Component,
  variant = "center",
  sideContent,
}: {
  Component: React.ComponentType;
  hasSideContent?: boolean;
  variant?: "center" | "split";
  sideContent?: React.ReactNode;
}) => {
  //   const token = TokenService.getToken();

  //   if (token?.accessToken) {
  //     return <Navigate to="/" replace />;
  //   }

  return (
    <UnAuthLayoutAdmin variant={variant} sideContent={sideContent}>
      <Component />
    </UnAuthLayoutAdmin>
  );
};

export default PublicRoute;
