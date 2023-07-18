import { getAuthSession } from '@/lib/auth';
import { LIMIT_PAGINATION } from '@/lib/config';
import { db } from '@/lib/db';
import { Prisma } from '@prisma/client';
import { NextResponse } from 'next/server';
import { boolean, z } from 'zod';
import redis from '@/lib/redis';
import { Session } from 'next-auth';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const limit =
            parseInt(searchParams.get('limit') ?? '') ?? LIMIT_PAGINATION;
        const page = parseInt(searchParams.get('page') ?? '') ?? 1;
        const subredditName = searchParams.get('subreddit');

        const session = await getAuthSession();
        const { cache, key } = await getDataFromRedis(
            session,
            subredditName,
            page,
            limit
        );
        if (cache) {
            return NextResponse.json(cache);
        }

        let followerCommunitiesId: string[] = [];

        if (session?.user) {
            const followerCommunities = await db.subscription.findMany({
                where: { userId: session.user.id },
                include: {
                    Subreddit: true,
                },
            });

            followerCommunitiesId = followerCommunities.map(
                (follower) => follower.Subreddit.id
            );
        }

        let whereClause: Prisma.PostWhereInput = {};

        if (subredditName) {
            whereClause = {
                Subreddit: {
                    name: subredditName,
                },
            };
        } else if (session?.user) {
            whereClause = {
                Subreddit: {
                    id: {
                        in: followerCommunitiesId,
                    },
                },
            };
        }

        const posts = await db.post.findMany({
            where: whereClause,
            take: limit,
            skip: (page - 1) * limit,
            include: {
                User: true,
                votes: true,
                Subreddit: true,
                _count: {
                    select: { comment: true },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        const allPostsCount = await db.post.count({
            where: whereClause,
        });

        const allPages = Math.ceil(allPostsCount / limit);
        const hasNextPage = page < allPages;
        const nextPage = page + 1;

        if (posts.length !== 0) {
            await setDataFromRedis(key, {
                data: posts,
                hasNextPage,
                nextPage,
            });
        }

        return NextResponse.json(
            {
                data: posts,
                hasNextPage,
                nextPage,
            },
            { status: 200 }
        );
    } catch (error) {
        console.log(error);
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

const getDataFromRedis = async (
    session: Session | null,
    subredditName: string | null,
    page: number,
    limit: number
) => {
    let arrKey: (string | number)[] = ['posts', page, limit];
    if (subredditName) {
        arrKey = ['posts', subredditName, page, limit];
    } else if (session?.user) {
        arrKey = ['posts', session.user.id, page, limit];
    }
    let key = arrKey.join('|');
    const cache = await redis.get(key);
    return { cache, key };
};

const setDataFromRedis = async (key: string, data: any) => {
    redis.set(key, JSON.stringify(data), {
        ex: 60 * 5, // 5 minutes,
    });
};
