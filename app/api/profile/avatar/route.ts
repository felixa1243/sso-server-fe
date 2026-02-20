import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const body = await request.json();
    const cookieStore = await cookies();
    const token = cookieStore.get('access_token')?.value;

    const res = await fetch(`${process.env.NEXT_PUBLIC_AUTH_API_URL}/change-avatar`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    });

    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
}
