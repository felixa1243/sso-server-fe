import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, context: { params: Promise<{ slug: string[] }> }) {
    const { slug } = await context.params;
    const path = slug.join('/');
    const cookieStore = await cookies();
    const token = cookieStore.get('access_token')?.value;
    const res = await fetch(`${process.env.NEXT_PUBLIC_AUTH_API_URL}/admin/${path}`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });
    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
}

export async function POST(request: NextRequest, context: { params: Promise<{ slug: string[] }> }) {
    const { slug } = await context.params;
    const path = slug.join('/');
    const body = await request.json();
    const cookieStore = await cookies();
    const token = cookieStore.get('access_token')?.value;
    const res = await fetch(`${process.env.NEXT_PUBLIC_AUTH_API_URL}/admin/${path}`, {
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

export async function PUT(request: NextRequest, context: { params: Promise<{ slug: string[] }> }) {
    const { slug } = await context.params;
    const path = slug.join('/');
    const cookieStore = await cookies();
    const token = cookieStore.get('access_token')?.value;
    const res = await fetch(`${process.env.NEXT_PUBLIC_AUTH_API_URL}/admin/${path}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });
    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ slug: string[] }> }) {
    const { slug } = await context.params;
    const path = slug.join('/');
    const cookieStore = await cookies();
    const token = cookieStore.get('access_token')?.value;
    const res = await fetch(`${process.env.NEXT_PUBLIC_AUTH_API_URL}/admin/${path}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });
    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
}
