'use client';

import { Session } from 'next-auth';
import { FC } from 'react';
import UserAvatar from './UserAvatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from './ui/Dropdown-menu';
import Link from 'next/link';
import { signOut } from 'next-auth/react';

interface NavBarUserProps {
    user: Session['user'];
}

const NavBarUser: FC<NavBarUserProps> = ({ user }) => {
    return (
        <div>
            <DropdownMenu>
                <DropdownMenuTrigger className="cursor-pointer outline-none">
                    <UserAvatar
                        image={user?.image ?? undefined}
                        name={user?.name ?? undefined}
                    />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" sideOffset={10}>
                    <div className="p-2">
                        <h3 className="capitalize font-semibold">
                            {user?.name || 'noname'}
                        </h3>
                        <p className="text-zinc-600 text-sm">{user?.email}</p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                        <Link className="cursor-pointer" href={'/'}>
                            Feed
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link className="cursor-pointer" href={'/r/create'}>
                            Create communities
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link className="cursor-pointer" href={'/settings'}>
                            Settings
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        className="cursor-pointer"
                        onSelect={(e) => {
                            e.preventDefault();
                            signOut({
                                callbackUrl: '/sign-in',
                            });
                        }}
                    >
                        Sign out
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};

export default NavBarUser;
