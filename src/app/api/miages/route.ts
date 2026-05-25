export const dynamic = 'force-dynamic';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const contest = searchParams.get('contest');

        const where =
            contest === 'video' ? { active: true, activeVideo: true } :
            contest === 'rugby' ? { active: true, activeRugby: true } :
            { active: true };

        const groups = await prisma.miageGroup.findMany({
            where,
            orderBy: { order: 'asc' },
            select: { id: true, name: true },
        });
        return NextResponse.json({ groups });
    } catch (error) {
        console.error('GET /api/miages:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}
