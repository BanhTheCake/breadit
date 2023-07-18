import { getAuthSession } from '@/lib/auth';
import { db } from '@/lib/db';
import redis from '@/lib/redis';
import { postUpdateValidator } from '@/lib/validation/post-update';
import { NextResponse } from 'next/server';
import { z } from 'zod';

export async function GET(
    request: Request,
    { params }: { params: { postId: string } }
) {
    try {
        console.log(params);
        const session = await getAuthSession();
        if (!session?.user) {
            return NextResponse.json('You are not authenticate', {
                status: 401,
            });
        }
        const post = await db.post.findFirst({
            where: {
                id: params.postId,
                userId: session.user.id,
            },
        });
        return NextResponse.json(post);
    } catch (error) {
        return NextResponse.json('Something wrong with server.', {
            status: 500,
        });
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: { postId: string } }
) {
    try {
        const session = await getAuthSession();
        if (!session?.user) {
            return NextResponse.json('You are not authenticate', {
                status: 401,
            });
        }
        const body = await req.json();
        const { id, title, content } = postUpdateValidator.parse({
            ...body,
            id: params.postId,
        });

        const existPost = await db.post.findFirst({
            where: {
                id: id,
                userId: session.user.id,
            },
        });

        if (!existPost) {
            return NextResponse.json('Post not found', {
                status: 404,
            });
        }

        await db.post.update({
            where: {
                id: id,
            },
            data: {
                title,
                content,
            },
        });
        await deletePostCache(id);
        return NextResponse.json('Update post success', { status: 200 });
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

export async function DELETE(
    req: Request,
    { params }: { params: { postId: string } }
) {
    try {
        const session = await getAuthSession();
        if (!session?.user) {
            return NextResponse.json('You are not authenticate', {
                status: 401,
            });
        }

        const existPost = await db.post.findFirst({
            where: {
                id: params.postId,
                userId: session.user.id,
            },
        });

        if (!existPost) {
            return NextResponse.json('Post not found', {
                status: 404,
            });
        }

        await db.post.delete({
            where: {
                id: params.postId,
            },
        });
        await deletePostCache(params.postId);
        return NextResponse.json('Delete post success', { status: 200 });
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

const deletePostCache = async (postId: string) => {
    const allPostsKey = await redis.keys('posts*');
    allPostsKey.forEach(async (key) => {
        await redis.del(key);
    });
    const currentPostKey = await redis.keys(`post|${postId}*`);
    await redis.del(currentPostKey[0]);
};
