import { db } from './db';
import { getServerSession, type AuthOptions } from 'next-auth';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import GoogleProviders, { GoogleProfile } from 'next-auth/providers/google';
import GitHubProviders, { GithubProfile } from 'next-auth/providers/github';
import { nanoid } from 'nanoid';

const getGoogleVar = () => {
    const clientId = process.env.CLIENT_ID;
    const clientSecret = process.env.CLIENT_SECRET;
    if (!clientId) {
        throw new Error('No Google Client Id Provider.');
    }
    if (!clientSecret) {
        throw new Error('No Google Client Secret Provider.');
    }
    return {
        clientId: clientId,
        clientSecret: clientSecret,
    };
};

const authOptions: AuthOptions = {
    providers: [
        GoogleProviders({
            clientId: getGoogleVar().clientId,
            clientSecret: getGoogleVar().clientSecret,
            profile(profile: GoogleProfile) {
                return {
                    id: profile.sub,
                    name: profile.name,
                    email: profile.email,
                    image: profile.picture,
                };
            },
            allowDangerousEmailAccountLinking: true,
        }),
        GitHubProviders({
            profile(profile: GithubProfile) {
                return {
                    id: profile.id.toString(),
                    name: profile.name ?? profile.login,
                    email: profile.email,
                    image: profile.avatar_url,
                };
            },
            clientId: process.env.GITHUB_ID as string,
            clientSecret: process.env.GITHUB_SECRET as string,
            allowDangerousEmailAccountLinking: true,
        }),
    ],
    adapter: PrismaAdapter(db),
    callbacks: {
        session({ token, session }) {
            if (token && session.user) {
                session.user.email = token.email;
                session.user.id = token.id;
                session.user.image = token.picture;
                session.user.username = token.username;
                session.user.name = token.name;
            }
            return session;
        },
        async jwt({ token, user }) {
            // this user came from prisma database (prisma created user then return user for jwt)
            const existUser = await db.user.findFirst({
                where: { email: token.email },
            });
            if (!existUser) {
                token.id = user.id;
                return token;
            }
            if (!existUser.username) {
                await db.user.update({
                    where: { id: existUser.id },
                    data: { username: nanoid(10) },
                });
            }
            return {
                id: existUser.id,
                email: existUser.email,
                name: existUser.name,
                picture: existUser.image,
                username: existUser.username,
            };
        },
    },
    session: {
        strategy: 'jwt',
    },
    pages: {
        signIn: '/sign-in',
    },
};

export const getAuthSession = () => getServerSession(authOptions);

export default authOptions;
