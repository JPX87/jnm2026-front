export const dynamic = 'force-dynamic';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const groups = await prisma.miageGroup.findMany({
            where: { active: true },
            orderBy: { order: 'asc' },
            select: { id: true, name: true },
        });
        return NextResponse.json({ groups });
    } catch (error) {
        console.error('GET /api/miages:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}
