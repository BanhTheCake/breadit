import { getAuthSession } from '@/lib/auth';
import { createUploadthing, type FileRouter } from 'uploadthing/next';

const f = createUploadthing();

export const ourFileRouter = {
    imageUploader: f({ image: { maxFileSize: '4MB', maxFileCount: 1 } })
        .middleware(async (req) => {
            const session = await getAuthSession();
            if (!session?.user) {
                throw new Error('Unauthorized');
            }
            return { session };
        })
        .onUploadComplete(async ({ metadata, file }) => {}),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
