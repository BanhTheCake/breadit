'use client';

import { FC, useCallback, useRef, useState } from 'react';
import {
    Command,
    CommandGroup,
    CommandItem,
    CommandList,
} from '@/components/ui/Command';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Subreddit } from '@prisma/client';
import debounce from 'lodash.debounce';
import SearchInput from './SearchInput';
import { Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useOnClickOutside } from '@/hooks/use-on-click-outside';

interface SearchBarProps {}

const SearchBar: FC<SearchBarProps> = ({}) => {
    const [q, setQ] = useState('');
    const router = useRouter();
    const ref = useRef<HTMLDivElement>(null);
    useOnClickOutside(ref, () => {
        setQ('');
    });

    const { data, isFetched } = useQuery({
        queryKey: ['search-query', q],
        queryFn: async () => {
            const res = await axios({
                method: 'get',
                url: '/api/search',
                params: {
                    q: q,
                },
            });
            return res.data as (Subreddit & {
                _count: {
                    subscriptions: number;
                };
            })[];
        },
        enabled: !!q,
    });

    const debounceSearch = useCallback(
        debounce((e: string) => {
            setQ(e);
        }, 500),
        []
    );

    return (
        <Command
            className="rounded-lg border shadow-sm max-w-[400px] relative overflow-visible"
            ref={ref}
        >
            <SearchInput debounceSearch={debounceSearch} q={q} />
            {q.length > 0 && isFetched && data && (
                <CommandList className="absolute top-[110%] left-0 right-0 z-40 border bg-white rounded-lg">
                    {data.length > 0 ? (
                        <CommandGroup heading="Communities">
                            {data.map((item) => {
                                return (
                                    <CommandItem
                                        key={item.id}
                                        value={item.name}
                                        onSelect={(e) => {
                                            router.push(`/r/${e}`);
                                            setQ('');
                                        }}
                                        className="cursor-pointer"
                                    >
                                        <Users className="mr-2 h-4 w-4" />
                                        <span>
                                            {item.name} (
                                            {item._count.subscriptions})
                                        </span>
                                    </CommandItem>
                                );
                            })}
                        </CommandGroup>
                    ) : null}
                    {data.length === 0 && (
                        <div className="p-4 text-zinc-500 text-center">
                            No results found.
                        </div>
                    )}
                </CommandList>
            )}
        </Command>
    );
};

export default SearchBar;
