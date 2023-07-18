import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const url = searchParams.get('url');
        if (!url) {
            return NextResponse.json('Notfound url', { status: 400 });
        }
        const res = await axios.get(url);

        // Parse the HTML using regular expressions
        const titleMatch = res.data.match(/<title>(.*?)<\/title>/);
        const title = titleMatch ? titleMatch[1] : '';

        const descriptionMatch = res.data.match(
            /<meta name="description" content="(.*?)"/
        );
        const description = descriptionMatch ? descriptionMatch[1] : '';

        const imageMatch = res.data.match(
            /<meta property="og:image" content="(.*?)"/
        );
        const imageUrl = imageMatch ? imageMatch[1] : '';
        const rs = {
            success: 1,
            meta: {
                title: title,
                description: description,
                image: {
                    url: imageUrl,
                },
            },
        };
        return NextResponse.json(rs);
    } catch (error) {
        return NextResponse.json('Something wrong with server.', {
            status: 500,
        });
    }
}
