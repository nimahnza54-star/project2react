import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { resolveRoute } from './navModel';
import type { NavConfig, NavFilter, Role } from './types';

interface NavContextValue {
  config: NavConfig;
  filter: NavFilter;
}

const NavContext = createContext<NavContextValue | null>(null);

interface NavProviderProps {
  config: NavConfig;
  /** در نسخه واقعی از توکن ورود خوانده می‌شود */
  role: Role;
  mvpOnly?: boolean;
  children: ReactNode;
}

export function NavProvider({ config, role, mvpOnly = false, children }: NavProviderProps) {
  const value = useMemo(() => ({ config, filter: { role, mvpOnly } }), [config, role, mvpOnly]);
  return <NavContext.Provider value={value}>{children}</NavContext.Provider>;
}

export function useNav() {
  const ctx = useContext(NavContext);
  if (!ctx) throw new Error('useNav must be used inside <NavProvider>');
  return ctx;
}

export function useCurrentRoute() {
  const { config } = useNav();
  const { pathname } = useLocation();
  return useMemo(() => resolveRoute(config, pathname), [config, pathname]);
}
