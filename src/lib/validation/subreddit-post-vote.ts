import { TYPE_VOTE } from '@prisma/client';
import { z } from 'zod';

export const subredditPostVoteValidator = z.object({
    type: z.nativeEnum(TYPE_VOTE),
    postId: z.string(),
});
