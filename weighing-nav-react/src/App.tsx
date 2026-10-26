import { Navigate, Route, Routes } from 'react-router-dom';
import rawConfig from './nav/nav.config.json';
import {
  AppLayout, NavProvider, RouteGuard, allRoutes, firstAllowedRoute, usePersistentState,
  type NavConfig, type Role,
} from './nav';
import { NotFoundPage } from './pages/NotFoundPage';
import { PlaceholderPage } from './pages/PlaceholderPage';

const config = rawConfig as NavConfig;
const routes = allRoutes(config);

export default function App() {
  // در نسخه واقعی role از توکن ورود می‌آید و این دو کنترل حذف می‌شوند
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
    <NavProvider config={config} role={role} mvpOnly={mvpOnly}>
      <Routes>
        <Route element={<AppLayout topbarExtra={demoControls} />}>
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
      </Routes>
    </NavProvider>
  );
}
