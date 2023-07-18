'use client';

import { useIsMounted } from '@/hooks/use-is-mounted';
import {
    SubredditPostCreateRequest,
    subredditPostCreateValidator,
} from '@/lib/validation/subreddit-post-create';
import { zodResolver } from '@hookform/resolvers/zod';
import { Subreddit } from '@prisma/client';
import dynamic from 'next/dynamic';
import { FC, useEffect, useRef } from 'react';
import { SubmitHandler, useForm, Controller } from 'react-hook-form';
import TextareaAutosize from 'react-textarea-autosize';
import { Button } from './ui/Button';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

const EditorContentInput = dynamic(() => import('./EditorContentInput'), {
    ssr: false,
});

interface CreatePostFormProps {
    subreddit: Subreddit;
}

const CreatePostForm: FC<CreatePostFormProps> = ({ subreddit }) => {
    const defaultValues: SubredditPostCreateRequest = {
        title: '',
        subredditId: subreddit.id,
        content: null,
    };

    const {
        register,
        handleSubmit,
        formState: { errors },
        control,
        reset,
    } = useForm<SubredditPostCreateRequest>({
        resolver: zodResolver(subredditPostCreateValidator),
        defaultValues,
    });

    const { toast } = useToast();
    const router = useRouter();

    const { mutate: createPost, isLoading } = useMutation({
        mutationFn: async (data: SubredditPostCreateRequest) => {
            const dataRes = await axios({
                method: 'post',
                url: '/api/r/subreddit/post/create',
                data,
            });
            return dataRes;
        },
    });

    const titleRef = useRef<HTMLTextAreaElement>(null);
    const isMounted = useIsMounted();

    useEffect(() => {
        if (isMounted() && titleRef.current) {
            titleRef.current?.focus();
        }
    }, [isMounted]);

    const onSubmit: SubmitHandler<SubredditPostCreateRequest> = (data) => {
        createPost(data, {
            onSuccess(data) {
                toast({
                    title: 'Success',
                    description: 'Create new post success.',
                });
                router.refresh();
                reset(defaultValues);
            },
            onError(error) {
                toast({
                    title: 'Uh oh',
                    description: 'Please try again later.',
                    variant: 'destructive',
                });
            },
        });
    };

    const { ref: titleFormRef, ...titleFormProps } = register('title');

    return (
        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
            <TextareaAutosize
                ref={(e) => {
                    // @ts-ignore
                    titleRef.current = e;
                    titleFormRef(e);
                }}
                className="font-medium text-3xl w-full outline-none resize-none bg-zinc-50 rounded-md border p-4 shadow-sm "
                placeholder="Type your title"
                {...titleFormProps}
            />
            <Controller
                name="content"
                control={control}
                render={({ field: { value, onChange } }) => (
                    <EditorContentInput value={value} onChange={onChange} />
                )}
            />
            <Button isLoading={isLoading}>Create post</Button>
        </form>
    );
};

export default CreatePostForm;
