import { LoaderCircle } from 'lucide-react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import './auth.css';

function SessionLoading() {
  return (
    <div className="auth-loading" role="status" aria-live="polite">
      <LoaderCircle className="auth-spinner" size={28} strokeWidth={1.8} aria-hidden="true" />
      <span>در حال بررسی نشست...</span>
    </div>
  );
}

/** مسیرهای محافظت‌شده: تا پایان بررسی نشست هیچ محتوایی نمایش داده نمی‌شود. */
export function RequireAuth() {
  const { status } = useAuth();
  const location = useLocation();

  if (status === 'initializing') return <SessionLoading />;
  if (status === 'unauthenticated') {
    return <Navigate to="/login" replace state={{ from: location.pathname + location.search }} />;
  }
  return <Outlet />;
}

/** مسیرهای عمومی (ورود): کاربر دارای نشست معتبر به داشبورد هدایت می‌شود. */
export function GuestOnly({ redirectTo }: { redirectTo: string }) {
  const { status } = useAuth();

  if (status === 'initializing') return <SessionLoading />;
  if (status === 'authenticated') return <Navigate to={redirectTo} replace />;
  return <Outlet />;
}
