import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const token = request.cookies.get('access_token')?.value;
    const { pathname } = request.nextUrl;

    // Protected routes logic
    if (pathname.startsWith('/dashboard') || pathname.startsWith('/profile') || pathname.startsWith('/settings')) {
         if (!token) {
            const loginUrl = new URL('/login', request.url);
            return NextResponse.redirect(loginUrl);
        }
    }

    // Auth routes logic (redirect to dashboard if already logged in)
    if (pathname === '/login') {
        if (token) {
            const dashboardUrl = new URL('/dashboard', request.url);
            return NextResponse.redirect(dashboardUrl);
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/dashboard/:path*',
        '/profile/:path*',
        '/settings/:path*',
        '/login'
    ],
};
