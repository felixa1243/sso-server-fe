import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
    const { email, password } = await req.json();

    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_AUTH_API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        const cookieStore = await cookies();
        cookieStore.set('access_token', data.access_token, {

            httpOnly: true,

            secure: true,

            sameSite: 'lax',

            path: '/',
        });
        return NextResponse.json({ message: 'Login successful' });
    } catch (err) {
        throw new Error('Login failed');
    }
}