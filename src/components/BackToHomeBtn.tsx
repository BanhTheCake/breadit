'use client';

import { useParams, usePathname } from 'next/navigation';
import { FC } from 'react';
import { buttonVariants } from './ui/Button';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

interface BackToHomeBtnProps {}

const BackToHomeBtn: FC<BackToHomeBtnProps> = ({}) => {
    const pathname = usePathname();
    const { subredditName } = useParams();

    const pathnameNotQuery = pathname.split('?')[0];
    const isInSubreddit =
        pathnameNotQuery.split(subredditName).filter(Boolean).length === 1;

    const href = isInSubreddit ? '/' : `/r/${subredditName}`;

    return (
        <Link
            href={href}
            className={buttonVariants({
                className: 'w-fit',
            })}
        >
            <ChevronLeft className="mr-1 h-5" />
            {isInSubreddit ? 'Back to home' : 'Back to community'}
        </Link>
    );
};

export default BackToHomeBtn;
