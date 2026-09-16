import type { ReactNode } from 'react';
import clsx from 'clsx';

interface PanelProps {
  title?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function Panel({ title, action, children, className }: PanelProps) {
  return (
    <section className={clsx('rounded-2xl border border-[var(--color-ink-700)] bg-[var(--color-ink-800)] p-5 sm:p-6', className)}>
      {title ? (
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-lg font-semibold">{title}</h2>
          {action}
        </div>
      ) : null}
      {children}
    </section>
  );
}
