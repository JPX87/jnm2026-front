export const dynamic = 'force-dynamic';

import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(req: Request, { params }: { params: Promise<{ groupId: string }> }) {
    try {
        const { groupId } = await params;
        const gId = parseInt(groupId);
        if (isNaN(gId)) return NextResponse.json({ error: 'ID invalide' }, { status: 400 });

        const body = await req.json();
        const { title, description, maxSeats, order, speakers } = body;
        if (!title?.trim()) return NextResponse.json({ error: 'Titre requis' }, { status: 400 });

        const activity = await prisma.activity.create({
            data: {
                title: title.trim(),
                description: description?.trim() || null,
                maxSeats: maxSeats != null && maxSeats !== '' ? Number(maxSeats) : null,
                order: Number(order) || 0,
                groupId: gId,
                speakers: {
                    create: (speakers ?? [])
                        .filter((s: { name: string }) => s.name?.trim())
                        .map((s: { name: string; role?: string; company?: string; linkedinUrl?: string }) => ({
                            name: s.name.trim(),
                            role: s.role?.trim() || null,
                            company: s.company?.trim() || null,
                            linkedinUrl: s.linkedinUrl?.trim() || null,
                        })),
                },
            },
            include: { speakers: true },
        });
        return NextResponse.json({ activity });
    } catch (error) {
        console.error('Erreur POST items:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}
