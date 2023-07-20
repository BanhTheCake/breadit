import { Skeleton } from '@/components/ui/Skeleton';
import { LIMIT_PAGINATION } from '@/lib/config';

const PostsSettingsLoading = async () => {
    return (
        <div className="flex flex-col">
            {Array(LIMIT_PAGINATION)
                .fill(0)
                .map((_, i) => {
                    return (
                        <div
                            key={i}
                            className="bg-white rounded-md border shadow-sm relative mb-4 last:mb-0"
                        >
                            <div className="flex overflow-hidden">
                                <div className="p-2 flex items-start justify-center bg-zinc-200/30">
                                    <Skeleton className="w-[20px] h-full" />
                                </div>
                                <div className="p-2 w-full overflow-hidden flex flex-col">
                                    <Skeleton className="w-full h-8 mb-2" />
                                    <Skeleton className="w-full h-8 mb-2" />
                                    <Skeleton className="w-full h-8" />
                                </div>
                            </div>
                        </div>
                    );
                })}
        </div>
    );
};

export default PostsSettingsLoading;
