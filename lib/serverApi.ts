import axios from 'axios';
import { cookies } from 'next/headers';

export const serverApi = axios.create({
    baseURL: process.env.NEXT_PUBLIC_AUTH_API_URL,
    headers: {
        'Content-Type': 'application/json',
    }
});

/**
 * Attaches the access_token cookie to the authorization header.
 * Must be called inside the Next.js Route Handler scope where `cookies()` is accessible.
 */
export async function withAuth() {
    const cookieStore = await cookies();
    const token = cookieStore.get('access_token')?.value;

    return {
        headers: {
            'Authorization': token ? `Bearer ${token}` : '',
        }
    };
}
