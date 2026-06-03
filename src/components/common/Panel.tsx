import type { ReactNode } from 'react';

export function Panel({
  title,
  children,
  footer
}: {
  title: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="rounded-lg border border-line bg-white shadow-soft">
      <div className="border-b border-line px-5 py-4">
        <h3 className="text-base font-bold text-ink">{title}</h3>
      </div>
      <div className="p-5">{children}</div>
      {footer && <div className="border-t border-line bg-panel px-5 py-4">{footer}</div>}
    </div>
  );
}
