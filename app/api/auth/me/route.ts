import { serverApi, withAuth } from "@/lib/serverApi";
import axios from "axios";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const authConfig = await withAuth(); // The me endpoint typically expects a token despite lacking headers boilerplate previously. Let's include withAuth to be safe for a '/me' endpoint.
        const res = await serverApi.get(`/me`, authConfig);
        return NextResponse.json(res.data);
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            return NextResponse.json(error.response.data, { status: error.response.status });
        }
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}