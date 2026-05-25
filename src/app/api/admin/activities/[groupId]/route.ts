import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function PUT(req: Request, { params }: { params: Promise<{ groupId: string }> }) {
    try {
        const { groupId } = await params;
        const id = parseInt(groupId);
        if (isNaN(id)) return NextResponse.json({ error: 'ID invalide' }, { status: 400 });

        const body = await req.json();
        const updateData: Record<string, unknown> = {};
        if (body.title !== undefined) updateData.title = body.title.trim();
        if (body.description !== undefined) updateData.description = body.description?.trim() || null;
        if (body.isOpen !== undefined) updateData.isOpen = Boolean(body.isOpen);
        if (body.maxPerUser !== undefined) updateData.maxPerUser = Number(body.maxPerUser) || 1;
        if (body.order !== undefined) updateData.order = Number(body.order) || 0;

        const group = await prisma.activityGroup.update({ where: { id }, data: updateData });
        return NextResponse.json({ group });
    } catch (error) {
        console.error('Erreur PUT /api/admin/activities/[groupId]:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ groupId: string }> }) {
    try {
        const { groupId } = await params;
        const id = parseInt(groupId);
        if (isNaN(id)) return NextResponse.json({ error: 'ID invalide' }, { status: 400 });
        await prisma.activityGroup.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Erreur DELETE /api/admin/activities/[groupId]:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}
