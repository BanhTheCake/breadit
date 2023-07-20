'use client';

import { FC } from 'react';
import { Button } from './ui/Button';
import { Icons } from './Icon';
import { signIn } from 'next-auth/react';

interface SignInButtonProps {}

const SignInButton: FC<SignInButtonProps> = ({}) => {
    const onLogin = async () => {
        signIn('google', {
            callbackUrl: '/',
        });
    };

    const onLoginGithub = () => {
        signIn('github', {
            callbackUrl: '/',
        });
    };

    return (
        <>
            <Button className="w-full flex" size={'lg'} onClick={onLogin}>
                <Icons.google className="h-6 mr-2" />
                Sign in with Google
            </Button>
            {/* <Button
                className="w-full flex gap-2"
                size={'lg'}
                onClick={onLoginGithub}
            >
                <Icons.google className="h-6" />
                Sign in with Github
            </Button> */}
        </>
    );
};

export default SignInButton;
