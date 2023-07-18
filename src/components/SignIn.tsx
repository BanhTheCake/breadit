import { FC } from 'react';
import { Icons } from './Icon';
import Link from 'next/link';
import SignInButton from './SignInButton';

interface SignInProps {}

const SignIn: FC<SignInProps> = ({}) => {
    return (
        <div className="flex flex-col justify-center items-center gap-4 max-w-[350px]">
            <Icons.logo className="h-10" />
            <h1 className="font-semibold text-3xl ">Welcome back</h1>
            <p className="text-center">
                By continuing, you are setting up a Breadit account and agree to
                our User Agreement and Privacy Policy.
            </p>
            <SignInButton />
            <div className="flex items-center gap-2">
                <p>New to Breadit? </p>{' '}
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
