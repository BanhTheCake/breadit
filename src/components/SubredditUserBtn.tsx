'use client';

import { Subreddit, Subscription } from '@prisma/client';
import { Session } from 'next-auth';
import Link from 'next/link';
import { FC } from 'react';
import { Button, buttonVariants } from './ui/Button';
import { useMutation } from '@tanstack/react-query';
import { SubredditJoinRequest } from '@/lib/validation/subreddit-join';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { SubredditLeaveRequest } from '@/lib/validation/subreddit-leave';
import { subredditDeleteValidator } from '@/lib/validation/subreddit-delete';

interface SubredditUserBtnProps {
    subreddit: Subreddit & { subscriptions: Subscription[] };
    session: Session | null;
}

const SubredditUserBtn: FC<SubredditUserBtnProps> = ({
    subreddit,
    session,
}) => {
    const membersCommunity =
        subreddit?.subscriptions.map((sub) => sub.userId) || [];
    const isMemberOfCommunity = !!(
        session?.user && membersCommunity.includes(session.user.id)
    );

    const router = useRouter();
    const { toast } = useToast();

    const { mutate: handleJoinSubreddit, isLoading: isJoining } = useMutation({
        mutationFn: async () => {
            const data: SubredditJoinRequest = {
                subredditId: subreddit.id,
            };
            const dataRes = await axios({
                method: 'Post',
                url: '/api/r/subreddit/join',
                data,
            });
            return dataRes;
        },
    });

    const { mutate: handleLeaveSubreddit, isLoading: isLeaving } = useMutation({
        mutationFn: async () => {
            const data: SubredditLeaveRequest = {
                subredditId: subreddit.id,
            };
            const dataRes = await axios({
                method: 'Delete',
                url: '/api/r/subreddit/leave',
                params: data,
            });
            return dataRes;
        },
    });

    const onLeaveSubreddit = () => {
        handleLeaveSubreddit(undefined, {
            onSuccess() {
                router.refresh();
            },
            onError() {
                toast({
                    title: 'Failed.',
                    description: 'Please try again later.',
                });
            },
        });
    };

    const onJoinSubreddit = () => {
        handleJoinSubreddit(undefined, {
            onSuccess() {
                router.refresh();
            },
            onError() {
                toast({
                    title: 'Failed.',
                    description: 'Please try again later.',
                });
            },
        });
    };

    if (!session?.user) {
        return (
            <Link
                href={'/sign-in'}
                className={buttonVariants({ className: 'w-full' })}
            >
                Join community
            </Link>
        );
    }

    return (
        <>
            {isMemberOfCommunity ? (
                <div className="flex gap-4 w-full">
                    <Link
                        href={`/r/${subreddit.name}/post/create`}
                        className={buttonVariants({
                            variant: 'outline',
                            className: 'flex-1',
                        })}
                    >
                        Create post
                    </Link>
                    <Button
                        className="flex-1"
                        onClick={onLeaveSubreddit}
                        isLoading={isLeaving}
                    >
                        Leave community
                    </Button>
                </div>
            ) : (
                <Button
                    className="w-full"
                    onClick={onJoinSubreddit}
                    isLoading={isJoining}
                >
                    Join community
                </Button>
            )}
        </>
    );
};

export default SubredditUserBtn;
