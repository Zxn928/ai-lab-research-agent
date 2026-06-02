import type { Project } from '../../types/project';

export function Header({
  project,
  apiConfigured
}: {
  project?: Project;
  apiConfigured?: boolean;
}) {
  return (
    <header className="border-b border-line bg-white px-5 py-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="text-xs font-semibold text-muted">当前项目</div>
          <div className="mt-1 text-xl font-bold text-ink">
            {project?.name || '尚未创建项目'}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="rounded-md border border-line bg-panel px-3 py-2 text-slate-700">
            {project?.companyName || '未设置企业'}
          </span>
          <span
            className={[
              'rounded-md px-3 py-2 font-medium',
              apiConfigured ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
            ].join(' ')}
          >
            {apiConfigured ? 'OpenAI 已配置' : 'OpenAI 未配置'}
          </span>
        </div>
      </div>
    </header>
  );
}
