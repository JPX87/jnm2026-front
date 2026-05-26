export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';

export async function POST(request: Request) {
    try {
        const { password } = await request.json();

        if (!password || password.length < 6) {
            return NextResponse.json(
                { error: 'Le mot de passe doit contenir au moins 6 caractères' },
                { status: 400 },
            );
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        return NextResponse.json({
            message: 'Mot de passe haché avec succès',
            hashedPassword,
        });
    } catch {
        return NextResponse.json(
            { error: 'Erreur lors du hachage' },
            { status: 500 },
        );
    }
}
