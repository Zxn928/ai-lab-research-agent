import { Loader2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

export function AgentProgress({
  title,
  detail,
  steps,
  active
}: {
  title: string;
  detail?: string;
  steps: string[];
  active: boolean;
}) {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (!active) {
      setSeconds(0);
      return;
    }

    const timer = window.setInterval(() => setSeconds((current) => current + 1), 1000);
    return () => window.clearInterval(timer);
  }, [active]);

  const activeIndex = useMemo(() => {
    if (!steps.length) return 0;
    return Math.min(steps.length - 1, Math.floor(seconds / 8));
  }, [seconds, steps.length]);

  if (!active) return null;

  return (
    <div className="rounded-lg border border-teal-200 bg-teal-50 p-4 text-sm text-teal-900">
      <div className="flex items-start gap-3">
        <Loader2 className="mt-0.5 h-5 w-5 shrink-0 animate-spin text-brand" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <div className="font-bold">{title}</div>
            <div className="text-xs font-semibold text-teal-700">已等待 {seconds}s</div>
          </div>
          {detail && <p className="mt-1 leading-6 text-teal-800">{detail}</p>}
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white">
            <div className="h-full w-1/2 animate-pulse rounded-full bg-brand" />
          </div>
          <div className="mt-3 grid gap-2 md:grid-cols-2">
            {steps.map((step, index) => (
              <div
                key={step}
                className={[
                  'rounded-md border px-3 py-2 text-xs font-semibold',
                  index <= activeIndex
                    ? 'border-teal-300 bg-white text-brand'
                    : 'border-teal-100 bg-teal-50 text-teal-700/70'
                ].join(' ')}
              >
                {index + 1}. {step}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
