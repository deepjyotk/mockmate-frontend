import { NextResponse, NextRequest } from 'next/server';
import PUBLIC_ROUTES from './config/publicRoutes';

// Define paths that do not require authentication


export function middleware(request: NextRequest) {

  const { pathname } = request.nextUrl;

  if (PUBLIC_ROUTES.includes(pathname)) {
    return NextResponse.next();
  }


  const accessToken =request.cookies.get('accessToken')?.value;

  // If no access token, redirect to login page
  if (!accessToken) {
    const loginUrl = new URL('/auth/login', request.url); // Redirect to login
    return NextResponse.redirect(loginUrl);
  }


  // If token exists, proceed to the requested page
  return NextResponse.next();
}

// Configure the middleware to match all routes except public paths
export const config = {
  matcher: [
    '/((?!api/auth|auth/login|auth/signup|_next/static|favicon.ico).*)',
    '/((?!.*\\.).*)' 
  ],
};