import { Post, Subreddit, User, Vote } from '@prisma/client';

export interface PostPagination {
    data: (Post & {
        User: User;
        votes: Vote[];
        Subreddit: Subreddit;
        _count: {
            comment: number;
        };
    })[];
    hasNextPage: boolean;
    nextPage: number | undefined;
}

export interface PostLitePagination {
    data: {
        id: string;
        title: string;
        createdAt: Date;
        updatedAt: Date;
        votes: Vote[];
        Subreddit: Subreddit;
        userId: string;
        _count: {
            comment: number;
        };
    }[];
    hasNextPage: boolean;
    nextPage: number | undefined;
}
