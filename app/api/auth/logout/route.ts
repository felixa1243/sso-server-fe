export async function POST() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_AUTH_API_URL}/logout`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    return res;
}