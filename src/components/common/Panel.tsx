import type { ReactNode } from 'react';

export function Panel({
  title,
  children,
  footer,
  description,
  badge
}: {
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  description?: string;
  badge?: ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-lg border border-line bg-white shadow-panel">
      <div className="flex items-start justify-between gap-3 border-b border-line bg-white px-5 py-4">
        <div>
          <h3 className="text-base font-bold text-ink">{title}</h3>
          {description && <p className="mt-1 text-xs leading-5 text-muted">{description}</p>}
        </div>
        {badge && <div className="shrink-0">{badge}</div>}
      </div>
      <div className="p-5">{children}</div>
      {footer && <div className="flex flex-wrap gap-2 border-t border-line bg-panel px-5 py-4">{footer}</div>}
    </section>
  );
}
