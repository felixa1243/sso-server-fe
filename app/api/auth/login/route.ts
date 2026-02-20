import { serverApi } from "@/lib/serverApi";
import axios from "axios";
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

        try {
            const res = await serverApi.post(`/login`, { email, password });

            const data = res.data;

            const cookieStore = await cookies();
            cookieStore.set('access_token', data.access_token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/',
                maxAge: 60 * 60 * 24 * 7,
            });

            return NextResponse.json(data);
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                return NextResponse.json(
                    { message: error.response.data.message || 'Login failed' },
                    { status: error.response.status }
                );
            }
            throw error;
        }

    } catch (err: unknown) {
        console.error('Login error:', err);
        return NextResponse.json(
            { message: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
