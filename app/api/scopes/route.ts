import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
    const cookieStore = await cookies();
    const token = cookieStore.get('access_token')?.value;
    const data = await fetch(`${process.env.NEXT_PUBLIC_AUTH_API_URL}/scopes`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });
    return NextResponse.json(await data.json());
}