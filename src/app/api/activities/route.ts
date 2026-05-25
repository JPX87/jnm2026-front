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
            id: g.id,
            title: g.title,
            description: g.description,
            isOpen: g.isOpen,
            maxPerUser: g.maxPerUser,
            order: g.order,
            activities: g.activities.map(a => {
                const isRegistered = payload ? a.registrations.some(r => r.userId === payload.userId) : false;
                const registrationCount = a.registrations.length;
                const isFull = a.maxSeats !== null && registrationCount >= a.maxSeats;
                return {
                    id: a.id,
                    title: a.title,
                    description: a.description,
                    maxSeats: a.maxSeats,
                    order: a.order,
                    speakers: a.speakers,
                    registrationCount,
                    isRegistered,
                    isFull,
                };
            }),
            // nb d'inscriptions de l'utilisateur dans ce groupe
            userRegistrationCount: payload
                ? g.activities.reduce((sum, a) => sum + (a.registrations.some(r => r.userId === payload.userId) ? 1 : 0), 0)
                : 0,
        }));

        return NextResponse.json({ groups: result });
    } catch (error) {
        console.error('Erreur GET /api/activities:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}
