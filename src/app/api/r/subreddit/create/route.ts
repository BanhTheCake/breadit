import { getAuthSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { SubbredditValidator } from '@/lib/validation/subbreddit-create';
import { NextResponse } from 'next/server';
import { z } from 'zod';

export async function POST(req: Request) {
    try {
        const session = await getAuthSession();
        if (!session?.user) {
            return NextResponse.json('You are not authenticate.', {
                status: 401,
            });
        }
        const data = await req.json();
        const { name } = SubbredditValidator.parse(data);

        const existSubreddit = await db.subreddit.findFirst({
            where: {
                name,
            },
        });

        if (existSubreddit) {
            return NextResponse.json(
                `Subreddit ${name} is exist already exist.`,
                {
                    status: 400,
                }
            );
        }

        const newSubreddit = await db.subreddit.create({
            data: {
                name,
                creatorId: session.user.id,
            },
        });
        await db.subscription.create({
            data: {
                subredditId: newSubreddit.id,
                userId: session.user.id,
            },
        });
        return NextResponse.json(name);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json('Params is missing or wrong format.', {
                status: 400,
            });
        }
        return NextResponse.json('Something wrong with server.', {
            status: 500,
        });
    }
}
