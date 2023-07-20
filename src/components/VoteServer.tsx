import { FC } from 'react';
import VoteClient from './VoteClient';
import { TYPE_VOTE, Vote } from '@prisma/client';

interface VoteServerProps {
    postId: string;
    userId: string | undefined;
    initCurrentVote?: TYPE_VOTE | undefined;
    initVoteAmt?: number | undefined;
    getData?: ((...params: any[]) => Promise<Vote[]>) | undefined;
}

const VoteServer: FC<VoteServerProps> = async ({
    postId,
    userId,
    initCurrentVote,
    initVoteAmt,
    getData,
}) => {
    let currentVote = undefined;
    let voteAmt = 0;

    if (getData) {
        const votes = await getData();
        voteAmt = votes.reduce((rs, vote) => {
            if (vote.type === 'UP') return rs + 1;
            if (vote.type === 'DOWN') return rs - 1;
            return rs;
        }, 0);
        currentVote = votes.find((vote) => vote.userId === userId)?.type;
    } else if (initCurrentVote && initVoteAmt) {
        voteAmt = initVoteAmt;
        currentVote = initCurrentVote;
    }

    return (
        <>
            <div className="hidden md:block">
                <VoteClient
                    postId={postId}
                    userId={userId}
                    currentVote={currentVote}
                    voteAmt={voteAmt}
                    type="post"
                />
            </div>
            <div className="block md:hidden bg-white rounded-md border shadow-sm p-2 mb-4">
                <VoteClient
                    postId={postId}
                    userId={userId}
                    currentVote={currentVote}
                    voteAmt={voteAmt}
                    type="post"
                    direction="row"
                    size={'sm'}
                />
            </div>
        </>
    );
};

export default VoteServer;
