import UpdatePostForm from '@/components/UpdatePostForm';
import { getAuthSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { notFound } from 'next/navigation';

interface EditPostProps {
    params: { subredditName: string; postId: string };
}

const EditPost = async ({
    params: { postId, subredditName },
}: EditPostProps) => {
    const session = await getAuthSession();

    if (!session?.user) {
        return notFound();
    }

    const post = await db.post.findFirst({
        where: { id: postId, userId: session.user.id },
    });

    if (!post) {
        return notFound();
    }

    return <UpdatePostForm initPost={post} />;
};

export default EditPost;
