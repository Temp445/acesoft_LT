import { NextRequest, NextResponse } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

// Step 1: Setup intl middleware separately
const intlMiddleware = createIntlMiddleware(routing);

// Define keyword → redirect path mapping
const keywordRedirectMap: Record<string, string> = {
    'calibration': 'https://home.acecms.in', // '/products/v1/ace-calibration-management-system-on-cloud',
    'acecms': 'https://home.acecms.in',
    'cms': 'https://home.acecms.in',
    'production-management-system': '/ace-production-management-system',
    'payroll': '/ace-profit-stand-alone-payroll',
    'ppap': '/ace-profit-ppap',
    'fixed-asset-management': '/ace-fixed-asset-management-on-cloud',
    'hrms': '/ace-profit-stand-alone-hrms',
    'erp': '/ace-profit-erp',
};

// Step 3: Known paths that should never be redirected
const knownPaths = new Set([
  '/',
  '/productenquire',
  '/test-lang',
  '/contact',
  '/about',
  '/admin',
  '/admin/upload',
  '/unauthorized',
  '/login',
  '/demo',
  '/user',
  '/videos',
  '/products',
  '/ace-calibration-management-system-on-cloud',
  '/ace-production-management-system',
  '/ace-profit-stand-alone-payroll',
  '/ace-profit-ppap',
  '/ace-fixed-asset-management-on-cloud',
  '/ace-profit-stand-alone-hrms',
  '/ace-profit-erp',
]);

// Helper: should skip based on static file or API
function isSkippable(pathname: string): boolean {
  return (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.') // static assets
  );
}

// Helper: matches keyword
function getRedirectFromKeyword(pathname: string): string | null {
  for (const keyword in keywordRedirectMap) {
    if (pathname.toLowerCase().includes(keyword.toLowerCase())) {
      return keywordRedirectMap[keyword];
    }
  }
  return null;
}
function stripLocale(pathname: string): string {
  const localePattern = /^\/(en|hi|be|br|de|fr|es|it|ru|zh|ja|kr)(\/|$)/; 
  return pathname.replace(localePattern, '/');
}

//  Final unified middleware
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  console.log('[middleware] Path:', pathname);

  const response = intlMiddleware(request);


  // Skip internal or static files
  if (isSkippable(pathname)) {
    console.log('[middleware] Skipping static/API:', pathname);
    return response || NextResponse.next();
  }

   const basePath = stripLocale(pathname);
  if (knownPaths.has(basePath)) {
    console.log('[middleware] Known path allowed:', basePath);
    return response || NextResponse.next();
  }

  // Keyword redirect 
  const redirectTo = getRedirectFromKeyword(pathname);
  if (redirectTo) {
    console.log(`[middleware] Redirect keyword found → ${redirectTo}`);
    return NextResponse.redirect(new URL(redirectTo, request.url));
  }

    // return NextResponse.redirect(new URL('/', request.url));
     console.log('[middleware] Invalid route. Redirecting to /');
  return NextResponse.redirect(new URL('/', request.url));
}


export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|api|.*\\..*).*)',
  ],
};
