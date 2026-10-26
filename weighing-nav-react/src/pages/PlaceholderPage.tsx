import { useNav } from '../nav/NavContext';
import { NavIcon } from '../nav/NavIcon';
import { minRoleOf } from '../nav/navModel';
import type { ResolvedRoute } from '../nav/types';

const PRIORITY_LABEL = { M: 'فاز اول (Must)', S: 'Should', C: 'Could' } as const;

/** صفحه موقت هر مسیر تا زمان ساخت صفحه واقعی */
export function PlaceholderPage({ route }: { route: ResolvedRoute }) {
  const { config } = useNav();
  const { product, group, item } = route;
  const priority = item.priority ?? 'M';
  const minRole = minRoleOf(product, group, item);
  const roleLabel = config.roles.find((r) => r.id === minRole)?.label ?? minRole;

  return (
    <div className="page">
      <h1>{item.label}</h1>
      <div className="sub">{product.label}، گروه {group.group}</div>
      <div className="meta">
        <span className={`chip ${priority}`}>اولویت: {PRIORITY_LABEL[priority]}</span>
        <span className="chip">دسترسی از نقش «{roleLabel}» به بالا</span>
        <span className="chip">مسیر <code>{item.to}</code></span>
      </div>
      <div className="placeholder">
        <NavIcon name={product.icon} size={36} />
        <div>محتوای صفحه «{item.label}» اینجا قرار می‌گیرد.</div>
      </div>
    </div>
  );
}
