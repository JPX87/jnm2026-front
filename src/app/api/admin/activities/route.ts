export const dynamic = 'force-dynamic';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const groups = await prisma.activityGroup.findMany({
            orderBy: { order: 'asc' },
            include: {
                activities: {
                    orderBy: { order: 'asc' },
                    include: {
                        speakers: true,
                        registrations: { select: { userId: true } },
                    },
                },
            },
        });
        const result = groups.map(g => ({
            ...g,
            activities: g.activities.map(a => ({
                ...a,
                registrationCount: a.registrations.length,
                registrations: undefined,
            })),
        }));
        return NextResponse.json({ groups: result });
    } catch (error) {
        console.error('Erreur GET /api/admin/activities:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { title, description, isOpen, maxPerUser, order } = body;
        if (!title?.trim()) return NextResponse.json({ error: 'Titre requis' }, { status: 400 });

        const group = await prisma.activityGroup.create({
            data: {
                title: title.trim(),
                description: description?.trim() || null,
                isOpen: Boolean(isOpen),
                maxPerUser: Number(maxPerUser) || 1,
                order: Number(order) || 0,
            },
        });
        return NextResponse.json({ group });
    } catch (error) {
        console.error('Erreur POST /api/admin/activities:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}
