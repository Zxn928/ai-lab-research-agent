import { NavLink } from 'react-router-dom';
import { navItems } from '../routes';

export function MobileNavigation() {
  return (
    <nav className="overflow-x-auto border-b border-line bg-white px-3 py-2 lg:hidden" aria-label="工作流导航">
      <div className="flex min-w-max gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                [
                  'flex min-h-10 items-center gap-2 rounded-md px-3 text-xs font-semibold transition',
                  isActive ? 'bg-teal-50 text-brand' : 'text-slate-600 hover:bg-slate-100'
                ].join(' ')
              }
            >
              <span className="text-[10px] tabular-nums text-muted">{String(item.step).padStart(2, '0')}</span>
              <Icon className="h-3.5 w-3.5" aria-hidden />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
