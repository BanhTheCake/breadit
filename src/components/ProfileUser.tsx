import { getAuthSession } from '@/lib/auth';
import { Banana, StickyNote } from 'lucide-react';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { FC } from 'react';
import { Button, buttonVariants } from './ui/Button';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { db } from '@/lib/db';
import BtnChangeAvatar from './BtnChangeAvatar';

interface ProfileUserProps {}

const ProfileUser: FC<ProfileUserProps> = async ({}) => {
    const session = await getAuthSession();
    if (!session?.user) return notFound();

    const joinedCommunitiesCnt = await db.subscription.count({
        where: {
            userId: session.user.id,
        },
    });

    const postsCnt = await db.post.count({
        where: {
            userId: session.user.id,
        },
    });

    return (
        <div className="w-full rounded-md shadow-sm overflow-hidden">
            <div className="h-24 bg-blue-500 p-3 flex">
                <div className="border-2 border-white rounded-md relative w-20 h-20 mt-5">
                    <Image
                        src={session.user?.image ?? ''}
                        alt={session.user?.name ?? ''}
                        fill
                        className="object-cover rounded-sm"
                    />
                    <BtnChangeAvatar />
                </div>
            </div>
            <div className="p-3 pt-6 flex flex-col bg-white">
                <p className="text-zinc-700 text-sm">
                    u/{session.user.username}
                </p>
                <div className="flex my-2">
                    <div className="flex-1 flex flex-col items-start mr-2">
                        <p className="text-sm mb-1">Communities</p>
                        <div className="flex items-center">
                            <Banana className="h-4 -ml-1 mr-2" />
                            <span className="text-xs">
                                {joinedCommunitiesCnt}
                            </span>
                        </div>
                    </div>
                    <div className="flex-1 flex flex-col items-start">
                        <p className="text-sm mb-1">Posts</p>
                        <div className="flex items-center">
                            <StickyNote className="h-4 -ml-1 mr-2" />
                            <span className="text-xs">{postsCnt}</span>
                        </div>
                    </div>
                </div>
                <Link
                    href={'/r/create'}
                    className={buttonVariants({
                        className: 'w-full !rounded-full my-1 text-xs',
                        size: 'xs',
                    })}
                >
                    Create Community
                </Link>
            </div>
        </div>
    );
};

export default ProfileUser;
