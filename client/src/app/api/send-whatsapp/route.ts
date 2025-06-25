import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
// import { env } from "@/lib/env"

function isValidPhoneNumber(phone: string): boolean {
    return /^\+?[1-9]\d{1,14}$/.test(phone); // E.164 format
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { data, to } = body;

        if (!data) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        let phoneNumbers = [to];
        if (!to) {
            phoneNumbers = process.env.ADMIN_PHONES?.split(',').map((p) => p.trim()) || [];

            if (!phoneNumbers || phoneNumbers.length === 0) {
                console.error('❌ Admin Phone Numbers missing. Set ADMIN_PHONES in .env.');
                return NextResponse.json({ error: 'Missing phone number' }, { status: 400 });
            }
        }

        const stromxToken = process.env.STROMX_API_TOKEN!;
        if (!stromxToken) {
            return NextResponse.json({ error: 'StromX token not set' }, { status: 500 });
        }

        // console.log(JSON.stringify({...data, to}, null , 2));

        const url = `https://api.stromx.io/v1/message/send-message?token=${stromxToken}`;

        const results: { to: string; status: 'success' | 'error'; response?: unknown; error?: unknown }[] = [];

        for (const phone of phoneNumbers) {
            if (!isValidPhoneNumber(phone)) {
                results.push({
                    to: phone,
                    status: 'error',
                    error: 'Invalid phone number format. Must be in E.164 format like +919876543210'
                });
                continue;
            }

            try {
                const response = await axios.post(url, {
                    ...data,
                    to: phone
                }, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                results.push({ to: phone, status: 'success', response: response.data });
            } catch (error: unknown) {
                let errorMessage = 'Unknown error';

                if (axios.isAxiosError(error)) {
                    errorMessage = error.response?.data || error.message;
                } else if (error instanceof Error) {
                    errorMessage = error.message;
                } else {
                    errorMessage = JSON.stringify(error);
                }

                console.error(`WhatsApp error for ${phone}:`, errorMessage);
                results.push({ to: phone, status: 'error', error: errorMessage });
            }
        }

        return NextResponse.json({ success: true, results });

    } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
            console.error('Axios error:', err.response?.data || err.message);
            return NextResponse.json({ error: err.response?.data || err.message }, { status: 500 });
        } else if (err instanceof Error) {
            console.error('Error:', err.message);
            return NextResponse.json({ error: err.message }, { status: 500 });
        } else {
            console.error('Unexpected error:', err);
            return NextResponse.json({ error: 'Unexpected error occurred' }, { status: 500 });
        }
    }
}
