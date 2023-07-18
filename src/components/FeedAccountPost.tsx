import { getAuthSession } from '@/lib/auth';
import { LIMIT_PAGINATION } from '@/lib/config';
import { db } from '@/lib/db';
import { notFound } from 'next/navigation';
import { FC } from 'react';
import PostFeed from './PostFeed';
import redis from '@/lib/redis';
import { PostPagination } from '@/types/pagination';

interface FeedAccountPostProps {}

const FeedAccountPost = async ({}) => {
    const session = await getAuthSession();
    if (!session?.user) {
        return notFound();
    }

    const key = ['posts', session.user.id, 1, LIMIT_PAGINATION];
    const cache = await redis.get(key.join('|'));
    if (cache) {
        return (
            <PostFeed
                initPosts={(cache as PostPagination).data}
                session={session}
                queryKey={['infinityPosts']}
                initHasNextPage={(cache as PostPagination).hasNextPage}
            />
        );
    }

    const followerCommunities = await db.subscription.findMany({
        where: { userId: session.user.id },
        include: {
            Subreddit: true,
        },
    });

    const followerCommunitiesId = followerCommunities.map(
        (follower) => follower.Subreddit.id
    );

    const posts = await db.post.findMany({
        where: {
            Subreddit: {
                id: {
                    in: followerCommunitiesId,
                },
            },
        },
        take: LIMIT_PAGINATION,
        orderBy: { createdAt: 'desc' },
        include: {
            User: true,
            votes: true,
            Subreddit: true,
            _count: {
                select: { comment: true },
            },
        },
    });

    return (
        <PostFeed
            initPosts={posts}
            session={session}
            queryKey={['infinityPosts']}
        />
    );
};

export default FeedAccountPost;
