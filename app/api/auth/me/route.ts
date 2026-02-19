import { NextResponse } from "next/server";

export async function GET() {
    const data = await fetch(`${process.env.NEXT_PUBLIC_AUTH_API_URL}/me`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    return NextResponse.json(await data.json());
}