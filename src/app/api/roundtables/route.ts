export const dynamic = 'force-dynamic';

import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function GET() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;
        const payload = token ? await verifyToken(token) : null;

        const [tables, globalSetting] = await Promise.all([
            prisma.roundTable.findMany({
                orderBy: { order: 'asc' },
                include: {
                    speakers: true,
                    registrations: { select: { userId: true } },
                },
            }),
            prisma.setting.findUnique({ where: { key: 'roundTablesOpen' } }),
        ]);

        const roundTablesOpen = globalSetting?.value === 'true';

        const result = tables.map(t => ({
            id: t.id,
            title: t.title,
            description: t.description,
            maxSeats: t.maxSeats,
            order: t.order,
            speakers: t.speakers,
            registrationCount: t.registrations.length,
            isRegistered: payload ? t.registrations.some(r => r.userId === payload.userId) : false,
            isFull: t.maxSeats !== null && t.registrations.length >= t.maxSeats,
        }));

        return NextResponse.json({ roundTablesOpen, tables: result });
    } catch (error) {
        console.error('Erreur GET /api/roundtables:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}
