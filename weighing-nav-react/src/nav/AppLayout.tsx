import { useEffect, useState, type ReactNode } from 'react';
import { Menu } from 'lucide-react';
import { Outlet, useLocation } from 'react-router-dom';
import { AppSidebar } from './AppSidebar';
import { useCurrentRoute } from './NavContext';
import { usePersistentState } from './usePersistentState';

export function AppLayout({ topbarExtra }: { topbarExtra?: ReactNode }) {
  const [collapsed, setCollapsed] = usePersistentState('wnav.collapsed', false);
  const [drawer, setDrawer] = useState(false);
  const { pathname } = useLocation();
  const current = useCurrentRoute();

  useEffect(() => setDrawer(false), [pathname]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setDrawer(false);
    addEventListener('keydown', onKey);
    return () => removeEventListener('keydown', onKey);
  }, []);
  useEffect(() => {
    document.title = current ? `${current.item.label} | سامانه توزین معادن` : 'سامانه توزین معادن';
  }, [current]);

  return (
    <div className={`app${collapsed ? ' collapsed' : ''}${drawer ? ' drawer' : ''}`}>
      <AppSidebar
        collapsed={collapsed}
        onToggleCollapsed={() => setCollapsed((c) => !c)}
        onExpand={() => setCollapsed(false)}
      />
      <div className="backdrop" onClick={() => setDrawer(false)} />
      <main className="main">
        <div className="topbar">
          <button type="button" className="menu-button burger" aria-label="باز کردن منو" onClick={() => setDrawer(true)}>
            <span className="wrap"><Menu size={20} strokeWidth={1.8} aria-hidden="true" /></span>
          </button>
          {current && (
            <div className="crumbs">
              <span>{current.product.label}</span>
              <span className="sep">‹</span>
              <span>{current.group.group}</span>
              <span className="sep">‹</span>
              <b>{current.item.label}</b>
            </div>
          )}
          {topbarExtra && <div className="controls">{topbarExtra}</div>}
        </div>
        <div className="content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
