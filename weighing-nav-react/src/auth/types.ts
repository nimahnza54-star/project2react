// انواع مشترک احراز هویت.
// این ماژول عمداً از منطق mock و از سرویس ذخیره‌سازی جدا است تا
// جای‌گزینی mock با بک‌اند واقعی فقط با تغییر پیاده‌سازی Authenticator انجام شود.

export interface AuthCredentials {
  username: string;
  password: string;
}

/** اطلاعات غیرحساسی که پس از ورود در نشست نگه داشته می‌شود. */
export interface SessionUser {
  username: string;
}

/**
 * نشست موقت فرانت‌اند.
 * این ساختار هیچ رمز عبور، access token یا refresh token ذخیره نمی‌کند.
 */
export interface AuthSession {
  user: SessionUser;
  createdAt: number;
  expiresAt: number;
}

export type AuthResult =
  | { success: true; user: SessionUser }
  | { success: false; error: string };

export type Authenticator = (
  credentials: AuthCredentials,
) => Promise<AuthResult> | AuthResult;

export type AuthStatus = 'initializing' | 'authenticated' | 'unauthenticated';
