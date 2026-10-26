import { ChevronDown } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import type { NavItem } from './types';

interface NavGroupProps {
  id: string;
  title: string;
  items: NavItem[];
  open: boolean;
  onToggle: () => void;
}

/** گروه باز/بسته‌شونده با الگوی Disclosure */
export function NavGroup({ id, title, items, open, onToggle }: NavGroupProps) {
  const listId = `nav-group-${id}`;
  return (
    <li className="menu-items__item">
      <button type="button" className="menu-item" aria-expanded={open} aria-controls={listId} onClick={onToggle}>
        <ChevronDown className="chev" size={16} aria-hidden="true" />
        <span>{title}</span>
      </button>
      <div id={listId} className={`menu-items__list-wrapper${open ? ' menu-items__list-wrapper--open' : ''}`}>
        <ol className="menu-items__list--child">
          {items.map((it) => (
            <li key={it.to}>
              <NavLink
                to={it.to}
                end
                tabIndex={open ? undefined : -1}
                className={({ isActive }) => `menu-item--sub-item${isActive ? ' menu-item--sub-item--selected' : ''}`}
              >
                {it.label}
              </NavLink>
            </li>
          ))}
        </ol>
      </div>
    </li>
  );
}
