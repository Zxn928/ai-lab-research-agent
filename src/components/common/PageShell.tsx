import type { ReactNode } from 'react';

export function PageShell({
  title,
  description,
  children,
  actions,
  eyebrow
}: {
  title: string;
  description?: string;
  children: ReactNode;
  actions?: ReactNode;
  eyebrow?: string;
}) {
  return (
    <section className="mx-auto max-w-screen-2xl">
      <div className="mb-6 flex flex-col gap-4 border-b border-line pb-5 md:flex-row md:items-start md:justify-between">
        <div>
          {eyebrow && <div className="mb-2 text-xs font-bold text-brand">{eyebrow}</div>}
          <h2 className="text-2xl font-bold leading-tight text-ink md:text-[28px]">{title}</h2>
          {description && <p className="mt-2 max-w-3xl text-sm leading-6 text-muted md:text-[15px]">{description}</p>}
        </div>
        {actions && <div className="flex shrink-0 flex-wrap gap-2 md:justify-end">{actions}</div>}
      </div>
      {children}
    </section>
  );
}
