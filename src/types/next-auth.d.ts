import { User } from 'next-auth';

declare module 'next-auth' {
    interface Session {
        user?:
            | (User & {
                  username?: string | null;
              })
            | null;
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        id: string;
        username?: string | null;
    }
}
