import { z } from 'zod';

export const avatarValidator = z.object({
    avatar: z.string().url({ message: 'avatar must be valid url' }),
});

export type AvatarRequest = z.infer<typeof avatarValidator>;
