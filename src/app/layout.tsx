import Navbar from '@/components/Navbar';
import { Providers } from '@/components/Providers';
import { Toaster } from '@/components/ui/Toaster';
import { cn } from '@/lib/utils';
import '@/styles/globals.css';
import { Inter } from 'next/font/google';
import NextTopLoader from 'nextjs-toploader';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

export const metadata = {
    title: 'Breadit',
    description: 'A Reddit clone built with Next.js and TypeScript.',
};

export default function RootLayout({
    children,
    AuthModal,
}: {
    children: React.ReactNode;
    AuthModal: React.ReactNode;
}) {
    return (
        <html lang="en" className="overflow-y-scroll">
            <body
                className={cn(
                    'flex w-full min-h-screen bg-zinc-100',
                    inter.className
                )}
            >
                <NextTopLoader showSpinner={false} height={2} />
                <Providers>
                    <Navbar />
                    {AuthModal}
                    <div className="container max-w-7xl mx-auto pt-24 pb-8">
                        {children}
                    </div>
                    <Toaster />
                </Providers>
            </body>
        </html>
    );
}
