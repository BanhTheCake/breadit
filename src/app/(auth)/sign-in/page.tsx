import { buttonVariants } from '@/components/ui/Button';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import SignIn from '@/components/SignIn';

const SignInPage = ({}) => {
    return (
        <div>
            <div className="fixed inset-0 z-10 flex justify-center items-center">
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
