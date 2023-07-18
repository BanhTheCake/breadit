import { getAuthSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { subredditDeleteValidator } from '@/lib/validation/subreddit-delete';
import { NextResponse } from 'next/server';
import { z } from 'zod';

export async function DELETE(req: Request) {
    try {
        const session = await getAuthSession();
        if (!session?.user) {
            return NextResponse.json('You are not authenticate.', {
                status: 401,
            });
        }
        const { searchParams } = new URL(req.url);
        const subredditIdParam = searchParams.get('subredditId');
        const { subredditId } = subredditDeleteValidator.parse({
            subredditId: subredditIdParam,
        });

        const existSubreddit = await db.subreddit.findFirst({
            where: {
                id: subredditId,
                creatorId: session.user.id,
            },
        });

        if (!existSubreddit) {
            return NextResponse.json(
                `Subreddit with id ${subredditId} is not exist.`,
                {
                    status: 400,
                }
            );
        }
        await db.subreddit.delete({
            where: {
                id: subredditId,
            },
        });
        return NextResponse.json('Delete success.');
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json('Params is missing or wrong format', {
                status: 400,
            });
        }
        return NextResponse.json('Something wrong with server.', {
            status: 500,
        });
    }
}
