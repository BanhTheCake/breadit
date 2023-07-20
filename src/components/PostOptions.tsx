'use client';

import {
    MoreHorizontal,
    ClipboardEdit,
    Trash2,
    X,
    Loader2,
} from 'lucide-react';
import { FC, useState } from 'react';
import { Button } from './ui/Button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from './ui/Dropdown-menu';
import Link from 'next/link';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

interface PostOptionsProps {
    post: {
        id: string;
        subredditName: string;
    };
}

const PostOptions: FC<PostOptionsProps> = ({ post }) => {
    const [isClickDeleteBtn, setIsClickDeleteBtn] = useState(false);
    const { toast } = useToast();
    const router = useRouter();
    const queryClient = useQueryClient();

    const { mutate: deletePost, isLoading: isDeleting } = useMutation({
        mutationFn: async () => {
            const res = await axios({
                method: 'delete',
                url: `/api/r/subreddit/post/${post.id}`,
            });
            return res.data;
        },
    });

    const onToggleDelete = () => {
        setIsClickDeleteBtn(!isClickDeleteBtn);
    };

    const onDelete = () => {
        deletePost(undefined, {
            onSuccess() {
                toast({
                    title: 'Success',
                    description: `Delete post success.`,
                });
                queryClient.invalidateQueries({
                    queryKey: ['infinityPostsLite'],
                });
            },
            onError() {
                toast({
                    title: 'Failed',
                    description: `Please try again later.`,
                    variant: 'destructive',
                });
            },
        });
    };

    return (
        <>
            <DropdownMenu
                onOpenChange={() => {
                    // wait for animation finish
                    setTimeout(() => {
                        setIsClickDeleteBtn(false);
                    }, 200);
                }}
            >
                <DropdownMenuTrigger asChild>
                    <Button
                        variant={'ghost'}
                        className="aspect-square absolute top-2 right-2 bg-white"
                        size={'xs'}
                    >
                        {isDeleting ? (
                            <Loader2 className="stroke-zinc-400 w-[26px] animate-spin" />
                        ) : (
                            <MoreHorizontal className="stroke-zinc-400 w-[26px]" />
                        )}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                    align="end"
                    sideOffset={4}
                    className="p-1 min-w-[128px]"
                >
                    <DropdownMenuItem asChild>
                        <Link
                            href={
                                '/r/' +
                                post.subredditName +
                                '/post/edit/' +
                                post.id
                            }
                            className="flex items-center"
                        >
                            <ClipboardEdit className="h-[22px] stroke-zinc-700 stroke-1 mr-3" />
                            <p className="text-zinc-700 text-sm">Update</p>
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />

                    {isClickDeleteBtn ? (
                        <DropdownMenuItem
                            asChild
                            className="bg-red-600 hover:!bg-red-500 transition-all"
                        >
                            <div
                                className="flex items-center transition-all text-white"
                                onClick={onDelete}
                            >
                                <Trash2 className="mr-3 h-[22px] stroke-white stroke-1" />
                                <p className="text-sm text-white">
                                    Click to delete
                                </p>
                            </div>
                        </DropdownMenuItem>
                    ) : (
                        <div
                            className="flex items-center relative  cursor-default select-none rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent"
                            onClick={onToggleDelete}
                        >
                            <Trash2 className="mr-3 h-[22px] stroke-zinc-700 stroke-1" />
                            <p className="text-zinc-700 text-sm">Delete</p>
                        </div>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
};

export default PostOptions;
