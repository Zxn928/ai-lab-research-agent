import { Inbox } from 'lucide-react';
import type { ReactNode } from 'react';

export function EmptyState({
  title,
  description,
  action
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex min-h-40 flex-col items-center justify-center rounded-lg border border-dashed border-line bg-panel px-5 py-7 text-center">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-muted shadow-sm">
        <Inbox className="h-5 w-5" aria-hidden />
      </div>
      <div className="mt-3 text-sm font-bold text-ink">{title}</div>
      {description && <p className="mt-1 max-w-md text-sm leading-6 text-muted">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
