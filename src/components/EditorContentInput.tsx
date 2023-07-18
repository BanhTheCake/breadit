'use client';

import type { OurFileRouter } from '@/app/api/uploadthing/core';
import { useIsMounted } from '@/hooks/use-is-mounted';
import Code from '@editorjs/code';
import EditorJs from '@editorjs/editorjs';
import Embed from '@editorjs/embed';
import Header from '@editorjs/header';
import ImageTool from '@editorjs/image';
import InlineCode from '@editorjs/inline-code';
import LinkTool from '@editorjs/link';
import List from '@editorjs/list';
import Paragraph from '@editorjs/paragraph';
import Table from '@editorjs/table';
import { generateReactHelpers } from '@uploadthing/react/hooks';
import { FC, useCallback, useEffect, useRef, useState } from 'react';
import CodeBox from '@bomdi/codebox';

interface EditorContentInputProps {
    value: any;
    onChange: (...event: any[]) => void;
}

const EditorContentInput: FC<EditorContentInputProps> = ({
    value,
    onChange,
}) => {
    const { uploadFiles } = generateReactHelpers<OurFileRouter>();

    const editorRef = useRef<EditorJs>();
    const isMounted = useIsMounted();
    const [isInit, setIsInit] = useState(false);

    const initiationEditor = useCallback(async () => {
        if (!editorRef.current) {
            const editor = new EditorJs({
                holder: 'holder',
                minHeight: 300,
                tools: {
                    embed: Embed,
                    table: Table,
                    // code: Code,
                    codeBox: {
                        class: CodeBox,
                        config: {
                            themeURL:
                                'https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@9.18.1/build/styles/dracula.min.css',
                            themeName: 'atom-one-dark',
                        },
                    },
                    header: {
                        // @ts-ignore
                        class: Header,
                        inlineToolbar: true,
                    },
                    list: List,
                    inlineCode: InlineCode,
                    linkTool: {
                        class: LinkTool,
                        config: {
                            endpoint: '/api/link',
                        },
                    },
                    paragraph: {
                        class: Paragraph,
                    },
                    image: {
                        class: ImageTool,
                        config: {
                            uploader: {
                                uploadByFile(file: File) {
                                    return uploadFiles(
                                        [file],
                                        'imageUploader'
                                    ).then((res) => {
                                        const url = res[0].fileUrl;
                                        return {
                                            success: 1,
                                            file: {
                                                url,
                                            },
                                        };
                                    });
                                },
                            },
                        },
                    },
                },
                placeholder: 'Type here to write your post...',
                inlineToolbar: true,
                onReady() {
                    editorRef.current = editor;
                    setIsInit(true);
                },
                onChange: async (api) => {
                    onChange(await api.saver.save());
                },
                data: value,
            });
        }
    }, []);

    useEffect(() => {
        if (isMounted()) {
            initiationEditor();
        }
        return () => {
            editorRef.current?.destroy();
            editorRef.current = undefined;
        };
    }, [initiationEditor, isMounted]);

    useEffect(() => {
        const assignValueEditor = async () => {
            if (!editorRef.current || !isInit) return;
            const dataEditor = await editorRef.current.save();
            if (!value?.blocks) {
                // reset value to null from react hook form
                // delete editor already exist
                editorRef.current.destroy();
                editorRef.current = undefined;
                // create new one
                initiationEditor();
                return;
            }
            if (
                JSON.stringify(value.blocks) ===
                JSON.stringify(dataEditor.blocks)
            )
                return;
            // reset value to value in api from react hook form
            editorRef.current.render(value);
        };
        assignValueEditor();
    }, [value, initiationEditor, isInit]);

    return (
        <article className="prose prose-img:my-4 max-w-full bg-zinc-50 rounded-md border p-4 shadow-sm ">
            <div className="min-h-[200px]" id="holder"></div>
        </article>
    );
};

export default EditorContentInput;
