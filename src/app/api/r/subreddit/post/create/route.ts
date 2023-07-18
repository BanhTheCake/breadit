import { getAuthSession } from '@/lib/auth';
import { db } from '@/lib/db';
import redis from '@/lib/redis';
import { subredditPostCreateValidator } from '@/lib/validation/subreddit-post-create';
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
        const { subredditId, title, content } =
            subredditPostCreateValidator.parse(body);

        const isMember = await db.subscription.findFirst({
            where: {
                userId: session.user.id,
                subredditId: subredditId,
            },
        });

        if (!isMember) {
            return NextResponse.json("You haven't join this community", {
                status: 400,
            });
        }

        const newPost = await db.post.create({
            data: {
                content,
                title,
                subredditId,
                userId: session.user.id,
            },
        });
        await deletePostCache();
        return NextResponse.json('Create post success', {
            status: 200,
        });
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
