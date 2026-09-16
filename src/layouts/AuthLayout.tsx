import { Link, Outlet } from 'react-router-dom';

export function AuthLayout() {
  return (
    <div className="min-h-dvh flex flex-col">
      <header className="px-5 sm:px-8 py-5">
        <Link to="/" className="font-display text-xl font-bold tracking-tight">
          Padel<span className="text-[var(--color-court-400)]">DNA</span>
        </Link>
      </header>
      <main className="flex-1 flex items-center justify-center px-5 sm:px-8 py-8">
        <div className="w-full max-w-sm">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
