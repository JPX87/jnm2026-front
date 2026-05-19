import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;
        const payload = token ? await verifyToken(token) : null;

        if (!payload) {
            return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
        }

        const { id } = await params;
        const roundTableId = parseInt(id);
        if (isNaN(roundTableId)) {
            return NextResponse.json({ error: 'ID invalide' }, { status: 400 });
        }

        const [table, globalSetting] = await Promise.all([
            prisma.roundTable.findUnique({
                where: { id: roundTableId },
                include: { registrations: { select: { userId: true } } },
            }),
            prisma.setting.findUnique({ where: { key: 'roundTablesOpen' } }),
        ]);

        if (!table) {
            return NextResponse.json({ error: 'Table ronde introuvable' }, { status: 404 });
        }

        const roundTablesOpen = globalSetting?.value === 'true';
        const existing = table.registrations.find(r => r.userId === payload.userId);

        if (existing) {
            // Unregister
            await prisma.roundTableRegistration.delete({
                where: { userId_roundTableId: { userId: payload.userId, roundTableId } },
            });
            return NextResponse.json({ registered: false });
        }

        // Check if registration is open
        if (!roundTablesOpen) {
            return NextResponse.json({ error: 'Les inscriptions sont fermées' }, { status: 403 });
        }
        if (table.maxSeats !== null && table.registrations.length >= table.maxSeats) {
            return NextResponse.json({ error: 'Cette table ronde est complète' }, { status: 403 });
        }

        // Check if user is already registered for another table
        const existingOther = await prisma.roundTableRegistration.findFirst({
            where: { userId: payload.userId, roundTableId: { not: roundTableId } },
        });
        if (existingOther) {
            return NextResponse.json({ error: 'Vous êtes déjà inscrit à une table ronde. Désinscrivez-vous d\'abord.' }, { status: 403 });
        }

        await prisma.roundTableRegistration.create({
            data: { userId: payload.userId, roundTableId },
        });

        return NextResponse.json({ registered: true });
    } catch (error) {
        console.error('Erreur POST /api/roundtables/[id]/register:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}
