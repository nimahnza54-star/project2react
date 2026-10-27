import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { clearSession, createSession, readSession } from './session';
import type {
  AuthCredentials,
  AuthResult,
  AuthStatus,
  Authenticator,
  SessionUser,
} from './types';

interface AuthContextValue {
  status: AuthStatus;
  user: SessionUser | null;
  expiresAt: number | null;
  login: (credentials: AuthCredentials) => Promise<AuthResult>;
  logout: () => void;
}

interface AuthState {
  status: AuthStatus;
  user: SessionUser | null;
  expiresAt: number | null;
}

const INITIAL_STATE: AuthState = {
  status: 'initializing',
  user: null,
  expiresAt: null,
};

const AuthContext = createContext<AuthContextValue | null>(null);

interface AuthProviderProps {
  /** پیاده‌سازی احراز هویت؛ در دمو mockAuthenticate و در آینده سرویس بک‌اند است. */
  authenticate: Authenticator;
  /** مدت اعتبار نشست (میلی‌ثانیه). پیش‌فرض در سرویس session تعریف شده است. */
  sessionTtlMs?: number;
  children: ReactNode;
}

export function AuthProvider({ authenticate, sessionTtlMs, children }: AuthProviderProps) {
  const [state, setState] = useState<AuthState>(INITIAL_STATE);

  // بازیابی نشست پس از refresh. تا پایان این بررسی status برابر initializing است.
  useEffect(() => {
    const session = readSession();
    setState(
      session
        ? { status: 'authenticated', user: session.user, expiresAt: session.expiresAt }
        : { status: 'unauthenticated', user: null, expiresAt: null },
    );
  }, []);

  const login = useCallback(
    async (credentials: AuthCredentials): Promise<AuthResult> => {
      let result: AuthResult;
      try {
        result = await authenticate(credentials);
      } catch {
        return {
          success: false,
          error: 'ارتباط با سرویس ورود برقرار نشد. لطفا دوباره تلاش کنید.',
        };
      }

      if (!result.success) return result;

      const session = createSession(result.user, { ttlMs: sessionTtlMs });
      if (!session) {
        return {
          success: false,
          error: 'ذخیره نشست ورود در مرورگر ممکن نشد. دسترسی به حافظه مرورگر را بررسی کنید.',
        };
      }

      setState({ status: 'authenticated', user: session.user, expiresAt: session.expiresAt });
      return { success: true, user: session.user };
    },
    [authenticate, sessionTtlMs],
  );

  const logout = useCallback(() => {
    clearSession();
    setState({ status: 'unauthenticated', user: null, expiresAt: null });
  }, []);

  // انقضای نشست حتی بدون refresh: پس از پایان اعتبار، state به unauthenticated می‌رود
  // و محافظ مسیرها کاربر را به صفحه ورود هدایت می‌کند.
  useEffect(() => {
    if (state.status !== 'authenticated' || state.expiresAt === null) return;

    const remaining = state.expiresAt - Date.now();
    if (remaining <= 0) {
      logout();
      return;
    }

    const timer = window.setTimeout(logout, remaining);
    return () => window.clearTimeout(timer);
  }, [state.status, state.expiresAt, logout]);

  const value = useMemo<AuthContextValue>(
    () => ({
      status: state.status,
      user: state.user,
      expiresAt: state.expiresAt,
      login,
      logout,
    }),
    [state.status, state.user, state.expiresAt, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside <AuthProvider>');
  return context;
}
