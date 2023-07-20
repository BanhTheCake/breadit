'use client';

import { Subreddit } from '@prisma/client';
import Link from 'next/link';
import { FC } from 'react';
import { Button, buttonVariants } from './ui/Button';
import { useMutation } from '@tanstack/react-query';
import { SubredditDelete } from '@/lib/validation/subreddit-delete';
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

interface SubredditOwnerBtnProps {
    subreddit: Subreddit;
}

const SubredditOwnerBtn: FC<SubredditOwnerBtnProps> = ({ subreddit }) => {
    const { toast } = useToast();
    const router = useRouter();

    const { mutate: deleteSubreddit, isLoading } = useMutation({
        mutationFn: async () => {
            const data: SubredditDelete = {
                subredditId: subreddit.id,
            };
            const dataRes = await axios({
                method: 'delete',
                url: '/api/r/subreddit/delete',
                params: data,
            });
            return dataRes;
        },
    });

    const onClick = () => {
        deleteSubreddit(undefined, {
            onSuccess(data) {
                toast({
                    title: 'Success.',
                    description: `delete ${subreddit.name} success.`,
                });
                router.push('/');
            },
            onError(error) {
                toast({
                    title: 'Failed.',
                    description: `Please try again later.`,
                });
            },
        });
    };

    return (
        <>
            <p className="text-zinc-600 text-sm my-2">
                You created this community
            </p>
            <div className="flex w-full">
                <Link
                    href={`/r/${subreddit.name}/post/create`}
                    className={buttonVariants({
                        variant: 'outline',
                        className: 'flex-1 mr-4',
                    })}
                >
                    Create post
                </Link>
                <Button
                    className="flex-1"
                    onClick={onClick}
                    isLoading={isLoading}
                >
                    Delete r/{subreddit.name}
                </Button>
            </div>
        </>
    );
};

export default SubredditOwnerBtn;
