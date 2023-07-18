import ProfileUser from '@/components/ProfileUser';
import SettingsBar from '@/components/SettingsBar';

export default function SettingsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div>
            <SettingsBar />
            <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
                <div className="col-span-5">{children}</div>
                <div className="col-span-2 hidden md:block">
                    <ProfileUser />
                </div>
            </div>
        </div>
    );
}
