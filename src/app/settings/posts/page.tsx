import PostFeedLite from '@/components/PostFeedLite';
import { Skeleton } from '@/components/ui/Skeleton';
import { getAuthSession } from '@/lib/auth';
import { LIMIT_PAGINATION } from '@/lib/config';
import { db } from '@/lib/db';
import { notFound } from 'next/navigation';

const PostsSettings = async () => {
    const session = await getAuthSession();
    if (!session?.user) {
        return notFound();
    }

    const posts = await db.post.findMany({
        where: {
            userId: session.user.id,
        },
        orderBy: {
            createdAt: 'desc',
        },
        take: LIMIT_PAGINATION,
        select: {
            id: true,
            title: true,
            updatedAt: true,
            createdAt: true,
            votes: true,
            Subreddit: true,
            userId: true,
            _count: {
                select: {
                    comment: true,
                },
            },
        },
    });

    return (
        <PostFeedLite
            initPosts={posts}
            queryKey={['infinityPostsLite']}
            session={session}
            filter="me"
        />
    );
};

export default PostsSettings;
