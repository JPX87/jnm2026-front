import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const settings = await prisma.setting.findMany();
        const map = Object.fromEntries(settings.map(s => [s.key, s.value]));
        return NextResponse.json(map);
    } catch (error) {
        console.error('Erreur GET /api/admin/settings:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const { key, value } = body as { key: string; value: string };

        if (!key || value === undefined) {
            return NextResponse.json({ error: 'key et value requis' }, { status: 400 });
        }

        const setting = await prisma.setting.upsert({
            where: { key },
            update: { value },
            create: { key, value },
        });

        return NextResponse.json(setting);
    } catch (error) {
        console.error('Erreur PUT /api/admin/settings:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}
