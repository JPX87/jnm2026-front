export const dynamic = 'force-dynamic';

import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
    try {
        const token = request.cookies.get('token')?.value;
        const payload = token ? await verifyToken(token) : null;
        if (!payload) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });

        const messages = await prisma.message.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                reads: {
                    where: { userId: payload.userId },
                    select: { readAt: true },
                },
            },
        });

        return NextResponse.json(
            messages.map(m => ({
                id: m.id,
                title: m.title,
                content: m.content,
                createdAt: m.createdAt,
                read: m.reads.length > 0,
                readAt: m.reads[0]?.readAt ?? null,
            })),
        );
    } catch (error) {
        console.error('Erreur GET /api/messages:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}
