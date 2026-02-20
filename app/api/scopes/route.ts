import { serverApi, withAuth } from "@/lib/serverApi";
import axios from "axios";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const authConfig = await withAuth();
        const res = await serverApi.get(`/scopes`, authConfig);
        return NextResponse.json(res.data);
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            return NextResponse.json(error.response.data, { status: error.response.status });
        }
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}