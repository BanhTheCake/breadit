import { getAuthSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { subredditLeaveValidator } from '@/lib/validation/subreddit-leave';
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
        const { subredditId } = subredditLeaveValidator.parse({
            subredditId: searchParams.get('subredditId'),
        });
        await db.subscription.delete({
            where: {
                userId_subredditId: {
                    userId: session.user.id,
                    subredditId: subredditId,
                },
            },
        });
        return NextResponse.json('Leave community success.');
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
