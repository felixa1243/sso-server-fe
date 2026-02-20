import { serverApi } from '@/lib/serverApi';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST() {
    try {
        await serverApi.post(`/logout`, {}).catch(() => { }); // Ignore errors on logout

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
