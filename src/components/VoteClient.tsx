'use client';

import { FC, useEffect, useState } from 'react';
import { Button, buttonVariants } from './ui/Button';
import { ArrowBigUpDash, ArrowBigDownDash } from 'lucide-react';
import { TYPE_VOTE } from '@prisma/client';
import { cn } from '@/lib/utils';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';
import { VariantProps } from 'class-variance-authority';

type PostVote = {
    type: 'post';
    postId: string;
};

type CommentVote = {
    type: 'comment';
    commentId: string;
};

type vote = {
    voteAmt: number;
    currentVote: TYPE_VOTE | undefined;
    userId: string | undefined;
    size?: VariantProps<typeof buttonVariants>['size'];
};

type VoteClientProps = vote & (PostVote | CommentVote);

const VoteClient: FC<VoteClientProps> = ({
    voteAmt,
    currentVote,
    userId,
    size = 'default',
    ...props
}) => {
    const [_voteAmt, setVoteAmt] = useState(voteAmt);
    const [_currentVote, setCurrentVote] = useState(currentVote);

    const router = useRouter();
    const { toast } = useToast();

    const { mutate: vote, isLoading } = useMutation({
        mutationFn: async (type: TYPE_VOTE) => {
            if (!userId) return router.push('sign-in');

            let url = '';
            let data = {};
            if (props.type === 'post') {
                url = '/api/r/subreddit/post/vote';
                data = { postId: props.postId };
            } else {
                url = '/api/r/subreddit/post/comment/vote';
                data = { commentId: props.commentId };
            }

            const res = await axios({
                method: 'Patch',
                url,
                data,
                params: {
                    type,
                },
            });
            return res.data;
        },
        onMutate(type) {
            const voteAmtPrevious = _voteAmt;
            const currentVotePrevious = _currentVote;
            if (type === 'DOWN') {
                if (_currentVote === 'DOWN') {
                    setCurrentVote(undefined);
                    setVoteAmt(_voteAmt + 1);
                } else if (_currentVote === 'UP') {
                    setCurrentVote(type);
                    setVoteAmt(_voteAmt - 2);
                } else if (_currentVote === undefined) {
                    setCurrentVote(type);
                    setVoteAmt(_voteAmt - 1);
                }
            } else if (type === 'UP') {
                if (_currentVote === 'UP') {
                    setCurrentVote(undefined);
                    setVoteAmt(_voteAmt - 1);
                } else if (_currentVote === 'DOWN') {
                    setCurrentVote(type);
                    setVoteAmt(_voteAmt + 2);
                } else if (_currentVote === undefined) {
                    setCurrentVote(type);
                    setVoteAmt(_voteAmt + 1);
                }
            }
            return { voteAmtPrevious, currentVotePrevious };
        },
        onError(error, _, context) {
            toast({
                title: 'Uh oh',
                description: 'Please try again later!',
                variant: 'destructive',
            });
            if (!context) return;
            setVoteAmt(context.voteAmtPrevious);
            setCurrentVote(context.currentVotePrevious);
        },
        onSuccess(data) {
            router.refresh();
        },
    });

    useEffect(() => {
        setVoteAmt(voteAmt);
        setCurrentVote(currentVote);
    }, [voteAmt, currentVote]);

    return (
        <div
            className={cn('flex justify-center items-center', {
                'flex-col': props.type === 'post',
            })}
        >
            <Button
                variant={'ghost'}
                onClick={() => {
                    if (!userId) {
                        router.push('/sign-in');
                        return;
                    }
                    vote('UP');
                }}
                disabled={isLoading}
                className={cn({ 'px-2': props.type === 'comment' })}
                size={size}
            >
                <ArrowBigUpDash
                    className={cn({
                        'stroke-emerald-500': _currentVote === 'UP',
                    })}
                />
            </Button>
            <div
                className={cn({
                    'my-3': size === 'default',
                    'my-2': size === 'sm',
                    'my-1': size === 'xs',
                })}
            >
                {_voteAmt}
            </div>
            <Button
                variant={'ghost'}
                onClick={() => {
                    if (!userId) {
                        router.push('/sign-in');
                        return;
                    }
                    vote('DOWN');
                }}
                disabled={isLoading}
                className={cn({ 'px-2': props.type === 'comment' })}
                size={size}
            >
                <ArrowBigDownDash
                    className={cn({
                        'stroke-red-500': _currentVote === 'DOWN',
                    })}
                />
            </Button>
        </div>
    );
};

export default VoteClient;
