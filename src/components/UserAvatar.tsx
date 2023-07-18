import React, { FC } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/Avatar';

interface UserAvatarProps {
    image: string | undefined;
    name: string | undefined;
}

const UserAvatar: FC<UserAvatarProps> = React.forwardRef<
    HTMLSpanElement,
    UserAvatarProps
>(({ image, name }, ref) => {
    return (
        <Avatar ref={ref}>
            <AvatarImage src={image} />
            <AvatarFallback>{name?.charAt(0)}</AvatarFallback>
        </Avatar>
    );
});

UserAvatar.displayName = 'UserAvatar';

export default UserAvatar;
