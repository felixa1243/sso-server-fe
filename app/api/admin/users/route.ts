import { NextResponse } from 'next/server';
import { withAuth } from '@/lib/serverApi';
import axios from 'axios';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const authConfig = await withAuth();

        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/admin/users`, body, {
            headers: authConfig.headers
        });

        return NextResponse.json(response.data, { status: 201 });
    } catch (error: unknown) {
        console.error('Admin create user proxy error:', error);
        if (axios.isAxiosError(error)) {
            return NextResponse.json(
                { message: error.response?.data?.error || 'Failed to create user' },
                { status: error.response?.status || 500 }
            );
        }
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}
