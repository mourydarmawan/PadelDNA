import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { authService } from '@/services/authService';
import { demoDNA, demoProfile } from '@/data/demoPlayer';
import type { AuthStatus, AuthUser, LoginInput, RegisterInput } from '@/types/auth';
import type { PlayerDNA, Profile } from '@/types/database';

interface AuthContextValue {
  status: AuthStatus;
  user: AuthUser | null;
  /** The signed-in player's profile + DNA. Only the demo player exists for now. */
  profile: Profile | null;
  dna: PlayerDNA | null;
  error: string | null;
  login: (input: LoginInput) => Promise<void>;
  loginAsDemo: () => Promise<void>;
  register: (input: RegisterInput) => Promise<void>;
  logout: () => Promise<void>;
  /** Local-only edit for now — persists for the session, not across reloads. */
  updateProfile: (patch: Partial<Profile>) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>('loading');
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    authService.getSession().then((session) => {
      if (cancelled) return;
      setUser(session?.user ?? null);
      setProfile(session ? demoProfile : null);
      setStatus(session ? 'authenticated' : 'unauthenticated');
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (input: LoginInput) => {
    setError(null);
    try {
      const session = await authService.login(input);
      setUser(session.user);
      setProfile(demoProfile);
      setStatus('authenticated');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong logging in.');
      throw err;
    }
  }, []);

  const loginAsDemo = useCallback(async () => {
    setError(null);
    const session = await authService.loginAsDemo();
    setUser(session.user);
    setProfile(demoProfile);
    setStatus('authenticated');
  }, []);

  const register = useCallback(async (input: RegisterInput) => {
    setError(null);
    try {
      const session = await authService.register(input);
      setUser(session.user);
      // No real backend yet — new accounts start from the demo profile,
      // with the name they just entered so the account still feels theirs.
      setProfile({ ...demoProfile, fullName: input.fullName });
      setStatus('authenticated');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong creating your account.');
      throw err;
    }
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
    setProfile(null);
    setStatus('unauthenticated');
  }, []);

  const updateProfile = useCallback((patch: Partial<Profile>) => {
    setProfile((current) => (current ? { ...current, ...patch, updatedAt: new Date().toISOString() } : current));
  }, []);

  const dna = user ? demoDNA : null;

  const value = useMemo<AuthContextValue>(
    () => ({ status, user, profile, dna, error, login, loginAsDemo, register, logout, updateProfile }),
    [status, user, profile, dna, error, login, loginAsDemo, register, logout, updateProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
