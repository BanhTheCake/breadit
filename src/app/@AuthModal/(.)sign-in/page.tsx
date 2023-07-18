'use client';
import SignIn from '@/components/SignIn';
import { Button } from '@/components/ui/Button';
import { X } from 'lucide-react';
import { useRouter } from 'next/navigation';

const SignInModal = ({}) => {
    const router = useRouter();
    const onCloseModal = () => {
        return router.back();
    };

    return (
        <div className="fixed inset-0 z-30 flex items-center justify-center">
            <div
                onClick={onCloseModal}
                className="absolute inset-0 bg-black/20"
            />
            <div className="bg-zinc-50 border rounded-md p-10 relative animate-in fade-in duration-200">
                <Button
                    className="absolute top-2 right-2"
                    onClick={onCloseModal}
                    variant={'ghost'}
                >
                    <X />
                </Button>
                <SignIn />
            </div>
        </div>
    );
};

export default SignInModal;
