# منوی سامانه توزین معادن (React)

React 19 + TypeScript + React Router 7 + lucide-react، ساخته‌شده با Vite.

## اجرا
npm install
npm run dev

## ساختار
src/nav/nav.config.json   داده منو (تنها جای تعریف منو)
src/nav/types.ts          تایپ‌ها (Role، Priority، NavConfig …)
src/nav/navModel.ts       منطق خالص: فیلتر نقش و فاز، یافتن مسیر
src/nav/NavContext.tsx    NavProvider، useNav، useCurrentRoute
src/nav/AppSidebar.tsx    نوار آیکون (rail) + پنل
src/nav/NavPanel.tsx      پنل درختی گروه و آیتم
src/nav/NavGroup.tsx      گروه Disclosure (button + aria-expanded)
src/nav/RouteGuard.tsx    جلوگیری از باز شدن مستقیم مسیرهای غیرمجاز
src/nav/AppLayout.tsx     چیدمان صفحه، breadcrumb، drawer موبایل
src/nav/sidebar.css       توکن‌ها و استایل (حالت تاریک و موبایل)
src/auth/session.ts        سرویس متمرکز نشست (sessionStorage، انقضا، اعتبارسنجی)
src/auth/AuthContext.tsx   AuthProvider و useAuth (login/logout/بازیابی نشست)
src/auth/AuthGate.tsx      RequireAuth و GuestOnly برای مسیرهای محافظت‌شده/عمومی
src/auth/AuthControls.tsx  نمایش کاربر واردشده و دکمه خروج
src/mocks/auth.mock.ts     احراز هویت mock (فقط توسعه)
src/pages/                صفحه ورود، صفحه موقت هر مسیر و صفحه ۴۰۴

## احراز هویت (موقت)
ورود با اعتبارنامه نمایشی `demo` / `Demo1234` انجام می‌شود. این احراز هویت صرفاً
mock فرانت‌اند است و امنیت تولیدی ندارد. نشست فقط در `sessionStorage` نگه داشته
می‌شود، هیچ رمز یا توکنی ذخیره نمی‌کند و به‌صورت پیش‌فرض پس از ۳۰ دقیقه منقضی می‌شود
(قابل تنظیم با `sessionTtlMs` در `AuthProvider`). برای اتصال بک‌اند، فقط یک
پیاده‌سازی `Authenticator` واقعی به `AuthProvider` بدهید؛ نیازی به تغییر
محافظ‌های مسیر یا صفحه ورود نیست.

## اتصال نقش به احراز هویت
در App.tsx مقدار role را به‌جای انتخابگر نمایشی از کاربر واردشده بخوانید
و کنترل‌های demoControls را حذف کنید. برای جایگزینی صفحه موقت، در map مسیرها
بر اساس item.to کامپوننت واقعی را برگردانید.
