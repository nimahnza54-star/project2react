import { NavGroup } from './NavGroup';
import { NavIcon } from './NavIcon';
import { useNav } from './NavContext';
import { visibleGroups } from './navModel';
import { usePersistentState } from './usePersistentState';
import type { Product } from './types';

export function NavPanel({ product }: { product: Product }) {
  const { config, filter } = useNav();
  const [openMap, setOpenMap] = usePersistentState<Record<string, boolean>>('wnav.open', {});
  const groups = visibleGroups(config, product, filter);

  return (
    <div className="ar-aside-menu">
      <div className="menu-header">
        <span className="hicon"><NavIcon name={product.icon} /></span>
        <div>
          <div className="t">{product.label}</div>
          {product.caption && <div className="c">{product.caption}</div>}
        </div>
      </div>
      <nav aria-label={product.label}>
        <ol className="menu-items__list--parent">
          {groups.map((g, i) => {
            const key = `${product.id}:${g.group}`;
            const open = openMap[key] ?? g.open !== false;
            return (
              <NavGroup
                key={key}
                id={`${product.id}-${i}`}
                title={g.group}
                items={g.items}
                open={open}
                onToggle={() => setOpenMap((m) => ({ ...m, [key]: !open }))}
              />
            );
          })}
        </ol>
      </nav>
    </div>
  );
}
