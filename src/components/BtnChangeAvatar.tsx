'use client';

import { FC, useState } from 'react';
import { Instagram } from 'lucide-react';
import ModalImage from './ModalImage';
import { Label } from './ui/Label';

interface BtnChangeAvatarProps {}

const BtnChangeAvatar: FC<BtnChangeAvatarProps> = ({}) => {
    const [imgSrc, setImgSrc] = useState('');
    const onToggle = () => {
        setImgSrc('');
    };

    const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const reader = new FileReader();
            reader.addEventListener('load', () =>
                setImgSrc(reader.result?.toString() ?? '')
            );
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    return (
        <>
            <Label
                htmlFor="image"
                className="h-9 w-9 rounded-full bg-white border flex items-center justify-center absolute -bottom-2 -right-2 border-blue-300 group hover:border-blue-500 transition-all"
                onClick={onToggle}
            >
                <Instagram className="h-5 cursor-pointer stroke-blue-300 group-hover:stroke-blue-500 transition-all" />
            </Label>
            <input
                type="file"
                accept="image/*"
                id="image"
                hidden
                onChange={onSelectFile}
            />
            {imgSrc && <ModalImage onClose={onToggle} src={imgSrc} />}
        </>
    );
};

export default BtnChangeAvatar;
