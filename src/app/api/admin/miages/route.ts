export const dynamic = 'force-dynamic';
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

export async function GET() {
    try {
        if (!await requireAdmin()) return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });

        const groups = await prisma.miageGroup.findMany({ orderBy: { order: 'asc' } });
        return NextResponse.json(groups);
    } catch (error) {
        console.error('GET /api/admin/miages:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        if (!await requireAdmin()) return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });

        const { name, active, activeVideo, activeRugby, order } = await req.json();
        if (!name?.trim()) return NextResponse.json({ error: 'Nom requis' }, { status: 400 });

        const existing = await prisma.miageGroup.findUnique({ where: { name: name.trim() } });
        if (existing) return NextResponse.json({ error: 'Ce groupe existe déjà' }, { status: 409 });

        const maxOrder = await prisma.miageGroup.aggregate({ _max: { order: true } });
        const group = await prisma.miageGroup.create({
            data: {
                name: name.trim(),
                isParisGroup: false,
                active: active ?? true,
                activeVideo: activeVideo ?? true,
                activeRugby: activeRugby ?? true,
                order: order ?? (maxOrder._max.order ?? 0) + 1,
            },
        });
        return NextResponse.json(group, { status: 201 });
    } catch (error) {
        console.error('POST /api/admin/miages:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}
