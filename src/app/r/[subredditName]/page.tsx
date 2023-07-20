import UserAvatar from '@/components/UserAvatar';
import { buttonVariants } from '@/components/ui/Button';
import { getAuthSession } from '@/lib/auth';
import { LIMIT_PAGINATION } from '@/lib/config';
import { db } from '@/lib/db';
import Link from 'next/link';
import { ImageIcon, Link2 } from 'lucide-react';
import PostFeed from '@/components/PostFeed';
import redis from '@/lib/redis';
import { PostPagination } from '@/types/pagination';
import { Metadata } from 'next';

interface SubredditProps {
    params: {
        subredditName: string;
    };
}

export async function generateMetadata({
    params,
}: SubredditProps): Promise<Metadata> {
    return {
        title: `r/${params.subredditName}`,
        description: `Community r/${params.subredditName}`,
    };
}

const SubredditPostPage = async ({
    params: { subredditName },
}: SubredditProps) => {
    const session = await getAuthSession();
    let subredditPosts = [];
    let hasNextPage = true;

    const key = ['posts', subredditName, 1, LIMIT_PAGINATION];
    const cache = await redis.get(key.join('|'));
    if (cache) {
        subredditPosts = (cache as PostPagination).data;
        hasNextPage = (cache as PostPagination).hasNextPage;
    }

    subredditPosts = await db.post.findMany({
        where: { Subreddit: { name: subredditName } },
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
        <div className="flex flex-col">
            <h1 className="font-semibold text-3xl mb-4">r/{subredditName}</h1>
            {session?.user && (
                <div className="bg-white p-3 rounded-md shadow-sm border flex mb-4">
                    <div className="relative w-fit mr-4">
                        <UserAvatar
                            image={session.user.image ?? undefined}
                            name={session.user.name ?? undefined}
                        />
                        <span className="absolute bg-green-500 border-[1.5px] border-white h-[14px] w-[14px] rounded-full bottom-0 right-0 " />
                    </div>
                    <Link
                        href={`/r/${subredditName}/post/create`}
                        className="flex-1 border rounded-md p-2 mr-4 overflow-hidden"
                    >
                        <p className="text-zinc-500 pl-2 font-medium truncate">
                            What do you thing ...
                        </p>
                    </Link>
                    <Link
                        href={`/r/${subredditName}/post/create`}
                        className={buttonVariants({
                            variant: 'ghost',
                            className: 'mr-4',
                        })}
                    >
                        <ImageIcon />
                    </Link>
                    <Link
                        href={`/r/${subredditName}/post/create`}
                        className={buttonVariants({ variant: 'ghost' })}
                    >
                        <Link2 />
                    </Link>
                </div>
            )}
            <PostFeed
                initPosts={subredditPosts}
                subredditName={subredditName}
                session={session}
                queryKey={['infinityPosts', subredditName]}
                initHasNextPage={hasNextPage}
            />
        </div>
    );
};

export default SubredditPostPage;
