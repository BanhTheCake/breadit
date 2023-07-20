import { FC } from 'react';
import { Icons } from './Icon';
import Link from 'next/link';
import SignInButton from './SignInButton';

interface SignInProps {}

const SignIn: FC<SignInProps> = ({}) => {
    return (
        <div className="flex flex-col justify-center items-center max-w-[350px]">
            <Icons.logo className="h-10 mb-4" />
            <h1 className="font-semibold text-3xl mb-4">Welcome back</h1>
            <p className="text-center mb-4">
                By continuing, you are setting up a Breadit account and agree to
                our User Agreement and Privacy Policy.
            </p>
            <SignInButton />
            <div className="flex items-center mt-4">
                <p className="mr-2">New to Breadit? </p>{' '}
                <Link
                    href={'/'}
                    className="prose hover:underline underline-offset-1 font-semibold"
                >
                    Sign up
                </Link>
            </div>
        </div>
    );
};

export default SignIn;
