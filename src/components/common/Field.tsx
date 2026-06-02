import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from 'react';

export function Field({
  label,
  children
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-semibold text-slate-700">{label}</span>
      {children}
    </label>
  );
}

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className="min-h-11 w-full rounded-md border border-line bg-white px-3 text-sm text-ink shadow-sm"
      {...props}
    />
  );
}

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className="min-h-32 w-full rounded-md border border-line bg-white px-3 py-2 text-sm leading-6 text-ink shadow-sm"
      {...props}
    />
  );
}
