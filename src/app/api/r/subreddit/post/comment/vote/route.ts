import { getAuthSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { commentVoteValidator } from '@/lib/validation/comment-vote';
import { NextResponse } from 'next/server';
import { z } from 'zod';

export async function PATCH(req: Request) {
    try {
        const session = await getAuthSession();
        if (!session?.user) {
            return NextResponse.json('You are not authenticate', {
                status: 404,
            });
        }
        const { searchParams } = new URL(req.url);
        const typeParams = searchParams.get('type');
        const body = await req.json();

        const { type, commentId } = commentVoteValidator.parse({
            type: typeParams,
            ...body,
        });

        const existVote = await db.commentVote.findFirst({
            where: {
                commentId: commentId,
                userId: session.user.id,
            },
        });

        if (existVote) {
            // User already vote
            await db.commentVote.delete({
                where: {
                    userId_commentId: {
                        userId: session.user.id,
                        commentId: commentId,
                    },
                },
            });
            if (existVote.type !== type) {
                await db.commentVote.create({
                    data: {
                        type: type,
                        userId: session.user.id,
                        commentId: commentId,
                    },
                });
            }
        } else {
            await db.commentVote.create({
                data: {
                    type: type,
                    userId: session.user.id,
                    commentId: commentId,
                },
            });
        }
        return NextResponse.json(`Vote comment ${commentId} ${type} success.`);
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
