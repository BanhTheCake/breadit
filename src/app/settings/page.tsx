import UsernameForm from '@/components/UsernameForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Username - Settings',
    description: 'Change your profile.',
};

const SettingsPage = () => {
    return (
        <div className="bg-white rounded-md shadow-sm p-4 ">
            <h1 className="text-2xl font-semibold">Change username</h1>
            <div className="h-[1px] bg-zinc-600 my-4 w-full" />
            <div className="flex flex-col gap-2">
                <h2 className="text-2xl font-semibold">Name</h2>
                <p className="text-zinc-800 mb-2">
                    Username including capitalization cannot be changed.
                </p>
                <UsernameForm />
            </div>
        </div>
    );
};

export default SettingsPage;
