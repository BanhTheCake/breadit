import SubredditOwnerBtn from '@/components/SubredditOwnerBtn';
import SubredditUserBtn from '@/components/SubredditUserBtn';
import { Button } from '@/components/ui/Button';
import { getAuthSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { format } from 'date-fns';
import { notFound } from 'next/navigation';
import '@/styles/editor.css';
import BackToHomeBtn from '@/components/BackToHomeBtn';

export default async function SubredditLayout({
    children,
    params: { subredditName },
}: {
    children: React.ReactNode;
    params: { subredditName: string };
}) {
    const session = await getAuthSession();

    const subreddit = await db.subreddit.findFirst({
        where: { name: subredditName },
        include: {
            subscriptions: true,
        },
    });

    if (!subreddit) {
        return notFound();
    }

    const countMembers = await db.subscription.count({
        where: { subredditId: subreddit.id },
    });

    return (
        <div className="flex flex-col gap-4">
            <BackToHomeBtn />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-start">
                <div className="col-span-2">{children}</div>
                <div className="col-span-1 hidden sm:flex flex-col border shadow-sm rounded-md overflow-hidden">
                    <div className="p-4 py-6 flex items-center gap-2 w-full font-semibold bg-zinc-50">
                        <p>About r/{subredditName}</p>
                    </div>
                    <div className="p-4 flex flex-col gap-4 bg-white">
                        <div className="flex justify-between gap-2 border-b pb-4">
                            <p className="text-zinc-600">Created</p>
                            <p>
                                {format(
                                    new Date(subreddit.createdAt),
                                    'MMM dd, yyyy'
                                )}
                            </p>
                        </div>
                        <div className="flex justify-between gap-2 border-b pb-4">
                            <p className="text-zinc-600">Members</p>
                            <p>{countMembers}</p>
                        </div>
                        {session?.user &&
                        session.user.id === subreddit.creatorId ? (
                            <SubredditOwnerBtn subreddit={subreddit} />
                        ) : (
                            <SubredditUserBtn
                                subreddit={subreddit}
                                session={session}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
