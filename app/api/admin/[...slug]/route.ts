import { serverApi, withAuth } from "@/lib/serverApi";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, context: { params: Promise<{ slug: string[] }> }) {
    const { slug } = await context.params;
    const path = slug.join('/');

    try {
        const authConfig = await withAuth();
        const res = await serverApi.get(`/admin/${path}`, authConfig);
        return NextResponse.json(res.data);
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            return NextResponse.json(error.response.data, { status: error.response.status });
        }
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}

export async function POST(request: NextRequest, context: { params: Promise<{ slug: string[] }> }) {
    const { slug } = await context.params;
    const path = slug.join('/');
    const body = await request.json();

    try {
        const authConfig = await withAuth();
        const res = await serverApi.post(`/admin/${path}`, body, authConfig);
        return NextResponse.json(res.data);
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            return NextResponse.json(error.response.data, { status: error.response.status });
        }
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}

export async function PUT(request: NextRequest, context: { params: Promise<{ slug: string[] }> }) {
    const { slug } = await context.params;
    const path = slug.join('/');

    try {
        const authConfig = await withAuth();
        const res = await serverApi.put(`/admin/${path}`, {}, authConfig);
        return NextResponse.json(res.data);
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            return NextResponse.json(error.response.data, { status: error.response.status });
        }
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ slug: string[] }> }) {
    const { slug } = await context.params;
    const path = slug.join('/');

    try {
        const authConfig = await withAuth();
        const res = await serverApi.delete(`/admin/${path}`, authConfig);
        return NextResponse.json(res.data);
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            return NextResponse.json(error.response.data, { status: error.response.status });
        }
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
