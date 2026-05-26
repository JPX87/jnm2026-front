export const dynamic = 'force-dynamic';

import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;
        const payload = token ? await verifyToken(token) : null;
        if (!payload) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });

        const { id } = await params;
        const activityId = parseInt(id);
        if (isNaN(activityId)) return NextResponse.json({ error: 'ID invalide' }, { status: 400 });

        const activity = await prisma.activity.findUnique({
            where: { id: activityId },
            include: {
                group: true,
                registrations: { select: { userId: true } },
            },
        });
        if (!activity) return NextResponse.json({ error: 'Activité introuvable' }, { status: 404 });

        const isRegisteredHere = activity.registrations.some(r => r.userId === payload.userId);

        // Désinscription toujours possible
        if (isRegisteredHere) {
            await prisma.activityRegistration.delete({
                where: { userId_activityId: { userId: payload.userId, activityId } },
            });
            return NextResponse.json({ registered: false });
        }

        // Vérifications pour inscription
        if (!activity.group.isOpen) return NextResponse.json({ error: 'Les inscriptions sont fermées' }, { status: 403 });
        if (activity.maxSeats !== null && activity.registrations.length >= activity.maxSeats) {
            return NextResponse.json({ error: 'Cette activité est complète' }, { status: 403 });
        }

        // Vérifier la limite maxPerUser dans ce groupe
        if (activity.group.maxPerUser > 0) {
            const userCountInGroup = await prisma.activityRegistration.count({
                where: {
                    userId: payload.userId,
                    activity: { groupId: activity.groupId },
                },
            });
            if (userCountInGroup >= activity.group.maxPerUser) {
                return NextResponse.json({
                    error: `Vous ne pouvez vous inscrire qu'à ${activity.group.maxPerUser} activité(s) dans ce groupe.`,
                }, { status: 403 });
            }
        }

        await prisma.activityRegistration.create({ data: { userId: payload.userId, activityId } });
        return NextResponse.json({ registered: true });
    } catch (error) {
        console.error('Erreur POST /api/activities/[id]/register:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}
