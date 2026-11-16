import { Navigate, Outlet, useLocation } from 'react-router';
import { useAppSelector } from '@/app/store/hooks';
import { PageLoader } from '@/shared/components/ui/PageLoader';
import type { RoleName } from '@/shared/constants/roles';
import { HOME_ROUTE, ROUTES } from '@/shared/constants/routes';

export const RequireAuth = () => {
  const status = useAppSelector((state) => state.auth.status);
  const location = useLocation();

  if (status === 'loading') return <PageLoader />;
  if (status === 'guest') {
    return (
      <Navigate to={ROUTES.login} replace state={{ from: location.pathname }} />
    );
  }
  return <Outlet />;
};

export const GuestOnly = () => {
  const status = useAppSelector((state) => state.auth.status);

  if (status === 'loading') return <PageLoader />;
  if (status === 'authenticated') return <Navigate to={HOME_ROUTE} replace />;
  return <Outlet />;
};

export const RequireRole = ({ role }: { role: RoleName }) => {
  const user = useAppSelector((state) => state.auth.user);

  if (user?.role !== role) return <Navigate to={HOME_ROUTE} replace />;
  return <Outlet />;
};
