'use client';

import { FC, useEffect } from 'react';
import Output from 'editorjs-react-renderer';
import { useCopyToClipboard } from '@/hooks/user-copy';

interface EditorContentOutputProps {
    data: any;
}

const EditorContentOutput: FC<EditorContentOutputProps> = ({ data }) => {
    const [_, copy] = useCopyToClipboard();

    useEffect(() => {
        if (typeof document === 'undefined') return;
        const pres = document.querySelectorAll('pre');
        pres.forEach((pre) => {
            const codeBlock = pre.querySelector('code');
            pre.className = 'relative';
            const div = document.createElement('div');
            div.className =
                'absolute top-2 right-2 bg-zinc-100 rounded-sm px-4 py-1 text-black cursor-pointer hover:bg-zinc-50 transition-all';
            div.innerText = 'Copy';
            div.addEventListener('click', (e) => {
                e.preventDefault();
                const text = (codeBlock?.innerText ?? '').replace(
                    /\u00A0/g,
                    ''
                );
                copy(text);
                div.innerText = 'Copied';
            });

            pre.appendChild(div);
        });
        return () => {
            pres.forEach((pre) => {
                pre.remove();
            });
        };
    }, []);

    return (
        <article className="prose prose-img:my-4 max-w-full overflow-hidden prose-pre:overflow-auto">
            <Output data={data} />
        </article>
    );
};

export default EditorContentOutput;
