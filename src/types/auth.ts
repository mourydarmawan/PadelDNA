/**
 * The authenticated principal. Mirrors the shape of a Supabase Auth user
 * closely enough that swapping `localAuthService` for a real Supabase-backed
 * implementation later won't require touching AuthContext or any page.
 */
export interface AuthUser {
  id: string;
  email: string;
}

export interface AuthSession {
  user: AuthUser;
}

export interface LoginInput {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface RegisterInput {
  fullName: string;
  email: string;
  password: string;
}

export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';
