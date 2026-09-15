import { NavLink, Outlet } from 'react-router-dom';
import clsx from 'clsx';
import { APP_NAV } from '@/lib/navigation';

// Mobile keeps to the product's most-used tabs; the rest live in the
// desktop sidebar and (later) a "More" sheet on mobile.
const MOBILE_PRIMARY_PATHS = ['/app/dashboard', '/app/dna', '/app/matches', '/app/training', '/app/profile'];
const mobileNav = APP_NAV.filter((item) => MOBILE_PRIMARY_PATHS.includes(item.path));

export function AppLayout() {
  return (
    <div className="min-h-dvh flex">
      <aside className="hidden md:flex md:w-56 md:flex-col border-r border-[var(--color-ink-700)] px-4 py-6">
        <NavLink to="/" className="font-display text-xl font-bold tracking-tight px-2 mb-8">
          Padel<span className="text-[var(--color-court-400)]">DNA</span>
        </NavLink>
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
      </aside>

      <div className="flex-1 flex flex-col">
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
