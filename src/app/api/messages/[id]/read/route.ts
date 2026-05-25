import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const token = request.cookies.get('token')?.value;
        const payload = token ? await verifyToken(token) : null;
        if (!payload) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });

        const { id } = await params;
        const messageId = parseInt(id);

        await prisma.messageRead.upsert({
            where: { userId_messageId: { userId: payload.userId, messageId } },
            create: { userId: payload.userId, messageId },
            update: {},
        });

        return NextResponse.json({ ok: true });
    } catch (error) {
        console.error('Erreur POST /api/messages/[id]/read:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}
