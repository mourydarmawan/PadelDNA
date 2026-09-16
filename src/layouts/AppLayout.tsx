import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { APP_NAV } from '@/lib/navigation';
import { useAuth } from '@/context/AuthContext';
import { PLAYER_LEVEL_LABELS } from '@/lib/labels';

// Mobile keeps to the product's most-used tabs; the rest live in the
// desktop sidebar and (later) a "More" sheet on mobile.
const MOBILE_PRIMARY_PATHS = ['/dashboard', '/dna', '/matches', '/training', '/profile'];
const mobileNav = APP_NAV.filter((item) => MOBILE_PRIMARY_PATHS.includes(item.path));

function initials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
}

export function AppLayout() {
  const { profile, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate('/', { replace: true });
  }

  return (
    <div className="min-h-dvh flex">
      <aside className="hidden md:flex md:w-60 md:flex-col border-r border-[var(--color-ink-700)] px-4 py-6">
        <NavLink to="/" className="font-display text-xl font-bold tracking-tight px-2 mb-8">
          Padel<span className="text-[var(--color-court-400)]">DNA</span>
        </NavLink>

        {profile ? (
          <NavLink to="/profile" className="flex items-center gap-3 px-2 mb-6 group">
            <div className="h-9 w-9 shrink-0 rounded-full bg-[var(--color-ink-700)] border border-[var(--color-ink-600)] flex items-center justify-center font-display text-xs font-bold text-[var(--color-court-400)]">
              {initials(profile.fullName)}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium truncate group-hover:text-[var(--color-court-400)]">
                {profile.fullName}
              </p>
              <p className="text-xs text-[var(--color-mist-400)] truncate">
                {profile.currentLevel ? PLAYER_LEVEL_LABELS[profile.currentLevel] : 'Player'}
              </p>
            </div>
          </NavLink>
        ) : null}

        <nav className="flex flex-col gap-1">
          {APP_NAV.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                clsx(
                  'rounded px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-[var(--color-ink-700)] text-[var(--color-paper)]'
                    : 'text-[var(--color-mist-300)] hover:text-[var(--color-paper)] hover:bg-[var(--color-ink-800)]'
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <button
          type="button"
          onClick={handleLogout}
          className="mt-auto px-3 py-2 text-left text-sm font-medium text-[var(--color-mist-300)] hover:text-[var(--color-clay-500)] transition-colors"
        >
          Log out
        </button>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="md:hidden flex items-center justify-between border-b border-[var(--color-ink-700)] px-4 py-3">
          <NavLink to="/" className="font-display text-lg font-bold tracking-tight">
            Padel<span className="text-[var(--color-court-400)]">DNA</span>
          </NavLink>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleLogout}
              className="text-xs font-medium text-[var(--color-mist-300)]"
            >
              Log out
            </button>
            {profile ? (
              <NavLink
                to="/profile"
                aria-label="Profile"
                className="h-8 w-8 rounded-full bg-[var(--color-ink-700)] border border-[var(--color-ink-600)] flex items-center justify-center font-display text-xs font-bold text-[var(--color-court-400)]"
              >
                {initials(profile.fullName)}
              </NavLink>
            ) : null}
          </div>
        </header>

        <main className="flex-1 pb-20 md:pb-0">
          <Outlet />
        </main>

        <nav className="md:hidden fixed bottom-0 inset-x-0 border-t border-[var(--color-ink-700)] bg-[var(--color-ink-900)]">
          <div className="grid grid-cols-5">
            {mobileNav.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  clsx(
                    'py-2.5 text-center text-[11px] font-medium',
                    isActive ? 'text-[var(--color-court-400)]' : 'text-[var(--color-mist-300)]'
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        </nav>
      </div>
    </div>
  );
}
