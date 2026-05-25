export const dynamic = 'force-dynamic';

import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { sendMailToAll, buildEmailHtml } from '@/lib/mail';

export async function GET() {
    try {
        const messages = await prisma.message.findMany({
            orderBy: { createdAt: 'desc' },
            include: { _count: { select: { reads: true } } },
        });
        return NextResponse.json(messages);
    } catch (error) {
        console.error('Erreur GET /api/admin/messages:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const { title, content } = await request.json();

        if (!title?.trim() || !content?.trim()) {
            return NextResponse.json({ error: 'Titre et contenu requis' }, { status: 400 });
        }

        const message = await prisma.message.create({
            data: { title: title.trim(), content: content.trim() },
        });

        prisma.user.findMany({ select: { email: true } }).then(async (users) => {
            const emails = users.map(u => u.email);
            const html = buildEmailHtml({
                title,
                body: `<p style="margin:0 0 20px;font-size:15px;color:#666;line-height:1.8;white-space:pre-line;">${content.replace(/\n/g, '<br>')}</p>`,
            });
            await sendMailToAll(emails, `JNM 2026 — ${title}`, html);
        }).catch(console.error);

        return NextResponse.json(message, { status: 201 });
    } catch (error) {
        console.error('Erreur POST /api/admin/messages:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}
