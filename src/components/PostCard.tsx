'use client';

import { formatTimeToNow } from '@/lib/utils';
import Link from 'next/link';
import { FC, useEffect, useRef, useState } from 'react';
import VoteClient from './VoteClient';
import { MessageSquare } from 'lucide-react';
import dynamic from 'next/dynamic';
import { PostPagination } from '@/types/pagination';
import slugify from 'slugify';

interface PostCardProps {
    post: PostPagination['data'][number];
    subredditName: string;
    sessionId: string | undefined;
}

const EditorContentOutput = dynamic(() => import('./EditorContentOutput'), {
    ssr: false,
});

const PostCard: FC<PostCardProps> = ({ post, subredditName, sessionId }) => {
    const contentRef = useRef<HTMLDivElement>(null);
    const [isShowGradient, setShowGradient] = useState(false);

    useEffect(() => {
        if (!contentRef.current) return;
        const resizeObserver = new ResizeObserver(() => {
            contentRef.current?.clientHeight === 240 && setShowGradient(true);
        });
        resizeObserver.observe(contentRef.current);
        return () => resizeObserver.disconnect(); // clean up
    }, []);

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
        <div className="bg-white rounded-md border shadow-sm overflow-hidden">
            <div className="flex">
                <div className="p-4 pr-0 flex items-start justify-center">
                    <VoteClient
                        voteAmt={voteAmt}
                        currentVote={currentVote}
                        userId={sessionId}
                        postId={post.id}
                        type="post"
                    />
                </div>
                <div className="p-4 w-full overflow-hidden">
                    <h3 className="flex items-center gap-2">
                        <Link
                            href={`/r/${subredditName}`}
                            className="underline"
                        >
                            r/{subredditName}
                        </Link>
                        <span className="h-[6px] w-[6px] bg-zinc-600 rounded-full" />
                        <p className="text-zinc-500 text-sm">
                            Posted by u/{post.User.username}{' '}
                            {formatTimeToNow(new Date(post.createdAt))}
                        </p>
                    </h3>
                    <Link
                        href={{
                            pathname: `/r/${subredditName}/post/${slug}`,
                            query: {
                                id: post.id,
                            },
                        }}
                        className="font-medium text-2xl py-2 flex"
                    >
                        {post.title}
                    </Link>
                    <div
                        className="max-h-60 overflow-hidden relative"
                        ref={contentRef}
                    >
                        <EditorContentOutput data={post.content} />
                        {isShowGradient && (
                            <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-white to-transparent" />
                        )}
                    </div>
                </div>
            </div>
            <div className="p-3 bg-zinc-50 border-t flex gap-2">
                <MessageSquare className="pr-1" />
                <span className="text-zinc-600 font-medium">
                    {post._count.comment} message
                </span>
            </div>
        </div>
    );
};

export default PostCard;
