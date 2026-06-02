import { Building2, CircleCheck, CircleDot, Cpu, Menu } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import type { Project } from '../../types/project';
import { navItems } from '../routes';
import { Badge } from '../../components/common/Badge';

export function Header({
  project,
  apiConfigured
}: {
  project?: Project;
  apiConfigured?: boolean;
}) {
  const location = useLocation();
  const current = navItems.find((item) => item.path === location.pathname) || navItems[0];
  const progress = Math.round((current.step / navItems.length) * 100);

  return (
    <header className="border-b border-line bg-white">
      <div className="flex min-h-[74px] flex-col gap-3 px-4 py-3 md:flex-row md:items-center md:justify-between md:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-line bg-panel text-slate-500 lg:hidden">
            <Menu className="h-5 w-5" aria-hidden />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-xs font-semibold text-muted">
              <span>{current.groupTitle}</span>
              <span className="text-slate-300">/</span>
              <span className="text-brand">步骤 {String(current.step).padStart(2, '0')}</span>
            </div>
            <div className="mt-1 truncate text-lg font-bold text-ink">
              {project?.name || '尚未创建项目'}
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="inline-flex min-h-9 items-center gap-2 rounded-md border border-line bg-panel px-3 text-slate-700">
            <Building2 className="h-4 w-4 text-muted" aria-hidden />
            {project?.companyName || '未设置企业'}
          </span>
          <Badge tone={apiConfigured ? 'success' : 'warning'}>
            {apiConfigured ? <CircleCheck className="mr-1.5 h-3.5 w-3.5" /> : <CircleDot className="mr-1.5 h-3.5 w-3.5" />}
            {apiConfigured ? 'OpenAI 已配置' : 'OpenAI 未配置'}
          </Badge>
        </div>
      </div>
      <div className="flex items-center gap-3 border-t border-line px-4 py-2 md:px-6">
        <Cpu className="h-3.5 w-3.5 text-brand" aria-hidden />
        <span className="text-xs font-semibold text-muted">工作流进度</span>
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">
          <div className="h-full rounded-full bg-brand transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
        <span className="text-xs font-bold tabular-nums text-brand">{progress}%</span>
      </div>
    </header>
  );
}
