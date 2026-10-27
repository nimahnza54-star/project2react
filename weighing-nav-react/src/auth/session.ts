// ---------------------------------------------------------------
// مدیریت نشست موقت فرانت‌اند (demo).
//
// این سرویس فقط یک نشانگر نشست را در sessionStorage نگه می‌دارد تا
// رفتار ورود/خروج و محافظت از مسیرها بدون بک‌اند قابل آزمایش باشد.
// این روش احراز هویت واقعی و امن نیست و باید در زمان اتصال به بک‌اند
// با کوکی HttpOnly یا مکانیزم امن سمت سرور جایگزین شود.
//
// هیچ رمز عبور یا access/refresh token در این ماژول ذخیره نمی‌شود.
// sessionStorage با بستن تب پاک می‌شود؛ انقضای زمانی نیز جداگانه بررسی می‌شود.
// ---------------------------------------------------------------

import type { AuthSession, SessionUser } from './types';

export const SESSION_STORAGE_KEY = 'wnav.auth.session';

const MINUTE_MS = 60_000;

/** مدت پیش‌فرض نشست: ۳۰ دقیقه. با گزینه ttlMs قابل تغییر است. */
export const DEFAULT_SESSION_TTL_MS = 30 * MINUTE_MS;

/** حداقل بخش موردنیاز Storage؛ برای تست با storage ساختگی هم کار می‌کند. */
export type SessionStore = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;

export interface SessionOptions {
  /** در صورت نیاز می‌توان storage دیگری (مثلاً برای تست) تزریق کرد. */
  storage?: SessionStore | null;
  /** زمان فعلی؛ برای تست‌پذیری قابل تزریق است. */
  now?: number;
}

export interface CreateSessionOptions extends SessionOptions {
  /** مدت اعتبار نشست به میلی‌ثانیه. */
  ttlMs?: number;
}

function getBrowserSessionStorage(): SessionStore | null {
  try {
    if (typeof window === 'undefined') return null;
    return window.sessionStorage;
  } catch {
    // دسترسی به storage ممکن است توسط تنظیمات مرورگر مسدود شده باشد.
    return null;
  }
}

function resolveStore(options: SessionOptions): SessionStore | null {
  return options.storage === undefined ? getBrowserSessionStorage() : options.storage;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isSessionUser(value: unknown): value is SessionUser {
  return isRecord(value) && typeof value.username === 'string' && value.username.trim().length > 0;
}

/** بررسی ساختار و انقضای نشست بدون دست زدن به storage. */
export function isValidSession(value: unknown, now = Date.now()): value is AuthSession {
  if (!isRecord(value)) return false;
  if (!isSessionUser(value.user)) return false;
  if (typeof value.createdAt !== 'number' || !Number.isFinite(value.createdAt)) return false;
  if (typeof value.expiresAt !== 'number' || !Number.isFinite(value.expiresAt)) return false;
  if (value.expiresAt <= value.createdAt) return false;
  return value.expiresAt > now;
}

/**
 * خواندن نشست معتبر. در صورت نبودن، خرابی JSON، ساختار نامعتبر یا انقضا
 * مقدار null برمی‌گرداند و داده معیوب را پاک می‌کند. هرگز throw نمی‌کند.
 */
export function readSession(options: SessionOptions = {}): AuthSession | null {
  const store = resolveStore(options);
  if (!store) return null;

  let raw: string | null;
  try {
    raw = store.getItem(SESSION_STORAGE_KEY);
  } catch {
    return null;
  }

  if (!raw) return null;

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    clearSession(options);
    return null;
  }

  if (!isValidSession(parsed, options.now ?? Date.now())) {
    clearSession(options);
    return null;
  }

  return parsed;
}

/**
 * ساخت و ذخیره نشست. در صورت غیرفعال بودن storage یا نامعتبر بودن ورودی
 * مقدار null برمی‌گرداند تا لایه UI بتواند خطا را نمایش دهد.
 */
export function createSession(
  user: SessionUser,
  options: CreateSessionOptions = {},
): AuthSession | null {
  const username = typeof user.username === 'string' ? user.username.trim() : '';
  if (!username) return null;

  const ttlMs = options.ttlMs ?? DEFAULT_SESSION_TTL_MS;
  if (!Number.isFinite(ttlMs) || ttlMs <= 0) return null;

  const now = options.now ?? Date.now();
  const session: AuthSession = {
    user: { username },
    createdAt: now,
    expiresAt: now + ttlMs,
  };

  const store = resolveStore(options);
  if (!store) return null;

  try {
    store.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
  } catch {
    return null;
  }

  return session;
}

/** پاک کردن نشست؛ در صورت در دسترس نبودن storage بی‌صدا رد می‌شود. */
export function clearSession(options: SessionOptions = {}): void {
  const store = resolveStore(options);
  if (!store) return;

  try {
    store.removeItem(SESSION_STORAGE_KEY);
  } catch {
    /* storage در دسترس نیست */
  }
}

/** زمان باقی‌مانده تا انقضا (حداقل صفر). */
export function getSessionRemainingMs(session: AuthSession, now = Date.now()): number {
  return Math.max(0, session.expiresAt - now);
}
