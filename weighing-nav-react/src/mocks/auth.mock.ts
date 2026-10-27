// ---------------------------------------------------------------
// احراز هویت mock — فقط برای توسعه و دموی فرانت‌اند.
//
// این ماژول باید هنگام اتصال به بک‌اند با سرویس واقعی جایگزین شود.
// هیچ نقطه پایانی یا توکنی اختراع نمی‌کند و اعتبارنامه‌ها را ذخیره نمی‌کند.
// اعتبارنامه نمایشی: demo / Demo1234 (در UI نمایش داده نمی‌شود).
// ---------------------------------------------------------------

import type { AuthCredentials, AuthResult } from '../auth/types';

const AUTH_DELAY_MS = 350;

/** اعتبارنامه‌های آزمایشی موقت (فقط برای مرحله توسعه). */
export const MOCK_CREDENTIALS = {
  username: 'demo',
  password: 'Demo1234',
} as const;

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

/**
 * مقایسه اعتبارنامه‌ها با یک تأخیر کوتاه برای شبیه‌سازی فراخوانی شبکه.
 * رمز عبور دقیقاً همان‌طور که وارد شده مقایسه می‌شود (بدون trim یا تغییر).
 */
export async function mockAuthenticate(credentials: AuthCredentials): Promise<AuthResult> {
  await wait(AUTH_DELAY_MS);

  const username = credentials.username.trim();
  const passwordMatches = credentials.password === MOCK_CREDENTIALS.password;

  if (username === MOCK_CREDENTIALS.username && passwordMatches) {
    return { success: true, user: { username: MOCK_CREDENTIALS.username } };
  }

  return { success: false, error: 'نام کاربری یا رمز عبور نادرست است.' };
}
