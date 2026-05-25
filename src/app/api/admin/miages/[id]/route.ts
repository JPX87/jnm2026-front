import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';

async function requireAdmin() {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    const payload = token ? await verifyToken(token) : null;
    if (!payload?.isAdmin) return null;
    return payload;
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        if (!await requireAdmin()) return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });

        const { id } = await params;
        const { name, active, order } = await req.json();
        if (!name?.trim()) return NextResponse.json({ error: 'Nom requis' }, { status: 400 });

        const group = await prisma.miageGroup.update({
            where: { id: parseInt(id) },
            data: { name: name.trim(), active, order },
        });
        return NextResponse.json(group);
    } catch (error) {
        console.error('PUT /api/admin/miages/[id]:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        if (!await requireAdmin()) return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });

        const { id } = await params;
        await prisma.miageGroup.delete({ where: { id: parseInt(id) } });
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('DELETE /api/admin/miages/[id]:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}
