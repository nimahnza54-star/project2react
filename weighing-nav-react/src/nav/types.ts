export type Role = 'user' | 'expert' | 'manager' | 'support';
export type Priority = 'M' | 'S' | 'C';

export interface NavItem {
  label: string;
  to: string;
  minRole?: Role;
  priority?: Priority;
}

export interface NavGroup {
  group: string;
  open?: boolean;
  minRole?: Role;
  items: NavItem[];
}

export interface Product {
  id: string;
  label: string;
  caption?: string;
  icon: string;
  to: string;
  minRole?: Role;
  external?: boolean;
}

export interface NavConfig {
  roles: { id: Role; label: string }[];
  products: Product[];
  footer: Product[];
  menus: Record<string, NavGroup[]>;
}

/** فیلتر نمایش: نقش کاربر جاری و محدودسازی به فاز اول */
export interface NavFilter {
  role: Role;
  mvpOnly: boolean;
}

export interface ResolvedRoute {
  product: Product;
  group: NavGroup;
  item: NavItem;
}
