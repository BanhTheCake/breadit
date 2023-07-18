import { Comment, CommentVote, User } from '@prisma/client';
import { FC } from 'react';
import CommentCard from './CommentCard';
import type { Session } from 'next-auth';

interface TopCommentProps {
    comment: Comment & {
        User: User;
        commentVote: CommentVote[];
        replies: (Comment & {
            User: User;
            commentVote: CommentVote[];
        })[];
    };
    user: Session['user'] | null;
    postId: string;
}

const TopComment: FC<TopCommentProps> = ({ comment, user, postId }) => {
    return (
        <div>
            <CommentCard comment={comment} user={user} postId={postId} />
            <div className="ml-4 pl-4 border-l-2 border-zinc-300 mt-2">
                {comment.replies.length > 0 &&
                    comment.replies.map((replyComment) => {
                        return (
                            <CommentCard
                                key={replyComment.id}
                                comment={replyComment}
                                user={user}
                                postId={postId}
                            />
                        );
                    })}
            </div>
        </div>
    );
};

export default TopComment;
