import {
  Bell, Circle, CircleHelp, Database, FileText, LayoutDashboard, Scale, Server, User, Users,
  type LucideIcon,
} from 'lucide-react';

const ICONS: Record<string, LucideIcon> = {
  'layout-dashboard': LayoutDashboard,
  scale: Scale,
  bell: Bell,
  'file-text': FileText,
  database: Database,
  users: Users,
  server: Server,
  user: User,
  'help-circle': CircleHelp,
};

export function NavIcon({ name, size = 20 }: { name: string; size?: number }) {
  const Icon = ICONS[name] ?? Circle;
  return <Icon size={size} strokeWidth={1.8} aria-hidden="true" />;
}
