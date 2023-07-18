import { getAuthSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { usernameValidator } from '@/lib/validation/username';
import { NextResponse } from 'next/server';
import { z } from 'zod';

export async function PATCH(req: Request) {
    try {
        const session = await getAuthSession();
        if (!session?.user) {
            return NextResponse.json('You are not authenticate', {
                status: 404,
            });
        }
        const body = await req.json();
        const { username } = usernameValidator.parse(body);
        await db.user.update({
            where: {
                id: session.user.id,
            },
            data: {
                username,
            },
        });
        return NextResponse.json(username);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json('Params is missing or wrong format.', {
                status: 400,
            });
        }
        return NextResponse.json('Something wrong with server.', {
            status: 500,
        });
    }
}
