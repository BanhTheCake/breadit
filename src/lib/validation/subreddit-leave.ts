import { z } from 'zod';

export const subredditLeaveValidator = z.object({
    subredditId: z.string().nonempty(),
});

export type SubredditLeaveRequest = z.infer<typeof subredditLeaveValidator>;
