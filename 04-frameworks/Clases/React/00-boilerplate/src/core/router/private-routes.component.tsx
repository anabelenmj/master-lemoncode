import { Navigate, Outlet } from "react-router";
import { ROUTES } from "./routes";
import { useAuthContext } from "#core/auth";
import { CenterLayout } from "#layout/center.layout.tsx";
import { Spinner } from "#common/components/spinner.component.tsx";

export const PrivateRoutes = () => {
  const { userSession, isChecking } = useAuthContext();

  if (isChecking) {
    return (
      <CenterLayout>
        <Spinner />
      </CenterLayout>
    );
  }

  return userSession ? <Outlet /> : <Navigate to={ROUTES.LOGIN} replace />;
};