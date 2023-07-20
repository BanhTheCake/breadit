import CreatePostForm from '@/components/CreatePostForm';
import { db } from '@/lib/db';
import { notFound } from 'next/navigation';

interface CreatePostProps {
    params: {
        subredditName: string;
    };
}

export async function generateMetadata({ params }: CreatePostProps) {
    return {
        title: `r/${params.subredditName} - Create Post`,
        description: `Create new post in r/${params.subredditName}`,
    };
}

const CreatePostPage = async ({
    params: { subredditName },
}: CreatePostProps) => {
    const subreddit = await db.subreddit.findFirst({
        where: { name: subredditName },
    });

    if (!subreddit) return notFound();

    return (
        <div>
            <div className="w-fit">
                <div className="flex items-end">
                    <h2 className="text-2xl font-semibold mr-2">Create Post</h2>
                    <p className="text-zinc-600">in r/{subredditName}</p>
                </div>
                <div className="h-[1px] w-full mt-3 mb-6 bg-zinc-300" />
            </div>
            <CreatePostForm subreddit={subreddit} />
        </div>
    );
};

export default CreatePostPage;
