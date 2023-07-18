import z from 'zod';

export const settingPostValidator = z.object({
    page: z.number().positive(),
    limit: z.number().positive(),
    filter: z.enum(['me', 'upvotes', 'downvotes']),
});

export type SettingPostRequest = z.infer<typeof settingPostValidator>;
