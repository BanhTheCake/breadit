import { z } from 'zod';

export const commentCreateValidator = z.object({
    content: z.string().min(3).max(256),
    postId: z.string(),
    replyId: z.string().or(z.null()),
});

export type CommentCreateRequest = z.infer<typeof commentCreateValidator>;
