import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { SESSION_STORAGE_KEY, clearSession, createSession, readSession } from './session';
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
  authError: string | null;
  login: (credentials: AuthCredentials) => Promise<AuthResult>;
  logout: () => void;
  clearAuthError: () => void;
}

interface AuthState {
  status: AuthStatus;
  user: SessionUser | null;
  expiresAt: number | null;
  authError: string | null;
}

const INITIAL_STATE: AuthState = {
  status: 'initializing',
  user: null,
  expiresAt: null,
  authError: null,
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
    const syncSession = () => {
      let hadStoredSession = false;
      try {
        if (typeof window !== 'undefined') {
          hadStoredSession = Boolean(window.sessionStorage.getItem(SESSION_STORAGE_KEY));
        }
      } catch {
        hadStoredSession = false;
      }

      const session = readSession();
      if (session) {
        setState((prev) =>
          prev.status === 'authenticated' &&
          prev.user?.username === session.user.username &&
          prev.expiresAt === session.expiresAt &&
          prev.authError === null
            ? prev
            : { status: 'authenticated', user: session.user, expiresAt: session.expiresAt, authError: null },
        );
      } else {
        setState((prev) => {
          const nextAuthError = hadStoredSession
            ? 'نشست شما نامعتبر یا منقضی شده است. لطفاً دوباره وارد شوید.'
            : prev.authError;
          if (
            prev.status === 'unauthenticated' &&
            prev.user === null &&
            prev.expiresAt === null &&
            prev.authError === nextAuthError
          ) {
            return prev;
          }
          return { status: 'unauthenticated', user: null, expiresAt: null, authError: nextAuthError };
        });
      }
    };

    syncSession();

    if (typeof window === 'undefined') return;

    const handleStorage = (event: StorageEvent) => {
      if (event.key === null || event.key === SESSION_STORAGE_KEY) syncSession();
    };
    const handleFocus = () => syncSession();
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') syncSession();
    };

    window.addEventListener('storage', handleStorage);
    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
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

      setState({ status: 'authenticated', user: session.user, expiresAt: session.expiresAt, authError: null });
      return { success: true, user: session.user };
    },
    [authenticate, sessionTtlMs],
  );

  const logout = useCallback(() => {
    try {
      clearSession();
    } catch {
      // Storage cleanup must never leave the UI authenticated.
    } finally {
      setState({ status: 'unauthenticated', user: null, expiresAt: null, authError: null });
    }
  }, []);

  const expireSession = useCallback(() => {
    clearSession();
    setState({
      status: 'unauthenticated',
      user: null,
      expiresAt: null,
      authError: 'نشست شما منقضی شده است. لطفاً دوباره وارد شوید.',
    });
  }, []);

  const clearAuthError = useCallback(() => {
    setState((prev) => (prev.authError === null ? prev : { ...prev, authError: null }));
  }, []);

  // انقضای نشست حتی بدون refresh: پس از پایان اعتبار، state به unauthenticated می‌رود
  // و محافظ مسیرها کاربر را به صفحه ورود هدایت می‌کند.
  useEffect(() => {
    if (state.status !== 'authenticated' || state.expiresAt === null) return;

    const remaining = state.expiresAt - Date.now();
    if (remaining <= 0) {
      expireSession();
      return;
    }

    const timer = window.setTimeout(expireSession, remaining);
    return () => window.clearTimeout(timer);
  }, [state.status, state.expiresAt, expireSession]);

  const value = useMemo<AuthContextValue>(
    () => ({
      status: state.status,
      user: state.user,
      expiresAt: state.expiresAt,
      authError: state.authError,
      login,
      logout,
      clearAuthError,
    }),
    [state.status, state.user, state.expiresAt, state.authError, login, logout, clearAuthError],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside <AuthProvider>');
  return context;
}
