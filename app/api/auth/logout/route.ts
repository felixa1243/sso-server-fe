import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST() {
    try {
        const apiUrl = process.env.NEXT_PUBLIC_AUTH_API_URL;
        if (apiUrl) {
            await fetch(`${apiUrl}/logout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            }).catch(() => {}); // Ignore errors on logout
        }

        const cookieStore = await cookies();
        cookieStore.delete('access_token');
        return NextResponse.json({ message: 'Logout successful' });
    } catch {
        return NextResponse.json(
            { message: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
