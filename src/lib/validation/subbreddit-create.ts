import { z } from 'zod';

export const SubbredditValidator = z.object({
    name: z
        .string()
        .min(3, { message: 'Name community must be more than 3 characters.' })
        .max(128, {
            message: 'Name community must has less than 128 characters.',
        }),
});

export type SubbredditRequest = z.infer<typeof SubbredditValidator>;
