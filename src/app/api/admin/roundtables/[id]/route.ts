import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const roundTableId = parseInt(id);
        if (isNaN(roundTableId)) {
            return NextResponse.json({ error: 'ID invalide' }, { status: 400 });
        }

        const body = await request.json();
        const { maxSeats } = body;

        const table = await prisma.roundTable.update({
            where: { id: roundTableId },
            data: {
                ...(maxSeats !== undefined && { maxSeats: maxSeats === '' || maxSeats === null ? null : Number(maxSeats) }),
            },
            include: { speakers: true },
        });

        return NextResponse.json(table);
    } catch (error) {
        console.error('Erreur PUT /api/admin/roundtables/[id]:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}
