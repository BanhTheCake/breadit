import FeedAccountPost from '@/components/FeedAccountPost';
import FeedAnonymousPost from '@/components/FeedAnonymousPost';
import { buttonVariants } from '@/components/ui/Button';
import { getAuthSession } from '@/lib/auth';
import { Home } from 'lucide-react';
import Link from 'next/link';

export default async function HomePage() {
    const session = await getAuthSession();

    return (
        <div>
            <h3 className="text-2xl font-semibold mb-6">Your Feed</h3>
            <div className="grid sm:grid-cols-3 grid-cols-1">
                <div className="col-span-2 order-2 sm:order-1 sm:mr-4">
                    {session ? <FeedAccountPost /> : <FeedAnonymousPost />}
                </div>
                <div className="col-span-1 order-1 mb-4 sm:mb-0">
                    <div className="border rounded-md w-full shadow-sm">
                        <div className="bg-emerald-100 p-6 flex items-center w-full font-semibold">
                            <Home className="h-5 mr-2" />
                            <p>Home</p>
                        </div>
                        <div className="p-6 flex flex-col">
                            <p className="text-zinc-700 mb-8">
                                Your personal Breadit homepage. Come here to
                                check in with your favorite communities.
                            </p>
                            <Link
                                className={buttonVariants()}
                                href={'/r/create'}
                            >
                                Create Community
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
