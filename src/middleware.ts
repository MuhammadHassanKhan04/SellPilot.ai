import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const sessionCookie = request.cookies.get('sellpilot_session');

  // Define protected dashboard paths
  const isProtectedPath =
    path.startsWith('/dashboard') ||
    path.startsWith('/create') ||
    path.startsWith('/products') ||
    path.startsWith('/publish') ||
    path.startsWith('/integrations') ||
    path.startsWith('/settings');

  // Define auth page paths (redirect logged-in users away from login/signup)
  const isAuthPath = path === '/login' || path === '/signup';

  if (isProtectedPath && !sessionCookie) {
    // Save the page they wanted to visit
    const redirectUrl = new URL('/login', request.url);
    redirectUrl.searchParams.set('callbackUrl', path);
    return NextResponse.redirect(redirectUrl);
  }

  if (isAuthPath && sessionCookie) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

// Config to specify matching paths
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/create/:path*',
    '/products/:path*',
    '/publish/:path*',
    '/integrations/:path*',
    '/settings/:path*',
    '/login',
    '/signup',
  ],
};
