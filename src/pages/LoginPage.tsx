import { useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/ui/TextField';

interface LocationState {
  from?: { pathname: string };
}

export function LoginPage() {
  const { login, loginAsDemo } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = (location.state as LocationState | null)?.from?.pathname ?? '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showForgot, setShowForgot] = useState(false);
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDemoLoading, setIsDemoLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSubmitError(null);

    if (!email.trim()) {
      setFieldError('Enter your email address.');
      return;
    }
    if (!password) {
      setFieldError('Enter your password.');
      return;
    }
    setFieldError(null);
    setIsSubmitting(true);
    try {
      await login({ email, password, rememberMe });
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Couldn\u2019t log in. Try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDemoLogin() {
    setSubmitError(null);
    setIsDemoLoading(true);
    try {
      await loginAsDemo();
      navigate('/dashboard', { replace: true });
    } finally {
      setIsDemoLoading(false);
    }
  }

  return (
    <div>
      <h1 className="font-display text-3xl font-bold">Log in</h1>
      <p className="mt-2 text-sm text-[var(--color-mist-300)]">
        No live accounts yet — any email and a 6+ character password will get you in.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5" noValidate>
        <TextField
          label="Email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="Password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={fieldError ?? undefined}
        />

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 text-[var(--color-mist-100)]">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 rounded border-[var(--color-ink-600)] accent-[var(--color-court-500)]"
            />
            Remember me
          </label>
          <button
            type="button"
            onClick={() => setShowForgot((v) => !v)}
            className="text-[var(--color-court-400)] hover:underline"
          >
            Forgot password?
          </button>
        </div>

        {showForgot ? (
          <p className="text-xs text-[var(--color-mist-300)] bg-[var(--color-ink-800)] border border-[var(--color-ink-600)] rounded px-3.5 py-2.5">
            Password reset isn't available in this demo yet — it'll arrive with real accounts. Use
            "Continue with demo account" below in the meantime.
          </p>
        ) : null}

        {submitError ? (
          <p role="alert" className="text-sm text-[var(--color-clay-500)]">
            {submitError}
          </p>
        ) : null}

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Logging in…' : 'Log in'}
        </Button>
      </form>

      <div className="mt-6 flex items-center gap-3 text-xs text-[var(--color-mist-400)]">
        <span className="h-px flex-1 bg-[var(--color-ink-600)]" />
        or
        <span className="h-px flex-1 bg-[var(--color-ink-600)]" />
      </div>

      <Button
        variant="secondary"
        className="w-full mt-6"
        onClick={handleDemoLogin}
        disabled={isDemoLoading}
      >
        {isDemoLoading ? 'Signing in…' : 'Continue with demo account'}
      </Button>

      <p className="mt-8 text-center text-sm text-[var(--color-mist-300)]">
        New to PadelDNA?{' '}
        <Link to="/register" className="text-[var(--color-court-400)] hover:underline">
          Create an account
        </Link>
      </p>
    </div>
  );
}
