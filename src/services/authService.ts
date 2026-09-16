import type { AuthSession, LoginInput, RegisterInput } from '@/types/auth';
import { demoAuthUser } from '@/data/demoPlayer';

export interface AuthService {
  getSession(): Promise<AuthSession | null>;
  login(input: LoginInput): Promise<AuthSession>;
  loginAsDemo(): Promise<AuthSession>;
  register(input: RegisterInput): Promise<AuthSession>;
  logout(): Promise<void>;
}

const SESSION_KEY = 'padeldna.session';
const FAKE_LATENCY_MS = 450;

function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), FAKE_LATENCY_MS));
}

function readStoredSession(): AuthSession | null {
  for (const storage of [window.localStorage, window.sessionStorage]) {
    try {
      const raw = storage.getItem(SESSION_KEY);
      if (raw) return JSON.parse(raw) as AuthSession;
    } catch {
      // storage unavailable (private browsing, etc.) — treat as signed out
    }
  }
  return null;
}

function writeStoredSession(session: AuthSession, remember: boolean) {
  const target = remember ? window.localStorage : window.sessionStorage;
  const other = remember ? window.sessionStorage : window.localStorage;
  try {
    target.setItem(SESSION_KEY, JSON.stringify(session));
    other.removeItem(SESSION_KEY);
  } catch {
    // ignore — session simply won't persist across reloads
  }
}

function clearStoredSession() {
  try {
    window.localStorage.removeItem(SESSION_KEY);
    window.sessionStorage.removeItem(SESSION_KEY);
  } catch {
    // ignore
  }
}

/**
 * Local/demo auth. Only the seeded demo account exists — there is no real
 * backend yet, so login/register both resolve to that one account after
 * light validation. This is intentionally the ONLY place that knows
 * sessions are stored in browser storage; everything else talks to
 * AuthService, so swapping in `SupabaseAuthService` later (same interface,
 * real supabase.auth.* calls) won't touch AuthContext or any page.
 */
class LocalAuthService implements AuthService {
  async getSession(): Promise<AuthSession | null> {
    return readStoredSession();
  }

  async login({ email, password, rememberMe }: LoginInput): Promise<AuthSession> {
    if (!email.trim() || !password) {
      throw new Error('Enter your email and password.');
    }
    if (password.length < 6) {
      throw new Error('Incorrect email or password.');
    }
    const session: AuthSession = { user: { id: demoAuthUser.id, email: email.trim() } };
    const result = await delay(session);
    writeStoredSession(result, rememberMe);
    return result;
  }

  async loginAsDemo(): Promise<AuthSession> {
    const session: AuthSession = { user: demoAuthUser };
    const result = await delay(session);
    writeStoredSession(result, true);
    return result;
  }

  async register({ fullName, email, password }: RegisterInput): Promise<AuthSession> {
    if (!fullName.trim()) throw new Error('Enter your full name.');
    if (!email.trim()) throw new Error('Enter your email.');
    if (password.length < 6) throw new Error('Password must be at least 6 characters.');

    // No real backend yet — new accounts are represented with the demo
    // player's data so every page has something real to render. This is
    // called out to the user in the UI and in PHASES.md.
    const session: AuthSession = { user: { id: demoAuthUser.id, email: email.trim() } };
    const result = await delay(session);
    writeStoredSession(result, true);
    return result;
  }

  async logout(): Promise<void> {
    await delay(undefined);
    clearStoredSession();
  }
}

export const authService: AuthService = new LocalAuthService();
