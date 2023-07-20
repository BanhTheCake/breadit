import SubbredditForm from '@/components/SubbredditForm';
import { buttonVariants } from '@/components/ui/Button';
import { ChevronLeft } from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Create community',
    description: 'Create your own community.',
};

const SubbreddditCreatePage = () => {
    return (
        <div>
            <Link
                href={'/'}
                className={buttonVariants({
                    variant: 'subtle',
                    className: 'mb-6',
                })}
            >
                <ChevronLeft className="mr-1 h-5 flex" />
                Back to home
            </Link>
            <div className="bg-white rounded-md shadow-sm p-4 max-w-3xl mx-auto ">
                <h1 className="text-2xl font-semibold">Create a community</h1>
                <div className="h-[1px] bg-zinc-600 my-4 w-full" />
                <div className="flex flex-col">
                    <h2 className="text-2xl font-semibold mb-2">Name</h2>
                    <p className="text-zinc-800 text-zinc-800">
                        Community name including capitalization cannot be
                        changed.
                    </p>
                    <SubbredditForm />
                </div>
            </div>
        </div>
    );
};

export default SubbreddditCreatePage;
