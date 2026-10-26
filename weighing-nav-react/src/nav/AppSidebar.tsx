import { PanelRight, Scale } from 'lucide-react';
import { Link } from 'react-router-dom';
import { NavIcon } from './NavIcon';
import { NavPanel } from './NavPanel';
import { useCurrentRoute, useNav } from './NavContext';
import { allProducts, firstAllowedRoute, firstRoute } from './navModel';
import type { Product } from './types';

interface AppSidebarProps {
  collapsed: boolean;
  onToggleCollapsed: () => void;
  onExpand: () => void;
  brandLabel?: string;
}

export function AppSidebar({ collapsed, onToggleCollapsed, onExpand, brandLabel = 'سامانه توزین معادن' }: AppSidebarProps) {
  const { config, filter } = useNav();
  const current = useCurrentRoute();
  const home = firstAllowedRoute(config, filter) ?? '/';

  const visible = (list: Product[]) =>
    list.map((p) => ({ p, to: firstRoute(config, p, filter) })).filter((x): x is { p: Product; to: string } => !!x.to);

  const activeProduct =
    (current && firstRoute(config, current.product, filter) ? current.product : null) ??
    allProducts(config).find((p) => firstRoute(config, p, filter));

  const railLink = ({ p, to }: { p: Product; to: string }) => {
    const selected = activeProduct?.id === p.id;
    return (
      <li key={p.id}>
        <Link
          to={to}
          className={`menu-button${selected ? ' selected' : ''}`}
          aria-label={p.label}
          data-tip={p.label}
          aria-current={selected ? 'true' : undefined}
          onClick={() => collapsed && onExpand()}
        >
          <span className="wrap"><NavIcon name={p.icon} /></span>
        </Link>
      </li>
    );
  };

  return (
    <aside className="ar-sidebar" aria-label="ناوبری اصلی">
      <nav className="ar-aside-pmenu" aria-label="بخش‌ها">
        <div className="rail-header">
          <button
            type="button"
            className="menu-button rail-toggle"
            aria-label="باز و بسته کردن منو"
            aria-expanded={!collapsed}
            data-tip="باز و بسته کردن منو"
            onClick={onToggleCollapsed}
          >
            <span className="wrap"><PanelRight size={20} strokeWidth={1.8} aria-hidden="true" /></span>
          </button>
          <Link to={home} className="menu-button menu-button--branded" aria-label={brandLabel} data-tip={brandLabel}>
            <span className="wrap"><Scale size={20} strokeWidth={1.8} aria-hidden="true" /></span>
          </Link>
        </div>
        <ul className="menu-products">{visible(config.products).map(railLink)}</ul>
        <ul className="menu-settings">{visible(config.footer).map(railLink)}</ul>
      </nav>
      {activeProduct && <NavPanel product={activeProduct} />}
    </aside>
  );
}
