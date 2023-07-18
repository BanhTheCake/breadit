'use client';

import React, { FC, useEffect, useMemo, useRef } from 'react';
import PostCard from './PostCard';
import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';
import { LIMIT_PAGINATION } from '@/lib/config';
import { PostPagination } from '@/types/pagination';
import { useIntersectionObserver } from '@/hooks/use-intersection-observer';
import type { Session } from 'next-auth';
import { Loader2 } from 'lucide-react';

interface PostFeedProps {
    initPosts: PostPagination['data'];
    subredditName?: string;
    session: Session | null;
    queryKey?: string[];
    initHasNextPage?: boolean;
}

const PostFeed: FC<PostFeedProps> = ({
    initPosts,
    session,
    queryKey,
    subredditName,
    initHasNextPage = true,
}) => {
    const lastPostRef = useRef<HTMLDivElement>(null);
    const entry = useIntersectionObserver(lastPostRef, {
        threshold: 0,
    });

    const { fetchNextPage, data, isFetchingNextPage, isLoading, hasNextPage } =
        useInfiniteQuery({
            queryKey: queryKey,
            queryFn: async (pr) => {
                const pageParam = pr.pageParam || 1;
                let params: Record<string, string | number> = {
                    page: pageParam,
                    limit: LIMIT_PAGINATION,
                };
                if (subredditName)
                    params = { ...params, subreddit: subredditName };
                const dataRes = await axios({
                    method: 'get',
                    url: '/api/r/subreddit/post',
                    params: params,
                });
                const data = dataRes.data;
                return data as PostPagination;
            },
            getNextPageParam: (lastPage) => {
                return lastPage.hasNextPage ? lastPage.nextPage : undefined;
            },
            initialData: {
                pageParams: [undefined],
                pages: [
                    {
                        data: initPosts,
                        hasNextPage: initHasNextPage,
                        nextPage: 2,
                    },
                ],
            },
        });
    const allPosts = useMemo<PostPagination['data'] | undefined>(() => {
        const posts = data?.pages.reduce((rs, page) => {
            if (page.data.length === 0) return rs;
            return [...rs, ...page.data];
        }, [] as PostPagination['data']);
        return posts;
    }, [data]);

    useEffect(() => {
        if (entry?.isIntersecting && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [entry, hasNextPage, fetchNextPage, isFetchingNextPage]);

    return (
        <div className="flex flex-col gap-4">
            {allPosts && allPosts.length > 0 ? (
                allPosts.map((post, i) => {
                    if (i === allPosts.length - 1) {
                        return (
                            <div key={post.id} ref={lastPostRef}>
                                <PostCard
                                    sessionId={session?.user?.id}
                                    post={post}
                                    subredditName={post.Subreddit.name}
                                />
                            </div>
                        );
                    }
                    return (
                        <div key={post.id}>
                            <PostCard
                                sessionId={session?.user?.id}
                                post={post}
                                subredditName={post.Subreddit.name}
                            />
                        </div>
                    );
                })
            ) : (
                <p className="text-zinc-500 text-2xl text-center py-6">
                    This community has not post yet !
                </p>
            )}
            {isFetchingNextPage && (
                <div className="py-4 w-full flex items-center justify-center">
                    <Loader2 className="animate-spin stroke-zinc-500" />
                </div>
            )}
        </div>
    );
};

export default PostFeed;
