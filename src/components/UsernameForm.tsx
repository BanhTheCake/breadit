'use client';

import { FC } from 'react';
import { Label } from './ui/Label';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { UsernameRequest, usernameValidator } from '@/lib/validation/username';

interface UsernameFormProps {}

const UsernameForm: FC<UsernameFormProps> = ({}) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<UsernameRequest>({
        resolver: zodResolver(usernameValidator),
        defaultValues: {
            username: '',
        },
    });

    const { toast } = useToast();
    const router = useRouter();

    const { mutate: createSubreddit, isLoading } = useMutation({
        mutationFn: async ({ username }: UsernameRequest) => {
            const data = await axios({
                method: 'patch',
                url: '/api/user/username',
                data: {
                    username,
                },
            });
            return data;
        },
    });

    const onSubmit: SubmitHandler<UsernameRequest> = (data) => {
        createSubreddit(data, {
            onSuccess(data) {
                toast({
                    title: 'Success',
                    description: `Change username ${data.data} success.`,
                    variant: 'default',
                });
                router.push(`/`);
            },
            onError(error) {
                console.log('Error');
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
                        u/
                    </Label>
                    <Input
                        className="pl-8"
                        placeholder="New name..."
                        {...register('username')}
                        spellCheck={false}
                    />
                </div>
                {errors?.username && (
                    <p className="text-red-600 text-sm mt-2">
                        {errors.username.message}
                    </p>
                )}
            </div>
            <Button className="w-full" type="submit" isLoading={isLoading}>
                Change username
            </Button>
        </form>
    );
};

export default UsernameForm;
