import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    const cookieStore = await cookies();
    const token = cookieStore.get('access_token')?.value;
    const data = await fetch(`${process.env.NEXT_PUBLIC_AUTH_API_URL}/domains`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });
    return NextResponse.json(await data.json());
}
export async function POST(req: NextRequest) {
    const cookieStore = await cookies();
    const token = cookieStore.get('access_token')?.value;
    const requestBody = await req.json();
    const data = await fetch(`${process.env.NEXT_PUBLIC_AUTH_API_URL}/domains`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
    });
    return NextResponse.json(await data.json());
}