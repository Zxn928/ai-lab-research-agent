import { Activity, FlaskConical } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { navGroups } from '../routes';

export function Sidebar() {
  let step = 0;
  return (
    <aside className="hidden w-[292px] shrink-0 border-r border-slate-800 bg-navy text-white lg:flex lg:flex-col">
      <div className="border-b border-white/10 px-5 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-500/15 text-teal-300">
            <FlaskConical className="h-5 w-5" aria-hidden />
          </div>
          <div>
            <div className="text-sm font-bold text-white">AI创新实验室</div>
            <div className="mt-0.5 text-xs text-slate-400">Research Workspace</div>
          </div>
        </div>
        <h1 className="mt-5 text-base font-bold leading-6 text-white">线下调研诊断Agent工作台</h1>
      </div>
      <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-5">
        {navGroups.map((group) => (
          <section key={group.title}>
            <div className="flex items-center gap-2 px-2 text-xs font-bold text-slate-400">
              <span className="text-teal-300">{group.phase}</span>
              <span>{group.title}</span>
            </div>
            <div className="mt-2 space-y-1">
              {group.items.map((item) => {
                step += 1;
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      [
                        'flex min-h-11 items-center gap-3 rounded-md px-3 text-sm font-medium transition duration-200',
                        isActive
                          ? 'bg-teal-400/15 text-white shadow-sm'
                          : 'text-slate-300 hover:bg-white/5 hover:text-white'
                      ].join(' ')
                    }
                  >
                    <span className="w-4 text-center text-[11px] font-bold tabular-nums text-slate-500">{String(step).padStart(2, '0')}</span>
                    <Icon className="h-4 w-4 shrink-0" aria-hidden />
                    <span className="truncate">{item.label}</span>
                  </NavLink>
                );
              })}
            </div>
          </section>
        ))}
      </nav>
      <div className="border-t border-white/10 p-4">
        <div className="flex items-center gap-2 rounded-md bg-white/5 px-3 py-2.5 text-xs text-slate-300">
          <Activity className="h-4 w-4 text-teal-300" aria-hidden />
          <span>本地工作区自动保存</span>
        </div>
      </div>
    </aside>
  );
}
