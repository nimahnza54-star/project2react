import type { NavConfig, NavFilter, NavGroup, NavItem, Product, ResolvedRoute, Role } from './types';

export const ROLE_RANK: Record<Role, number> = { user: 0, expert: 1, manager: 2, support: 3 };

export const hasRole = (role: Role, min: Role = 'user') => ROLE_RANK[role] >= ROLE_RANK[min];

export const allProducts = (cfg: NavConfig): Product[] => [...cfg.products, ...cfg.footer];

const normalize = (path: string) => (path.length > 1 ? path.replace(/\/+$/, '') : path);

/** نزدیک‌ترین minRole برنده است: آیتم، سپس گروه، سپس بخش */
export const minRoleOf = (p: Product, g: NavGroup, it: NavItem): Role =>
  it.minRole ?? g.minRole ?? p.minRole ?? 'user';

export function isItemVisible(p: Product, g: NavGroup, it: NavItem, f: NavFilter): boolean {
  if (!hasRole(f.role, minRoleOf(p, g, it))) return false;
  if (f.mvpOnly && (it.priority ?? 'M') !== 'M') return false;
  return true;
}

export function visibleGroups(cfg: NavConfig, p: Product, f: NavFilter): NavGroup[] {
  return (cfg.menus[p.id] ?? [])
    .map((g) => ({ ...g, items: g.items.filter((it) => isItemVisible(p, g, it, f)) }))
    .filter((g) => g.items.length > 0);
}

export function firstRoute(cfg: NavConfig, p: Product, f: NavFilter): string | null {
  return visibleGroups(cfg, p, f)[0]?.items[0]?.to ?? null;
}

export function firstAllowedRoute(cfg: NavConfig, f: NavFilter): string | null {
  for (const p of allProducts(cfg)) {
    const to = firstRoute(cfg, p, f);
    if (to) return to;
  }
  return null;
}

/** همه مسیرهای تعریف‌شده، مستقل از نقش؛ برای ساخت Routeها */
export function allRoutes(cfg: NavConfig): ResolvedRoute[] {
  return allProducts(cfg).flatMap((product) =>
    (cfg.menus[product.id] ?? []).flatMap((group) => group.items.map((item) => ({ product, group, item }))),
  );
}

export function resolveRoute(cfg: NavConfig, pathname: string): ResolvedRoute | null {
  const path = normalize(pathname);
  return allRoutes(cfg).find((r) => r.item.to === path) ?? null;
}
