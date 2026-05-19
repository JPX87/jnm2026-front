export const dynamic = 'force-dynamic';

import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
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
            ...t,
            registrationCount: t.registrations.length,
            registrations: undefined,
        }));

        return NextResponse.json({ roundTablesOpen, tables: result });
    } catch (error) {
        console.error('Erreur GET /api/admin/roundtables:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}
