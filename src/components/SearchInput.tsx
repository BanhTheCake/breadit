import { FC, useEffect, useState } from 'react';
import { CommandInput } from './ui/Command';

interface SearchInputProps {
    debounceSearch: (e: string) => void;
    q: string;
}

const SearchInput: FC<SearchInputProps> = ({ debounceSearch, q }) => {
    const [input, setInput] = useState('');

    useEffect(() => {
        setInput((prev) => {
            if (prev === q) return prev;
            return q;
        });
    }, [q]);

    return (
        <CommandInput
            className="border-none text-base"
            placeholder="Type a name community..."
            value={input}
            onValueChange={(e) => {
                setInput(e);
                debounceSearch(e);
            }}
        />
    );
};

export default SearchInput;
