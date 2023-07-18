'use client';

import { FC } from 'react';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { Button } from './ui/Button';
import EditorContentInput from './EditorContentInput';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import TextareaAutosize from 'react-textarea-autosize';
import {
    PostUpdateRequest,
    postUpdateValidator,
} from '@/lib/validation/post-update';
import { Post } from '@prisma/client';
import isEqual from 'lodash.isequal';

interface UpdatePostFormProps {
    initPost: Post;
}

const UpdatePostForm: FC<UpdatePostFormProps> = ({ initPost }) => {
    const defaultValues: PostUpdateRequest = {
        title: initPost.title ?? '',
        content: initPost.content ?? '',
        id: initPost.id,
    };

    const {
        register,
        handleSubmit,
        formState: { errors },
        control,
        reset,
    } = useForm<PostUpdateRequest>({
        resolver: zodResolver(postUpdateValidator),
        defaultValues,
    });

    const { toast } = useToast();
    const router = useRouter();

    const { mutate: updatePost, isLoading } = useMutation({
        mutationFn: async (data: PostUpdateRequest) => {
            const dataRes = await axios({
                method: 'patch',
                url: `/api/r/subreddit/post/${data.id}`,
                data: {
                    title: data.title,
                    content: data.content,
                },
            });
            return dataRes;
        },
    });

    const onSubmit: SubmitHandler<PostUpdateRequest> = (data) => {
        if (isEqual(data, defaultValues)) {
            return;
        }
        updatePost(data, {
            onSuccess: () => {
                toast({
                    title: 'Success',
                    description: 'Update post success.',
                    variant: 'default',
                });
                router.refresh();
            },
            onError() {
                toast({
                    title: 'Uh oh',
                    description: 'Please try again later.',
                    variant: 'destructive',
                });
            },
        });
    };

    return (
        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
            <TextareaAutosize
                className="font-medium text-3xl w-full outline-none resize-none bg-zinc-50 rounded-md border p-4 shadow-sm "
                placeholder="Type your title"
                {...register('title')}
            />
            <Controller
                name="content"
                control={control}
                render={({ field: { value, onChange } }) => (
                    <EditorContentInput value={value} onChange={onChange} />
                )}
            />
            <Button isLoading={isLoading}>Update post</Button>
        </form>
    );
};

export default UpdatePostForm;
