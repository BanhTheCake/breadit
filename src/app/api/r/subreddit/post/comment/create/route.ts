import { getAuthSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { commentCreateValidator } from '@/lib/validation/subreddit-post-comment-create';
import { NextResponse } from 'next/server';
import { z } from 'zod';

export async function POST(req: Request) {
    try {
        const session = await getAuthSession();
        if (!session?.user) {
            return NextResponse.json('You are not authenticate', {
                status: 401,
            });
        }
        const body = await req.json();
        const { content, postId, replyId } = commentCreateValidator.parse(body);
        await db.comment.create({
            data: {
                text: content,
                postId: postId,
                replyToId: replyId,
                authorId: session.user.id,
            },
        });
        return NextResponse.json('Create message success', { status: 200 });
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
