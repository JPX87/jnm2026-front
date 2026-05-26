export const dynamic = 'force-dynamic';

import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { sendWelcomeEmail } from '@/lib/mail';
import bcrypt from 'bcrypt';

function generatePassword(length = 5): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // sans 0/O/1/I pour éviter confusion
    let pwd = '';
    for (let i = 0; i < length; i++) {
        pwd += chars[Math.floor(Math.random() * chars.length)];
    }
    return pwd;
}

export async function POST(
    _request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const user = await prisma.user.findUnique({
            where: { id: Number(id) },
            select: { id: true, email: true, firstname: true },
        });

        if (!user) {
            return NextResponse.json({ error: 'Utilisateur introuvable' }, { status: 404 });
        }

        const newPassword = generatePassword(5);
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await prisma.user.update({
            where: { id: Number(id) },
            data: { password: hashedPassword },
        });

        await sendWelcomeEmail({ to: user.email, firstname: user.firstname, password: newPassword });

        return NextResponse.json({ ok: true, password: newPassword });
    } catch (error) {
        console.error('Erreur resend-welcome:', error);
        return NextResponse.json({ error: "Erreur lors de l'envoi" }, { status: 500 });
    }
}
