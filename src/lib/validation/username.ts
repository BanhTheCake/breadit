import { z } from 'zod';

export const usernameValidator = z.object({
    username: z.string().min(1).max(128),
});

export type UsernameRequest = z.infer<typeof usernameValidator>;
