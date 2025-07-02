import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Public routes that don't require authentication
  const publicRoutes = [
    '/',
    '/search',
    '/listings',
    '/auth/signin',
    '/auth/signup',
    '/auth/callback',
    '/auth/reset-password',
    '/api/health',
    '/api/sitemap',
  ];

  // Routes that require authentication
  const protectedRoutes = [
    '/dashboard',
    '/listings/new',
    '/profile',
    '/messages',
  ];

  // Routes that should redirect authenticated users
  const authRoutes = ['/auth/signin', '/auth/signup'];

  // Check if current path matches any pattern
  const isPublicRoute = publicRoutes.some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  );
  
  const isProtectedRoute = protectedRoutes.some(route =>
    pathname.startsWith(route)
  );
  
  const isAuthRoute = authRoutes.includes(pathname);

  // Get auth token from cookies
  const authToken = req.cookies.get('sb-access-token')?.value ||
                   req.cookies.get('sb-refresh-token')?.value ||
                   req.cookies.get('supabase-auth-token')?.value;

  const hasSession = !!authToken;

  // Handle protected routes
  if (isProtectedRoute && !hasSession) {
    const redirectUrl = new URL('/auth/signin', req.url);
    redirectUrl.searchParams.set('redirectTo', pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Handle auth routes when user is already authenticated
  if (isAuthRoute && hasSession) {
    const redirectTo = req.nextUrl.searchParams.get('redirectTo') || '/dashboard';
    return NextResponse.redirect(new URL(redirectTo, req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
