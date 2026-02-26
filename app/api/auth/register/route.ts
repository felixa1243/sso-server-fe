import { NextResponse } from 'next/server';
import { serverApi } from '@/lib/serverApi';
import axios from 'axios';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const response = await serverApi.post(`/register`, body);

        return NextResponse.json(response.data, { status: 201 });
    } catch (error) {
        console.error('Registration proxy error:', error);
        if (axios.isAxiosError(error) && error.response) {
            return NextResponse.json(
                error.response.data,
                { status: error.response.status }
            );
        }
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}
