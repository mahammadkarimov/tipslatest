// middleware.ts
import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales: ['az', 'en', 'ru'],
  defaultLocale: 'az',
  localePrefix: 'always' // həmişə URL-də locale olacaq
});

export const config = {
  matcher: ['/', '/((?!_next|favicon.ico).*)'],
};
