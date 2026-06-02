import { NavLink } from 'react-router-dom';
import { navGroups } from '../routes';

export function Sidebar() {
  return (
    <aside className="hidden w-72 shrink-0 border-r border-line bg-white lg:block">
      <div className="border-b border-line px-6 py-5">
        <div className="text-sm font-semibold text-brand">AI创新实验室</div>
        <h1 className="mt-1 text-lg font-bold leading-tight text-ink">线下调研诊断Agent工作台</h1>
      </div>
      <nav className="space-y-6 px-4 py-5">
        {navGroups.map((group) => (
          <section key={group.title}>
            <div className="px-2 text-xs font-semibold uppercase tracking-wide text-muted">
              {group.title}
            </div>
            <div className="mt-2 space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      [
                        'flex min-h-11 items-center gap-3 rounded-md px-3 text-sm font-medium transition',
                        isActive
                          ? 'bg-teal-50 text-brand'
                          : 'text-slate-700 hover:bg-slate-100 hover:text-ink'
                      ].join(' ')
                    }
                  >
                    <Icon className="h-4 w-4" aria-hidden />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </div>
          </section>
        ))}
      </nav>
    </aside>
  );
}
