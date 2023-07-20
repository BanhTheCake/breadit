import { buttonVariants } from '@/components/ui/Button';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import SignIn from '@/components/SignIn';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Sign In',
    description: 'Sign in to your account.',
};

const SignInPage = ({}) => {
    return (
        <div>
            <div className="fixed top-0 bottom-0 left-0 right-0 z-10 flex justify-center items-center">
                <SignIn />
            </div>
            <Link
                href={'/'}
                className={buttonVariants({
                    variant: 'subtle',
                    className: 'font-semibold relative z-10',
                })}
            >
                <ChevronLeft className="mr-1 h-5" />
                Home
            </Link>
        </div>
    );
};

export default SignInPage;
