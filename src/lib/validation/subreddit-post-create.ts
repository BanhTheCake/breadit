import { z } from 'zod';

export const subredditPostCreateValidator = z.object({
    subredditId: z
        .string()
        .nonempty({ message: 'Subreddit id must be provider.' }),
    title: z
        .string()
        .min(3, { message: 'Title must has more than 3 characters.' })
        .max(128, { message: 'Title must has less than 128 characters.' }),
    content: z.any(),
});

export type SubredditPostCreateRequest = z.infer<
    typeof subredditPostCreateValidator
>;
