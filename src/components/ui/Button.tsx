import type { ButtonHTMLAttributes, ReactNode } from 'react';
import clsx from 'clsx';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'md' | 'lg';
  children: ReactNode;
}

const base =
  'inline-flex items-center justify-center gap-2 font-display font-semibold tracking-wide transition-colors disabled:opacity-50 disabled:pointer-events-none';

const variants: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary: 'bg-[var(--color-court-500)] text-[var(--color-ink-950)] hover:bg-[var(--color-court-400)]',
  secondary:
    'bg-transparent text-[var(--color-paper)] border border-[var(--color-ink-500)] hover:border-[var(--color-court-400)] hover:text-[var(--color-court-400)]',
  ghost: 'bg-transparent text-[var(--color-mist-100)] hover:text-[var(--color-paper)]',
};

const sizes: Record<NonNullable<ButtonProps['size']>, string> = {
  md: 'text-base px-5 py-2.5',
  lg: 'text-lg px-7 py-3.5',
};

export function buttonClasses(
  variant: NonNullable<ButtonProps['variant']> = 'primary',
  size: NonNullable<ButtonProps['size']> = 'md',
  className?: string
) {
  return clsx(base, variants[variant], sizes[size], className);
}

export function Button({ variant = 'primary', size = 'md', className, children, ...props }: ButtonProps) {
  return (
    <button className={buttonClasses(variant, size, className)} {...props}>
      {children}
    </button>
  );
}
