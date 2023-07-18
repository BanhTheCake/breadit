import { Skeleton } from '@/components/ui/Skeleton';
import { LIMIT_PAGINATION } from '@/lib/config';

const DownvotedSettingsLoading = async () => {
    return (
        <div className="flex flex-col gap-4">
            {Array(LIMIT_PAGINATION)
                .fill(0)
                .map((_, i) => {
                    return (
                        <div
                            key={i}
                            className="bg-white rounded-md border shadow-sm relative"
                        >
                            <div className="flex overflow-hidden">
                                <div className="p-2 flex items-start justify-center bg-zinc-200/30">
                                    <Skeleton className="w-[20px] h-full" />
                                </div>
                                <div className="p-2 w-full overflow-hidden flex flex-col gap-2">
                                    <Skeleton className="w-full h-8" />
                                    <Skeleton className="w-full h-8" />
                                    <Skeleton className="w-full h-8" />
                                </div>
                            </div>
                        </div>
                    );
                })}
        </div>
    );
};

export default DownvotedSettingsLoading;
