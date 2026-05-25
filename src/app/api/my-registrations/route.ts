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
        if (!payload) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });

        const registrations = await prisma.activityRegistration.findMany({
            where: { userId: payload.userId },
            include: {
                activity: {
                    include: {
                        speakers: true,
                        group: { select: { id: true, title: true, maxPerUser: true } },
                    },
                },
            },
            orderBy: { createdAt: 'asc' },
        });

        return NextResponse.json({ registrations: registrations.map(r => ({
            registeredAt: r.createdAt,
            activityId: r.activityId,
            activityTitle: r.activity.title,
            activityDescription: r.activity.description,
            speakers: r.activity.speakers,
            groupId: r.activity.group.id,
            groupTitle: r.activity.group.title,
            maxPerUser: r.activity.group.maxPerUser,
        })) });
    } catch (error) {
        console.error('Erreur GET /api/my-registrations:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}
