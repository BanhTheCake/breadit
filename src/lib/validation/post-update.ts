import { z } from 'zod';

export const postUpdateValidator = z.object({
    title: z
        .string()
        .min(3, { message: 'Title must has more than 3 characters.' })
        .max(128, { message: 'Title must has less than 128 characters.' }),
    content: z.any(),
    id: z.string().nonempty(),
});

export type PostUpdateRequest = z.infer<typeof postUpdateValidator>;
