import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const actId = parseInt(id);
        if (isNaN(actId)) return NextResponse.json({ error: 'ID invalide' }, { status: 400 });

        const body = await req.json();
        const updateData: Record<string, unknown> = {};
        if (body.title !== undefined) updateData.title = body.title.trim();
        if (body.description !== undefined) updateData.description = body.description?.trim() || null;
        if (body.maxSeats !== undefined) updateData.maxSeats = body.maxSeats != null && body.maxSeats !== '' ? Number(body.maxSeats) : null;
        if (body.order !== undefined) updateData.order = Number(body.order) || 0;
        if (body.speakers !== undefined) {
            updateData.speakers = {
                deleteMany: {},
                create: body.speakers
                    .filter((s: { name: string }) => s.name?.trim())
                    .map((s: { name: string; role?: string; company?: string; linkedinUrl?: string }) => ({
                        name: s.name.trim(),
                        role: s.role?.trim() || null,
                        company: s.company?.trim() || null,
                        linkedinUrl: s.linkedinUrl?.trim() || null,
                    })),
            };
        }

        const activity = await prisma.activity.update({
            where: { id: actId },
            data: updateData,
            include: { speakers: true },
        });
        return NextResponse.json({ activity });
    } catch (error) {
        console.error('Erreur PUT items/[id]:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const actId = parseInt(id);
        if (isNaN(actId)) return NextResponse.json({ error: 'ID invalide' }, { status: 400 });
        await prisma.activity.delete({ where: { id: actId } });
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Erreur DELETE items/[id]:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}
