import { Navigate, Route, Routes } from 'react-router-dom';
import rawConfig from './nav/nav.config.json';
import {
  AppLayout, NavProvider, RouteGuard, allRoutes, firstAllowedRoute, usePersistentState,
  type NavConfig, type Role,
} from './nav';
import { AuthControls, AuthProvider, GuestOnly, RequireAuth } from './auth';
import { mockAuthenticate } from './mocks/auth.mock';
import { LoginPage } from './pages/LoginPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { PlaceholderPage } from './pages/PlaceholderPage';

const config = rawConfig as NavConfig;
const routes = allRoutes(config);

export default function App() {
  // نقش نمایشی برای آزمون مجوزها؛ در نسخه واقعی نقش از منبع احراز هویت می‌آید.
  // احراز هویت (AuthProvider) و مجوز نقش (NavProvider) عمداً جدا نگه داشته شده‌اند.
  const [role, setRole] = usePersistentState<Role>('wnav.role', 'support');
  const [mvpOnly, setMvpOnly] = usePersistentState('wnav.mvp', false);
  const home = firstAllowedRoute(config, { role, mvpOnly }) ?? '/account/profile';

  const demoControls = (
    <>
      <label>
        نقش نمایشی{' '}
        <select value={role} onChange={(e) => setRole(e.target.value as Role)}>
          {config.roles.map((r) => (
            <option key={r.id} value={r.id}>{r.label}</option>
          ))}
        </select>
      </label>
      <label>
        <input type="checkbox" checked={mvpOnly} onChange={(e) => setMvpOnly(e.target.checked)} /> فقط فاز اول (Must)
      </label>
    </>
  );

  return (
    <AuthProvider authenticate={mockAuthenticate}>
      <NavProvider config={config} role={role} mvpOnly={mvpOnly}>
        <Routes>
          <Route element={<GuestOnly redirectTo={home} />}>
            <Route path="/login" element={<LoginPage />} />
          </Route>
          <Route element={<RequireAuth />}>
            <Route
              element={
                <AppLayout
                  topbarExtra={
                    <>
                      <AuthControls />
                      {demoControls}
                    </>
                  }
                />
              }
            >
              <Route index element={<Navigate to={home} replace />} />
              {routes.map((r) => (
                <Route
                  key={r.item.to}
                  path={r.item.to}
                  element={
                    <RouteGuard route={r}>
                      <PlaceholderPage route={r} />
                    </RouteGuard>
                  }
                />
              ))}
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Route>
        </Routes>
      </NavProvider>
    </AuthProvider>
  );
}
