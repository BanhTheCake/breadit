import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const q = searchParams.get('q');
        if (!q) {
            return NextResponse.json('query is missing', { status: 404 });
        }
        const subreddit = await db.subreddit.findMany({
            where: {
                name: {
                    contains: q,
                },
            },
            take: 5,
            include: {
                _count: {
                    select: {
                        subscriptions: true,
                    },
                },
            },
        });
        return NextResponse.json(subreddit);
    } catch (error) {
        return NextResponse.json('Something wrong with server.', {
            status: 500,
        });
    }
}
