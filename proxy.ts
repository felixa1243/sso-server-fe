import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
    const token = request.cookies.get('access_token')?.value;
    const ssoLoginUrl = `${process.env.NEXT_PUBLIC_FRONTEND_URL}/login`;
    if (!token) {
        return NextResponse.redirect(ssoLoginUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/dashboard',
        '/dashboard/:path*',
        '/create-post',
        '/profile',
        '/settings',
        '/protected/:path*'
    ],
};