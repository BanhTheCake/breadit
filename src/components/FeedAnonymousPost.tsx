import { LIMIT_PAGINATION } from '@/lib/config';
import { db } from '@/lib/db';
import { FC } from 'react';
import PostFeed from './PostFeed';
import redis from '@/lib/redis';
import { PostPagination } from '@/types/pagination';

interface FeedAnonymousPostProps {}

const FeedAnonymousPost = async ({}) => {
    const key = ['posts', 1, LIMIT_PAGINATION];
    const cache = await redis.get(key.join('|'));
    if (cache) {
        return (
            <PostFeed
                initPosts={(cache as PostPagination).data}
                session={null}
                queryKey={['infinityPosts']}
                initHasNextPage={(cache as PostPagination).hasNextPage}
            />
        );
    }

    const posts = await db.post.findMany({
        where: {},
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
            session={null}
            queryKey={['infinityPosts']}
        />
    );
};

export default FeedAnonymousPost;
