'use client';

import { FC } from 'react';
import { Label } from './ui/Label';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { SubmitHandler, useForm } from 'react-hook-form';
import {
    SubbredditRequest,
    SubbredditValidator,
} from '@/lib/validation/subbreddit-create';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

interface SubbredditFormProps {}

const SubbredditForm: FC<SubbredditFormProps> = ({}) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(SubbredditValidator),
        defaultValues: {
            name: '',
        },
    });

    const { toast } = useToast();
    const router = useRouter();

    const { mutate: createSubreddit, isLoading } = useMutation({
        mutationFn: async ({ name }: SubbredditRequest) => {
            const data = await axios({
                method: 'post',
                url: '/api/r/subreddit/create',
                data: {
                    name,
                },
            });
            return data;
        },
    });

    const onSubmit: SubmitHandler<SubbredditRequest> = (data) => {
        createSubreddit(data, {
            onSuccess(data) {
                toast({
                    title: 'Success',
                    description: `Create subreddit ${data.data} success.`,
                    variant: 'default',
                });
                router.push(`/r/${data.data}`);
            },
            onError(error) {
                if (error instanceof AxiosError) {
                    toast({
                        title: 'Uh on!',
                        description: error.response?.data,
                        variant: 'destructive',
                    });
                    return;
                }
                toast({
                    title: 'Uh on!',
                    description: 'Something wrong with server.',
                    variant: 'destructive',
                });
            },
        });
    };

    return (
        <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4">
                <div className="relative">
                    <Label className="absolute top-0 bottom-0 px-4 flex items-center justify-center text-zinc-600">
                        r/
                    </Label>
                    <Input
                        className="pl-8"
                        placeholder="Name community..."
                        {...register('name')}
                        spellCheck={false}
                    />
                </div>
                {errors?.name && (
                    <p className="text-red-600 text-sm mt-2">
                        {errors.name.message}
                    </p>
                )}
            </div>
            <Button className="w-full" type="submit" isLoading={isLoading}>
                Create community
            </Button>
        </form>
    );
};

export default SubbredditForm;
