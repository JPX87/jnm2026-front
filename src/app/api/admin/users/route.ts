export const dynamic = 'force-dynamic';

import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';

export async function GET() {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                email: true,
                firstname: true,
                lastname: true,
                miage: true,
                ville: true,
                hotelRoom: true,
                hotelFloor: true,
                doorCode: true,
                isAdmin: true,
                createdAt: true,
            },
            orderBy: { createdAt: 'desc' },
        });
        return NextResponse.json(users);
    } catch (error) {
        console.error('Erreur GET /api/admin/users:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, password, firstname, lastname, miage, ville, hotelRoom, hotelFloor, doorCode, isAdmin } = body;

        if (!email || !password) {
            return NextResponse.json({ error: 'Email et mot de passe requis' }, { status: 400 });
        }

        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) {
            return NextResponse.json({ error: 'Cet email est déjà utilisé' }, { status: 409 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                firstname: firstname || null,
                lastname: lastname || null,
                miage: miage || null,
                ville: ville || null,
                hotelRoom: hotelRoom || '',
                hotelFloor: hotelFloor || null,
                doorCode: doorCode || null,
                isAdmin: isAdmin ?? false,
            },
            select: {
                id: true,
                email: true,
                firstname: true,
                lastname: true,
                miage: true,
                ville: true,
                hotelRoom: true,
                hotelFloor: true,
                doorCode: true,
                isAdmin: true,
                createdAt: true,
            },
        });

        return NextResponse.json(user, { status: 201 });
    } catch (error) {
        console.error('Erreur POST /api/admin/users:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}
