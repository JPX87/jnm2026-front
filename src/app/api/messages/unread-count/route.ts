import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
    try {
        const token = request.cookies.get('token')?.value;
        const payload = token ? await verifyToken(token) : null;
        if (!payload) return NextResponse.json({ count: 0 });

        const totalMessages = await prisma.message.count();
        const readMessages = await prisma.messageRead.count({
            where: { userId: payload.userId },
        });

        return NextResponse.json({ count: Math.max(0, totalMessages - readMessages) });
    } catch {
        return NextResponse.json({ count: 0 });
    }
}
