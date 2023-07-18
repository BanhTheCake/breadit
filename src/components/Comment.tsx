import { db } from '@/lib/db';
import type { Session } from 'next-auth';
import { FC } from 'react';
import CommentCard from './CommentCard';
import TopComment from './TopComment';

interface CommentProps {
    postId: string;
    user: Session['user'] | null;
}

function delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

const Comment = async ({ postId, user }: CommentProps) => {
    const comments = await db.comment.findMany({
        where: { replyToId: null, postId: postId },
        include: {
            User: true,
            commentVote: true,
            replies: {
                include: {
                    commentVote: true,
                    User: true,
                },
            },
        },
        orderBy: {
            createdAt: 'desc',
        },
    });

    return (
        <div className="flex flex-col gap-2">
            {comments.length > 0 &&
                comments.map((topComment) => {
                    return (
                        <TopComment
                            key={topComment.id}
                            comment={topComment}
                            user={user}
                            postId={postId}
                        />
                    );
                })}
        </div>
    );
};

export default Comment;
