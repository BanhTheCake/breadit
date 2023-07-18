import { getAuthSession } from '@/lib/auth';
import { db } from '@/lib/db';
import redis from '@/lib/redis';
import { subredditPostVoteValidator } from '@/lib/validation/subreddit-post-vote';
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

        const { type, postId } = subredditPostVoteValidator.parse({
            type: typeParams,
            ...body,
        });

        const existVote = await db.vote.findFirst({
            where: {
                postId: postId,
                userId: session.user.id,
            },
        });

        if (existVote) {
            // User already vote
            await db.vote.delete({
                where: {
                    userId_postId: {
                        userId: session.user.id,
                        postId: postId,
                    },
                },
            });
            if (existVote.type !== type) {
                await db.vote.create({
                    data: {
                        type: type,
                        userId: session.user.id,
                        postId: postId,
                    },
                });
            }
        } else {
            await db.vote.create({
                data: {
                    type: type,
                    userId: session.user.id,
                    postId: postId,
                },
            });
        }
        await deletePostCache();
        return NextResponse.json(`Vote ${type} success.`);
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

const deletePostCache = async () => {
    const data = await redis.keys('posts*');
    data.forEach(async (key) => {
        await redis.del(key);
    });
};
