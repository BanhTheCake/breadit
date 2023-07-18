import { getAuthSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { subredditJoinValidator } from '@/lib/validation/subreddit-join';
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
        const body = await req.json();
        const { subredditId } = subredditJoinValidator.parse(body);

        const isAlreadyJoin = await db.subscription.findFirst({
            where: {
                userId: session.user.id,
                subredditId: subredditId,
            },
        });

        if (isAlreadyJoin) {
            return NextResponse.json('You already join this community', {
                status: 400,
            });
        }

        await db.subscription.create({
            data: {
                subredditId: subredditId,
                userId: session.user.id,
            },
        });
        return NextResponse.json('Join community success.', { status: 200 });
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
