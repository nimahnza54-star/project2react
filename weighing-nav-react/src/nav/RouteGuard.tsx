import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useNav } from './NavContext';
import { firstAllowedRoute, isItemVisible } from './navModel';
import type { ResolvedRoute } from './types';

/**
 * پنهان کردن آیتم در منو امنیت نیست؛ این guard جلوی باز شدن مستقیم آدرس را می‌گیرد.
 * کنترل اصلی دسترسی باید در API هم انجام شود.
 */
export function RouteGuard({ route, children }: { route: ResolvedRoute; children: ReactNode }) {
  const { config, filter } = useNav();
  if (isItemVisible(route.product, route.group, route.item, filter)) return <>{children}</>;
  const home = firstAllowedRoute(config, filter);
  return (
    <div className="page">
      <h1>دسترسی ندارید</h1>
      <p className="sub">نقش شما اجازه دیدن «{route.item.label}» را نمی‌دهد. اگر به این صفحه نیاز دارید، از مدیر سامانه بخواهید دسترسی را اضافه کند.</p>
      {home && <Link className="btn" to={home}>رفتن به صفحه اصلی</Link>}
    </div>
  );
}
