import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const userId = parseInt(id);
        const body = await request.json();
        const { email, password, firstname, lastname, miage, ville, hotelRoom, hotelFloor, doorCode, isAdmin, isJury } = body;

        const updateData: Record<string, unknown> = {
            email,
            firstname: firstname || null,
            lastname: lastname || null,
            miage: miage || null,
            ville: ville || null,
            hotelRoom: hotelRoom || '',
            hotelFloor: hotelFloor || null,
            doorCode: doorCode || null,
            isAdmin: isAdmin ?? false,
            isJury: isJury ?? false,
        };

        if (password) {
            updateData.password = await bcrypt.hash(password, 10);
        }

        const user = await prisma.user.update({
            where: { id: userId },
            data: updateData,
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
                isJury: true,
                createdAt: true,
            },
        });

        return NextResponse.json(user);
    } catch (error) {
        console.error('Erreur PUT /api/admin/users/[id]:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const userId = parseInt(id);

        await prisma.user.delete({ where: { id: userId } });

        return NextResponse.json({ message: 'Utilisateur supprimé' });
    } catch (error) {
        console.error('Erreur DELETE /api/admin/users/[id]:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}
