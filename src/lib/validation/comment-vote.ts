import { TYPE_VOTE } from '@prisma/client';
import { z } from 'zod';

export const commentVoteValidator = z.object({
    type: z.nativeEnum(TYPE_VOTE),
    commentId: z.string(),
});
