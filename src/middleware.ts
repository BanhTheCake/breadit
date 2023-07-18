export { default } from 'next-auth/middleware';

export const config = {
    matcher: [
        '/r/create',
        '/r/:subredditName/post/edit/:postId*',
        '/settings/(.*)',
        '/settings',
    ],
};
