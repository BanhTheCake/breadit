import { z } from 'zod';

export const subredditDeleteValidator = z.object({
    subredditId: z
        .string()
        .nonempty({ message: 'Subreddit id must be provider.' }),
});

export type SubredditDelete = z.infer<typeof subredditDeleteValidator>;
