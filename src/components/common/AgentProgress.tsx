import { CheckCircle2, CircleDashed, Loader2 } from 'lucide-react';
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

  const progress = steps.length ? Math.round(((activeIndex + 1) / steps.length) * 100) : 25;

  return (
    <div
      role="status"
      aria-live="polite"
      className="rounded-lg border border-slate-200 bg-white p-4 text-sm shadow-sm"
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-brand text-white shadow-sm">
            <Loader2 className="h-5 w-5 animate-spin" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="text-base font-bold text-ink">{title}</div>
                {detail && <p className="mt-1 max-w-3xl leading-6 text-slate-600">{detail}</p>}
              </div>
              <div className="inline-flex w-fit shrink-0 items-center rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800">
                已等待 {seconds}s
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="h-2 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-gradient-to-r from-brand via-sky-500 to-emerald-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="mt-3 grid gap-2 md:grid-cols-4">
            {steps.map((step, index) => {
              const completed = index < activeIndex;
              const current = index === activeIndex;
              return (
                <div
                  key={step}
                  className={[
                    'min-h-20 rounded-md border px-3 py-3 transition',
                    completed
                      ? 'border-emerald-200 bg-emerald-50'
                      : current
                        ? 'border-sky-200 bg-sky-50'
                        : 'border-slate-200 bg-slate-50'
                  ].join(' ')}
                >
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500">STEP {index + 1}</span>
                    {completed ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    ) : current ? (
                      <Loader2 className="h-4 w-4 animate-spin text-sky-600" />
                    ) : (
                      <CircleDashed className="h-4 w-4 text-slate-400" />
                    )}
                  </div>
                  <div
                    className={[
                      'leading-5',
                      completed ? 'font-semibold text-emerald-800' : current ? 'font-semibold text-sky-800' : 'text-slate-500'
                    ].join(' ')}
                  >
                    {step}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
