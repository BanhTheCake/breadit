'use client';

import { Comment, CommentVote, User } from '@prisma/client';
import { FC, useState } from 'react';
import UserAvatar from './UserAvatar';
import { formatTimeToNow } from '@/lib/utils';
import { Button } from './ui/Button';
import { MessageSquare } from 'lucide-react';
import type { Session } from 'next-auth';
import { useRouter } from 'next/navigation';
import VoteClient from './VoteClient';
import WriteCommentForm from './WriteCommentForm';

interface CommentCardProps {
    comment: Comment & {
        User: User;
        commentVote: CommentVote[];
    };
    user: Session['user'] | null;
    postId: string;
}

const CommentCard: FC<CommentCardProps> = ({
    comment,
    user: userAccount,
    postId,
}) => {
    const [isShowReply, setShowReply] = useState(false);

    const user = comment.User;
    const router = useRouter();

    const voteAmt = comment.commentVote.reduce((rs, vote) => {
        if (vote.type === 'DOWN') return rs - 1;
        if (vote.type === 'UP') return rs + 1;
        return rs;
    }, 0);

    const currentVote = comment.commentVote.find(
        (vote) => vote.userId === userAccount?.id
    )?.type;

    const onToggleReply = () => {
        if (!userAccount) {
            router.push('/sign-in');
            return;
        }
        setShowReply(!isShowReply);
    };

    return (
        <div className="flex flex-col">
            <div className="flex items-center mb-1">
                <UserAvatar
                    image={user.image ?? undefined}
                    name={user.name ?? undefined}
                />
                <span className="font-medium text-sm mx-2">
                    u/{user.username}
                </span>
                <span className="text-zinc-500 text-sm">
                    {formatTimeToNow(comment.createdAt)}
                </span>
            </div>
            <p className="mb-1">{comment.text}</p>
            <div className="flex items-center mb-1">
                <VoteClient
                    voteAmt={voteAmt}
                    currentVote={currentVote}
                    commentId={comment.id}
                    userId={userAccount?.id}
                    type="comment"
                />
                <Button
                    variant={'ghost'}
                    className="w-fit"
                    onClick={onToggleReply}
                >
                    <MessageSquare className="pr-1" />
                    Reply
                </Button>
            </div>
            {isShowReply ? (
                <WriteCommentForm
                    onClose={onToggleReply}
                    postId={postId}
                    replyId={comment.replyToId ?? comment.id}
                    user={userAccount}
                    initContent={`@${user.username} `}
                    actionWhenMounted="select"
                    inlineBtn={true}
                />
            ) : null}
        </div>
    );
};

export default CommentCard;
