export const dynamic = 'force-dynamic';

import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { sendMailToAll } from '@/lib/mail';

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
            const html = `
                <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px">
                    <div style="background:linear-gradient(135deg,#ff89b8,#ef6a9f);border-radius:16px;padding:24px;margin-bottom:24px">
                        <h1 style="color:white;margin:0;font-size:24px">JNM — Nouveau message</h1>
                    </div>
                    <h2 style="color:#ef6a9f;font-size:20px">${title}</h2>
                    <p style="color:#555;line-height:1.6;font-size:16px;white-space:pre-line">${content}</p>
                    <hr style="border:none;border-top:1px solid #f0c0d8;margin:24px 0"/>
                    <p style="color:#aaa;font-size:12px">Journées Nationales des Musiciens — Ne pas répondre à cet email</p>
                </div>
            `;
            await sendMailToAll(emails, `JNM — ${title}`, html);
        }).catch(console.error);

        return NextResponse.json(message, { status: 201 });
    } catch (error) {
        console.error('Erreur POST /api/admin/messages:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}
