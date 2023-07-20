import Image from 'next/image';
import { FC, useRef, useState } from 'react';
import ReactCrop, { Crop, PixelCrop } from 'react-image-crop';
import { Button } from './ui/Button';
import { OurFileRouter } from '@/app/api/uploadthing/core';
import { useToast } from '@/hooks/use-toast';
import { useMutation } from '@tanstack/react-query';
import { generateReactHelpers } from '@uploadthing/react/hooks';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import 'react-image-crop/dist/ReactCrop.css';

const ASPECT = 1 / 1;

function dataURLtoFile(dataUrl: string, filename: string) {
    let arr = dataUrl.split(',');
    let mime = arr[0].match(/:(.*?);/)?.[1];
    let bstr = atob(arr[1]);
    let n = bstr.length;
    let u8arr = new Uint8Array(n);

    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    let croppedImage = new File([u8arr], filename, { type: mime });
    return croppedImage;
}

function getCroppedImg(image: HTMLImageElement, crop: PixelCrop) {
    return new Promise<File>((resolve, reject) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            return reject('No 2d context');
        }

        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        const pixelRatio = window.devicePixelRatio;

        canvas.width = crop.width * pixelRatio * scaleX;
        canvas.height = crop.height * pixelRatio * scaleY;

        ctx.scale(pixelRatio, pixelRatio);
        ctx.imageSmoothingQuality = 'high';

        ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
        ctx.imageSmoothingQuality = 'high';

        ctx.drawImage(
            image,
            crop.x * scaleX,
            crop.y * scaleY,
            crop.width * scaleX,
            crop.height * scaleY,
            0,
            0,
            crop.width * scaleX,
            crop.height * scaleY
        );

        const reader = new FileReader();
        canvas.toBlob((blob) => {
            if (!blob) return reject('Canvas is empty');
            reader.readAsDataURL(blob);
            reader.onloadend = () => {
                if (!reader.result) return null;
                return resolve(
                    dataURLtoFile(
                        reader.result.toString(),
                        `avatar-${Date.now().toString()}.jpg`
                    )
                );
            };
        });
    });
}

interface ModalImageProps {
    onClose: () => void;
    src: string;
}

const ModalImage: FC<ModalImageProps> = ({ onClose, src }) => {
    const [crop, setCrop] = useState<Crop>();
    const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
    const [isLoading, setIsLoading] = useState(false);
    const imgRef = useRef<HTMLImageElement>(null);

    const router = useRouter();
    const { toast } = useToast();
    const { uploadFiles } = generateReactHelpers<OurFileRouter>();
    const { mutate: handleChangeAvatar } = useMutation({
        mutationFn: async (avatar: string) => {
            const res = await axios({
                method: 'patch',
                url: '/api/user/avatar',
                data: {
                    avatar,
                },
            });
            return res.data;
        },
    });

    const onGuardClose = () => {
        if (isLoading) return;
        onClose();
    };

    const onSaveImage = async () => {
        if (imgRef.current && completedCrop?.width && completedCrop.height) {
            setIsLoading(true);
            const cropFile = await getCroppedImg(imgRef.current, completedCrop);
            const res = await uploadFiles([cropFile], 'imageUploader');
            handleChangeAvatar(res[0].fileUrl, {
                onSettled: () => {
                    setIsLoading(false);
                },
                onSuccess: () => {
                    router.refresh();
                    onGuardClose();
                },
                onError() {
                    toast({
                        title: 'Error',
                        description: 'Please try again later',
                    });
                    onGuardClose();
                },
            });
        }
    };

    return (
        <div className="fixed top-0 bottom-0 left-0 right-0 z-30 flex items-center justify-center ">
            <div
                className="absolute top-0 bottom-0 left-0 right-0 bg-black/20"
                onClick={onGuardClose}
            ></div>
            <div
                className="bg-white overflow-hidden rounded-md w-[700px] max-w-full relative"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-4 bg-black">
                    <ReactCrop
                        crop={crop}
                        onChange={(_, percentCrop) => setCrop(percentCrop)}
                        onComplete={(c) => setCompletedCrop(c)}
                        aspect={ASPECT}
                        className="w-full"
                    >
                        <div className="h-80 aspect-video relative w-full overflow-hidden bg-black">
                            <Image
                                ref={imgRef}
                                src={src}
                                alt="avatar"
                                fill
                                className="object-contain"
                            />
                        </div>
                    </ReactCrop>
                </div>
                <div className="p-4">
                    <Button
                        className="w-full"
                        onClick={onSaveImage}
                        isLoading={isLoading}
                    >
                        Lưu
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ModalImage;
