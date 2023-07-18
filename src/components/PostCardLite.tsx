import { PostLitePagination } from '@/types/pagination';
import { FC } from 'react';
import slugify from 'slugify';
import VoteClient from './VoteClient';
import Link from 'next/link';
import { formatTimeToNow } from '@/lib/utils';
import { MessageSquare } from 'lucide-react';
import PostOptions from './PostOptions';

interface PostCardLiteProps {
    post: PostLitePagination['data'][number];
    subredditName: string;
    sessionId: string | undefined;
}

const PostCardLite: FC<PostCardLiteProps> = ({
    post,
    sessionId,
    subredditName,
}) => {
    const voteAmt = post.votes.reduce((rs, vote) => {
        if (vote.type === 'UP') return rs + 1;
        if (vote.type === 'DOWN') return rs - 1;
        return rs;
    }, 0);

    const currentVote = post.votes.find(
        (vote) => vote.userId === sessionId
    )?.type;

    const slug = slugify(post.title, { locale: 'vi', lower: true });

    return (
        <div className="bg-white rounded-md border shadow-sm relative">
            <div className="flex overflow-hidden">
                <div className="p-2 flex items-start justify-center bg-zinc-200/30">
                    <VoteClient
                        voteAmt={voteAmt}
                        currentVote={currentVote}
                        userId={sessionId}
                        postId={post.id}
                        type="post"
                        size={'xs'}
                    />
                </div>
                <div className="p-2 w-full overflow-hidden flex flex-col gap-2">
                    <Link
                        href={{
                            pathname: `/r/${subredditName}/post/${slug}`,
                            query: {
                                id: post.id,
                            },
                        }}
                        className="font-medium text-xl flex"
                    >
                        {post.title}
                    </Link>
                    <h3 className="flex items-center gap-2">
                        <Link
                            href={`/r/${subredditName}`}
                            className="underline"
                        >
                            r/{subredditName}
                        </Link>
                        <span className="h-[6px] w-[6px] bg-zinc-600 rounded-full" />
                        <p className="text-zinc-500 text-sm">
                            Posted {formatTimeToNow(new Date(post.createdAt))}
                        </p>
                    </h3>
                    <div className="flex gap-2 flex-1 mt-auto items-end">
                        <MessageSquare className="pr-1" />
                        <span className="text-zinc-600 font-medium">
                            {post._count.comment} message
                        </span>
                    </div>
                </div>
            </div>
            {post.userId === sessionId && (
                <PostOptions
                    post={{
                        id: post.id,
                        subredditName: subredditName,
                    }}
                />
            )}
        </div>
    );
};

export default PostCardLite;
