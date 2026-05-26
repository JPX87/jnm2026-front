export const dynamic = 'force-dynamic';

import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        await prisma.message.delete({ where: { id: parseInt(id) } });
        return NextResponse.json({ message: 'Message supprimé' });
    } catch (error) {
        console.error('Erreur DELETE /api/admin/messages/[id]:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}
