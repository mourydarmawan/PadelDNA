import type { ReactNode } from 'react';
import { Button } from './Button';

export function LoadingState({ label = 'Loading' }: { label?: string }) {
  return (
    <div role="status" className="flex items-center gap-3 py-12 justify-center text-[var(--color-mist-300)]">
      <span className="h-4 w-4 rounded-full border-2 border-[var(--color-ink-600)] border-t-[var(--color-court-400)] animate-spin" />
      <span className="text-sm">{label}…</span>
    </div>
  );
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="text-center py-16 px-6 border border-dashed border-[var(--color-ink-600)] rounded">
      <p className="font-display text-2xl font-semibold">{title}</p>
      <p className="mt-2 text-sm text-[var(--color-mist-300)] max-w-sm mx-auto">{description}</p>
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}

export function ErrorState({
  title = 'Something went wrong',
  description,
  onRetry,
}: {
  title?: string;
  description: string;
  onRetry?: () => void;
}) {
  return (
    <div className="text-center py-16 px-6 border border-[var(--color-clay-500)]/40 rounded bg-[var(--color-clay-500)]/5">
      <p className="font-display text-2xl font-semibold text-[var(--color-clay-500)]">{title}</p>
      <p className="mt-2 text-sm text-[var(--color-mist-300)] max-w-sm mx-auto">{description}</p>
      {onRetry ? (
        <div className="mt-6">
          <Button variant="secondary" onClick={onRetry}>
            Try again
          </Button>
        </div>
      ) : null}
    </div>
  );
}
