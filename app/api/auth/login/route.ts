import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json();

        // Validate inputs
        if (!email || !password) {
            return NextResponse.json(
                { message: 'Email and password are required' },
                { status: 400 }
            );
        }

        const apiUrl = process.env.NEXT_PUBLIC_AUTH_API_URL;
        if (!apiUrl) {
            // Fallback or error if env not set
            console.error("NEXT_PUBLIC_AUTH_API_URL is not defined");
            return NextResponse.json(
                { message: 'Server configuration error' },
                { status: 500 }
            );
        }

        const res = await fetch(`${apiUrl}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            return NextResponse.json(
                { message: errorData.message || 'Login failed' },
                { status: res.status }
            );
        }

        const data = await res.json();

        const cookieStore = await cookies();
        cookieStore.set('access_token', data.access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60 * 24 * 7,
        });

        return NextResponse.json(data);
    } catch (err: unknown) {
        console.error('Login error:', err);
        return NextResponse.json(
            { message: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
