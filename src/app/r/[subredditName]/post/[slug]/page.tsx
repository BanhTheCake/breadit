import { db } from '@/lib/db';
import { notFound } from 'next/navigation';
import { formatTimeToNow } from '@/lib/utils';
import dynamic from 'next/dynamic';
import VoteServer from '@/components/VoteServer';
import { getAuthSession } from '@/lib/auth';
import { Suspense } from 'react';
import { Button } from '@/components/ui/Button';
import { ArrowBigDownDash, ArrowBigUpDash, Loader2 } from 'lucide-react';
import WriteCommentForm from '@/components/WriteCommentForm';
import Comment from '@/components/Comment';
import redis from '@/lib/redis';
import { Post, User } from '@prisma/client';

const EditorContentOutput = dynamic(
    () => import('@/components/EditorContentOutput'),
    { ssr: false }
);

type PostDetails =
    | (Post & {
          User: User;
      })
    | null;

interface PostDetailsProps {
    params: {
        subredditName: string;
        slug: string;
    };
    searchParams?: { id?: string };
}

const PostDetailsPage = async ({
    params: { subredditName, slug },
    searchParams,
}: PostDetailsProps) => {
    const postId = searchParams?.id;
    if (!postId) return notFound();

    let post: PostDetails | null = null;

    const key = ['post', postId].join('|');
    const cache = await redis.get(key);

    if (cache) {
        post = cache as PostDetails;
    } else {
        post = await db.post.findFirst({
            where: { id: postId },
            include: {
                User: true,
            },
        });
    }

    if (!post) return notFound();

    await redis.set(key, JSON.stringify(post), {
        ex: 60 * 5, // 5 minutes,
    });
    const session = await getAuthSession();

    const getData = async () => {
        const votes = await db.vote.findMany({ where: { postId: post!.id } });
        return votes;
    };

    return (
        <div className="flex gap-4 items-start">
            <Suspense fallback={<VoteLoading />}>
                <VoteServer
                    getData={getData}
                    postId={postId}
                    userId={session?.user?.id}
                />
            </Suspense>
            <div className="bg-white rounded-md border shadow-sm p-4 flex-1 overflow-hidden">
                <div className="pb-2">
                    <p className="text-sm text-zinc-400">
                        Posted by u/{post.User.username}{' '}
                        {formatTimeToNow(new Date(post.createdAt))}
                    </p>
                    <h1 className="text-2xl font-medium pb-4 pt-2">
                        {post.title}
                    </h1>
                    <EditorContentOutput data={post.content} />
                </div>
                <span className="w-full h-[1px] bg-zinc-300 my-6 block" />
                <div>
                    <p className="text-xl font-medium pb-4">Your comment</p>
                    <WriteCommentForm postId={postId} user={session?.user} />
                    <Suspense
                        fallback={
                            <div className="w-full justify-center items-center">
                                Loading comment...
                            </div>
                        }
                    >
                        <Comment postId={postId} user={session?.user} />
                    </Suspense>
                </div>
            </div>
        </div>
    );
};

const VoteLoading = () => {
    return (
        <div className="flex flex-col gap-3 justify-center items-center">
            <Button variant={'ghost'} disabled={true}>
                <ArrowBigUpDash />
            </Button>
            <Loader2 className="h-4 w-4 animate-spin" />
            <Button variant={'ghost'} disabled={true}>
                <ArrowBigDownDash />
            </Button>
        </div>
    );
};

export default PostDetailsPage;
