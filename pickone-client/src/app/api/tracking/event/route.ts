import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://server.zyslet.com';

        const response = await fetch(`${apiBaseUrl}/api/v1/tracking/event`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            throw new Error('Failed to forward tracking event to server');
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error forwarding tracking event:', error);
        return NextResponse.json({ success: true });
    }
}
