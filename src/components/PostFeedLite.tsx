'use client';

import { LIMIT_PAGINATION } from '@/lib/config';
import { PostLitePagination } from '@/types/pagination';
import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import { Session } from 'next-auth';
import { FC, useEffect, useMemo, useRef } from 'react';
import PostCardLite from './PostCardLite';
import { SettingPostRequest } from '@/lib/validation/setting-post';
import { useIntersectionObserver } from '@/hooks/use-intersection-observer';

interface PostFeedLiteProps {
    session: Session;
    initPosts: PostLitePagination['data'];
    initHasNextPage?: boolean;
    queryKey: string[];
    filter: SettingPostRequest['filter'];
}

const PostFeedLite: FC<PostFeedLiteProps> = ({
    session,
    initPosts,
    queryKey,
    initHasNextPage = true,
    filter = 'me',
}) => {
    const lastPostRef = useRef<HTMLDivElement>(null);
    const entry = useIntersectionObserver(lastPostRef, {
        threshold: 0,
    });

    const { data, isLoading, fetchNextPage, isFetchingNextPage, hasNextPage } =
        useInfiniteQuery({
            queryKey: [
                ...queryKey,
                {
                    filter,
                },
            ],
            queryFn: async ({ pageParam = 1 }) => {
                const params: SettingPostRequest = {
                    page: pageParam,
                    limit: LIMIT_PAGINATION,
                    filter: filter,
                };

                const res = await axios({
                    method: 'get',
                    url: '/api/user/post',
                    params,
                });
                const data = res.data as PostLitePagination;
                return data;
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

    const allPosts = useMemo<PostLitePagination['data'] | undefined>(() => {
        const posts = data?.pages.reduce((rs, page) => {
            if (page.data) return [...rs, ...page.data];
            return rs;
        }, [] as PostLitePagination['data']);
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
                                <PostCardLite
                                    sessionId={session.user?.id}
                                    post={post}
                                    subredditName={post.Subreddit.name}
                                />
                            </div>
                        );
                    }
                    return (
                        <div key={post.id}>
                            <PostCardLite
                                sessionId={session.user?.id}
                                post={post}
                                subredditName={post.Subreddit.name}
                            />
                        </div>
                    );
                })
            ) : (
                <p className="text-zinc-500 text-2xl text-center py-6">
                    You don&apos;t have any posts yet.
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

export default PostFeedLite;
