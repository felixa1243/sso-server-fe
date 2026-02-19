import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const body = await request.json();
    const cookieStore = await cookies();
    const token = cookieStore.get('access_token')?.value;
    const data = await fetch(`${process.env.NEXT_PUBLIC_AUTH_API_URL}/clients`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(body),
    });
    const dataJson = await data.json();
    return NextResponse.json(dataJson);
}

export async function GET() {
    const cookieStore = await cookies();
    const token = cookieStore.get('access_token')?.value;
    const data = await fetch(`${process.env.NEXT_PUBLIC_AUTH_API_URL}/clients`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });
    const dataJson = await data.json();
    return NextResponse.json(dataJson.data);
}