import { Icons } from './Icon';
import { buttonVariants } from './ui/Button';
import Link from 'next/link';
import { getAuthSession } from '@/lib/auth';
import NavBarUser from './NavBarUser';
import SearchBar from './SearchBar';

const Navbar = async ({}) => {
    const session = await getAuthSession();
    return (
        <div className="bg-zinc-100 border-b shadow-sm flex fixed top-0 left-0 right-0 z-20">
            <div className="w-full flex justify-between py-4 container max-w-7xl m-auto items-center gap-4">
                <Link href={'/'} className="flex gap-4 items-center">
                    <Icons.logo className="h-8" />
                    <p className="prose max-w-prose font-semibold">Breadit</p>
                </Link>
                <SearchBar />
                {session?.user ? (
                    <NavBarUser user={session.user} />
                ) : (
                    <Link
                        href={'/sign-in'}
                        className={buttonVariants({
                            className: 'flex-shrink-0',
                        })}
                    >
                        Sign in
                    </Link>
                )}
            </div>
        </div>
    );
};

export default Navbar;
