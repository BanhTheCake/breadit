'use client';

import { FC, useEffect, useRef, useState } from 'react';
import { Button, buttonVariants } from './ui/Button';
import Link from 'next/link';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from './ui/Dropdown-menu';
import { usePrevious } from '@/hooks/use-previous';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

interface SettingsBarProps {}
type Item = {
    label: string;
    link: string;
};
const PIVOT_PX = 180;

const initMenu: Item[] = [
    { label: 'Overview', link: '' },
    { label: 'Posts', link: 'posts' },
    { label: 'Upvoted', link: 'upvoted' },
    { label: 'Downvoted', link: 'downvoted' },
];

const SettingsBar: FC<SettingsBarProps> = ({}) => {
    const ref = useRef<HTMLDivElement>(null);
    const inlineRef = useRef<HTMLDivElement>(null);
    const clientWidthPrevRef = useRef<number | null>(null);
    const [menu, setMenu] = useState(initMenu);
    const [optionsMenu, setOptionsMenu] = useState<Item[]>([]);

    const pathname = usePathname();
    const prefix = pathname.split('/');

    useEffect(() => {
        if (!ref.current) return;
        // Detect if user change the screen
        const resizeObserver = new ResizeObserver(() => {
            if (!ref.current || !inlineRef.current) return;
            let { scrollWidth, clientWidth } = ref.current;

            // Detect user stretch the screen (ex: 900px -> 1000px)
            // PIVOT_PX used detect that the space is enough to show button
            if (
                clientWidthPrevRef.current &&
                clientWidthPrevRef.current < clientWidth &&
                inlineRef.current.clientWidth + PIVOT_PX < clientWidth
            ) {
                const times = Math.floor(
                    (clientWidth - inlineRef.current.clientWidth) / PIVOT_PX
                );

                const displayElementCount =
                    times < optionsMenu.length ? times : optionsMenu.length;

                if (displayElementCount === optionsMenu.length) {
                    // If all elements can be displayed, move them to the menu and clear the optionsMenu
                    const reverseArr = [...optionsMenu].reverse();
                    setMenu([...menu, ...reverseArr]);
                    setOptionsMenu([]);
                } else if (displayElementCount !== 0) {
                    // If only some elements can be displayed, move the appropriate elements to the menu and update optionsMenu
                    const indexGetElement =
                        optionsMenu.length - displayElementCount;
                    const eliminatedArr = [
                        ...optionsMenu.slice(indexGetElement),
                    ].reverse();
                    setOptionsMenu([...optionsMenu.slice(0, indexGetElement)]);
                    setMenu([...menu, ...eliminatedArr]);
                }

                // Update scrollWidth and clientWidth after modifying the menus
                scrollWidth = ref.current.scrollWidth;
                clientWidth = ref.current.clientWidth;
            }

            // Detect user shrink  the screen (ex: 900px -> 800px)
            if (scrollWidth > clientWidth && menu.length !== 0) {
                // If the content overflows and there are items in the menu, remove the last item from the menu and add it back to optionsMenu
                let eliminatedItem: Item | undefined = undefined;
                eliminatedItem = menu.at(-1);
                setMenu([...menu.slice(0, -1)]);
                eliminatedItem &&
                    setOptionsMenu([...optionsMenu, eliminatedItem]);
            }

            // Save previous clientWidth
            clientWidthPrevRef.current = clientWidth;
        });
        resizeObserver.observe(ref.current);
        return () => resizeObserver.disconnect(); // clean up
    }, [optionsMenu, menu]);

    return (
        <div
            ref={ref}
            className="flex bg-zinc-50 p-2 rounded-md shadow-sm mb-4 w-full overflow-hidden"
        >
            <div ref={inlineRef} className="flex">
                {menu.map((item) => {
                    let isActive = false;
                    if (item.link === '') {
                        isActive = prefix.length === 2;
                    } else if (item.link) {
                        isActive = prefix.includes(item.link);
                    }
                    return (
                        <Link
                            href={`/settings/${item.link}`}
                            key={item.label}
                            className={buttonVariants({
                                variant: isActive ? 'default' : 'subtle',
                                className: 'mr-2 last:mr-0',
                            })}
                        >
                            {item.label}
                        </Link>
                    );
                })}
            </div>
            {optionsMenu.length !== 0 && (
                <DropdownMenu>
                    <DropdownMenuTrigger
                        className="cursor-pointer outline-none"
                        asChild
                    >
                        <Button variant={'subtle'} className="ml-2">
                            ...
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" sideOffset={10}>
                        {optionsMenu.map((item) => {
                            let isActive = false;
                            if (item.link === '') {
                                isActive = prefix.length === 2;
                            } else if (item.link) {
                                isActive = prefix.includes(item.link);
                            }
                            return (
                                <DropdownMenuItem key={item.label} asChild>
                                    <Link
                                        href={`/settings/${item.link}`}
                                        className={cn({
                                            'text-blue-500': isActive,
                                        })}
                                    >
                                        {item.label}
                                    </Link>
                                </DropdownMenuItem>
                            );
                        })}
                    </DropdownMenuContent>
                </DropdownMenu>
            )}
        </div>
    );
};

export default SettingsBar;
