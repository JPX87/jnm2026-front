import { SignJWT, jwtVerify } from 'jose';

const secret = new TextEncoder().encode(
    process.env.JWT_SECRET || 'valeur_par_defaut_tres_longue_et_securisee',
);

export async function createToken(payload: Record<string, unknown>) {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('5d')
        .sign(secret);
}

export async function verifyToken(token: string): Promise<{ userId: number; email: string; isAdmin: boolean } | null> {
    try {
        const { payload } = await jwtVerify(token, secret);
        return {
            userId: payload.userId as number,
            email: payload.email as string,
            isAdmin: (payload.isAdmin as boolean) ?? false,
        };
    } catch {
        return null;
    }
}
