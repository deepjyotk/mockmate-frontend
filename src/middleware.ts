import { NextResponse, NextRequest } from 'next/server';
import PUBLIC_ROUTES from './config/publicRoutes';
import serverComponentFetchRequest from './services/serverComponentFetchRequest';

// Convert public routes to a Set for faster lookups
const PUBLIC_ROUTE_SET = new Set(PUBLIC_ROUTES);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1️⃣ Allow requests to public routes or static files
  if (PUBLIC_ROUTE_SET.has(pathname) || isPublicPath(pathname)) {
    return NextResponse.next();
  }


  // 2️⃣ Get the access token from cookies
  // const accessToken = request.cookies.get('accessToken')?.value;

  // 3️⃣ If access token is not present, redirect to login page with `returnTo` query param
  // if (!accessToken) {
  //   const loginUrl = new URL('/auth/login', request.url);
  //   loginUrl.searchParams.set('returnTo', request.nextUrl.pathname); // Save the intended URL
  //   return NextResponse.redirect(loginUrl);
  // }

  //  If the pathname is '/auth/logout', delete cookie and redirect to login
  if (pathname === '/auth/logout') {
    const loginUrl = new URL('/auth/login', request.url); // 👈 Absolute URL

    
    const logoutResponse = await serverComponentFetchRequest('auth/logout', { 
      method: 'POST', 
      credentials: 'include',  // Ensures cookies are sent cross-origin
      headers: { 'Content-Type': 'application/json' } 
  });
    // Make a POST request to /logout
    // const logoutResponse = await fetch('/api/logout', { 
    //     method: 'POST', 
    //     headers: { 'Content-Type': 'application/json' } 
    // }); 

    if ( !("payload"  in logoutResponse) ) {
        // Handle logout errors (e.g., log an error, show an error message)
        console.error('Logout failed:', logoutResponse.status); 
        return NextResponse.json({ error: 'Logout failed' }, { status: 500 }); 
    }


    const response = NextResponse.redirect(loginUrl);

    // 🔥 Delete accessToken cookie
    response.cookies.set('accessToken', '', {
      path: '/', // Clear the cookie for the entire site
      maxAge: 0,  // Expire the cookie immediately
    });

    return response;
  }


  // 🟢 If token exists, proceed to the requested page
  return NextResponse.next();
}

// 🔥 Utility function to identify paths that should be accessible without auth
function isPublicPath(pathname: string): boolean {
  // Allow access to Next.js static files, _next, API auth routes, and other assets
  return pathname.startsWith('/_next/') || 
         pathname.startsWith('/static/') || 
         pathname.startsWith('/public/') || 
         pathname.includes('.ico') || 
         pathname.includes('.png') || 
         pathname.includes('.jpg') || 
         pathname.includes('.css') || 
         pathname.includes('.js') || 
         pathname.startsWith('/auth/login') || 
         pathname.startsWith('/auth/signup') || 
         pathname.startsWith('/api/auth');
}

export const config = {
  matcher: [
    /**
     * Explanation:
     * - Ignore files in _next/static, _next/image, favicon.ico, and all file extensions like .png, .jpg, .svg, etc.
     * - The path `/(.*)` means apply the middleware to all routes except the ones in the negative lookahead.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|gif|webp|ico|css|js|json|txt|woff|woff2|ttf|otf|map)).*)',
  ],
};
