import { serverApi, withAuth } from "@/lib/serverApi";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const body = await request.json();
    try {
        const authConfig = await withAuth();
        const res = await serverApi.post(`/clients`, body, authConfig);
        return NextResponse.json(res.data);
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            return NextResponse.json(error.response.data, { status: error.response.status });
        }
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}

export async function GET() {
    try {
        const authConfig = await withAuth();
        const res = await serverApi.get(`/clients`, authConfig);
        return NextResponse.json(res.data.data);
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            return NextResponse.json(error.response.data, { status: error.response.status });
        }
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}