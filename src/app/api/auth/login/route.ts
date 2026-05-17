import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { createToken } from '@/lib/auth';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, password } = body;

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return NextResponse.json(
                { error: 'Utilisateur non trouvé' },
                { status: 404 },
            );
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return NextResponse.json(
                { error: 'Identifiants invalides' },
                { status: 401 },
            );
        }

        const response = NextResponse.json(
            {
                message: 'Connexion réussie !',
                user: {
                    id: user.id,
                    email: user.email,
                    firstname: user.firstname,
                    lastname: user.lastname,
                },
            },
            { status: 200 },
        );

        const token = await createToken({
            userId: user.id,
            email: user.email,
            isAdmin: user.isAdmin,
        });

        response.cookies.set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 * 5,
        });

        return response;
    } catch (error) {
        console.error('Erreur lors de la connexion :', JSON.stringify(error));
        return NextResponse.json(
            { error: 'Une erreur est survenue lors de la connexion' },
            { status: 500 },
        );
    }
}
