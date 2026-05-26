export const dynamic = 'force-dynamic';

import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { sendWelcomeEmail } from '@/lib/mail';

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const { password } = await request.json();

        if (!password) {
            return NextResponse.json({ error: 'Mot de passe requis' }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { id: Number(id) },
            select: { id: true, email: true, firstname: true },
        });

        if (!user) {
            return NextResponse.json({ error: 'Utilisateur introuvable' }, { status: 404 });
        }

        await sendWelcomeEmail({ to: user.email, firstname: user.firstname, password });

        return NextResponse.json({ ok: true });
    } catch (error) {
        console.error('Erreur send-welcome:', error);
        return NextResponse.json({ error: "Erreur lors de l'envoi" }, { status: 500 });
    }
}
