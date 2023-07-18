'use client';

import { FC, useEffect, useRef } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import { Button } from './ui/Button';
import { SubmitHandler, useForm } from 'react-hook-form';
import {
    CommentCreateRequest,
    commentCreateValidator,
} from '@/lib/validation/subreddit-post-comment-create';
import { zodResolver } from '@hookform/resolvers/zod';
import { cn } from '@/lib/utils';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';
import type { Session } from 'next-auth';
import { useRouter } from 'next/navigation';

interface WriteCommentFormProps {
    postId: string;
    user: Session['user'] | null;
    replyId?: string;
    initContent?: string;
    onClose?: () => void;
    inlineBtn?: boolean;
    actionWhenMounted?: keyof Pick<HTMLTextAreaElement, 'focus' | 'select'>;
}

const WriteCommentForm: FC<WriteCommentFormProps> = ({
    postId,
    user,
    replyId = null,
    initContent = '',
    onClose,
    inlineBtn = false,
    actionWhenMounted,
}) => {
    const {
        handleSubmit,
        register,
        reset,
        clearErrors,
        formState: { errors },
    } = useForm<CommentCreateRequest>({
        resolver: zodResolver(commentCreateValidator),
        defaultValues: {
            content: initContent,
            postId: postId,
            replyId: replyId,
        },
        reValidateMode: 'onSubmit',
    });

    const { toast } = useToast();
    const router = useRouter();
    const contentRef = useRef<HTMLTextAreaElement>(null);

    const { mutate: message, isLoading } = useMutation({
        mutationFn: async (data: CommentCreateRequest) => {
            const res = await axios({
                method: 'Post',
                url: '/api/r/subreddit/post/comment/create',
                data,
            });
            return res.data;
        },
        onSuccess() {
            onClose ? onClose() : reset({ content: initContent });
            router.refresh();
        },
        onError(error) {
            toast({
                title: 'Uh oh',
                description: 'Please try again later.',
                variant: 'destructive',
            });
        },
    });

    const onSubmit: SubmitHandler<CommentCreateRequest> = (data) => {
        if (!user) {
            router.push('/sign-in');
            return;
        }
        message(data);
    };

    const {
        onChange,
        ref: contentRefForm,
        ...propsContent
    } = register('content');

    useEffect(() => {
        if (!contentRef.current) return;
        actionWhenMounted && contentRef.current[actionWhenMounted]();
    }, []);

    return (
        <form
            className="flex flex-col gap-2 relative mb-2"
            onSubmit={handleSubmit(onSubmit)}
        >
            <TextareaAutosize
                placeholder="What are you thing!"
                className={cn(
                    'w-full resize-none border outline-none p-3 rounded-md transition-all overflow-hidden',
                    {
                        'text-red-600 bg-red-100/50 border-red-500 placeholder:text-red-400':
                            !!errors.content?.message,
                        'pb-14': inlineBtn === true,
                    }
                )}
                onChange={(e) => {
                    clearErrors();
                    onChange(e);
                }}
                ref={(e) => {
                    //@ts-ignore
                    contentRef.current = e;
                    contentRefForm(e);
                }}
                {...propsContent}
                minRows={3}
                spellCheck={false}
            />
            <div
                className={cn({
                    'absolute bottom-2 right-2 flex': inlineBtn === true,
                    'ml-auto': inlineBtn === false,
                })}
            >
                {onClose && (
                    <Button
                        onClick={onClose}
                        type="button"
                        variant={'secondary'}
                        className="mr-2"
                    >
                        Cancel
                    </Button>
                )}
                <Button className="" type="submit" isLoading={isLoading}>
                    Post
                </Button>
            </div>
        </form>
    );
};

export default WriteCommentForm;
