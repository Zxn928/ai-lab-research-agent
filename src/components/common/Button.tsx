import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';

export function Button({
  children,
  variant = 'primary',
  className = '',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: Variant;
}) {
  const variants: Record<Variant, string> = {
    primary: 'border border-brand bg-brand text-white shadow-sm hover:border-teal-800 hover:bg-teal-800',
    secondary: 'border border-line bg-white text-ink shadow-sm hover:border-slate-300 hover:bg-slate-50',
    ghost: 'border border-transparent text-slate-600 hover:bg-slate-100 hover:text-ink',
    danger: 'border border-red-600 bg-red-600 text-white shadow-sm hover:border-red-700 hover:bg-red-700'
  };
  return (
    <button
      className={[
        'inline-flex min-h-11 items-center justify-center gap-2 rounded-md px-4 text-sm font-semibold transition duration-200 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-50',
        variants[variant],
        className
      ].join(' ')}
      {...props}
    >
      {children}
    </button>
  );
}
