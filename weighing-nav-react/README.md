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
src/pages/                صفحه موقت هر مسیر و صفحه ۴۰۴

## اتصال به احراز هویت
در App.tsx مقدار role را به‌جای انتخابگر نمایشی از کاربر واردشده بخوانید
و کنترل‌های demoControls را حذف کنید. برای جایگزینی صفحه موقت، در map مسیرها
بر اساس item.to کامپوننت واقعی را برگردانید.
