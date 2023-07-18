import { z } from 'zod';

export const subredditJoinValidator = z.object({
    subredditId: z.string().nonempty(),
});

export type SubredditJoinRequest = z.infer<typeof subredditJoinValidator>;
