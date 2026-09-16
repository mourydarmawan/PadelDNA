import { useId, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react';
import clsx from 'clsx';

const fieldClasses =
  'w-full rounded bg-[var(--color-ink-800)] border border-[var(--color-ink-600)] px-3.5 py-2.5 text-[var(--color-paper)] placeholder:text-[var(--color-mist-400)] focus:border-[var(--color-court-400)] transition-colors';

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
}

export function TextField({ label, error, hint, id, className, ...props }: TextFieldProps) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const hintId = hint ? `${fieldId}-hint` : undefined;
  const errorId = error ? `${fieldId}-error` : undefined;

  return (
    <div>
      <label htmlFor={fieldId} className="block text-sm font-medium text-[var(--color-mist-100)] mb-1.5">
        {label}
      </label>
      <input
        id={fieldId}
        className={clsx(fieldClasses, error && 'border-[var(--color-clay-500)]', className)}
        aria-invalid={Boolean(error)}
        aria-describedby={clsx(hintId, errorId) || undefined}
        {...props}
      />
      {hint ? (
        <p id={hintId} className="mt-1.5 text-xs text-[var(--color-mist-400)]">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} className="mt-1.5 text-xs text-[var(--color-clay-500)]">
          {error}
        </p>
      ) : null}
    </div>
  );
}

interface TextAreaFieldProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
}

export function TextAreaField({ label, error, id, className, ...props }: TextAreaFieldProps) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;

  return (
    <div>
      <label htmlFor={fieldId} className="block text-sm font-medium text-[var(--color-mist-100)] mb-1.5">
        {label}
      </label>
      <textarea
        id={fieldId}
        className={clsx(fieldClasses, 'resize-none', error && 'border-[var(--color-clay-500)]', className)}
        aria-invalid={Boolean(error)}
        {...props}
      />
      {error ? <p className="mt-1.5 text-xs text-[var(--color-clay-500)]">{error}</p> : null}
    </div>
  );
}

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  children: ReactNode;
}

export function SelectField({ label, id, className, children, ...props }: SelectFieldProps) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;

  return (
    <div>
      <label htmlFor={fieldId} className="block text-sm font-medium text-[var(--color-mist-100)] mb-1.5">
        {label}
      </label>
      <select id={fieldId} className={clsx(fieldClasses, className)} {...props}>
        {children}
      </select>
    </div>
  );
}
