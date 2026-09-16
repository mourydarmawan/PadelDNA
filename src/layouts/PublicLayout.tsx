import { Link, Outlet } from 'react-router-dom';
import { buttonClasses } from '@/components/ui/Button';

export function PublicLayout() {
  return (
    <div className="min-h-dvh flex flex-col">
      <header className="border-b border-[var(--color-ink-700)]">
        <div className="mx-auto max-w-6xl px-5 sm:px-8 py-4 flex items-center justify-between">
          <Link to="/" className="font-display text-xl font-bold tracking-tight">
            Padel<span className="text-[var(--color-court-400)]">DNA</span>
          </Link>
          <nav className="flex items-center gap-3">
            <Link to="/login" className={buttonClasses('ghost', 'md')}>
              Log in
            </Link>
            <Link to="/register" className={buttonClasses('primary', 'md')}>
              Discover Your PadelDNA
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-[var(--color-ink-700)]">
        <div className="mx-auto max-w-6xl px-5 sm:px-8 py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-sm text-[var(--color-mist-300)]">
          <p>© {new Date().getFullYear()} PadelDNA. Know your game.</p>
          <p>Built for players who want to see their game, not just play it.</p>
        </div>
      </footer>
    </div>
  );
}
