import createMiddleware from 'next-intl/middleware';

import { vitNodeConfig } from './vitnode.config';

export default createMiddleware(vitNodeConfig.i18n);

export const config = {
  matcher: [
    // Enable a redirect to a matching locale at the root
    '/',

    // Set a cookie to remember the previous locale for
    // all requests that have a locale prefix
    '/(de|en)/:path*',

    // Enable redirects that add missing locales
    // (e.g. `/pathnames` -> `/en/pathnames`)
    '/((?!_next|_vercel|api|.*\\..*).*)',
  ],
};
