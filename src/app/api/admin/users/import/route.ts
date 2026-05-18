import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import * as XLSX from 'xlsx';

type ImportResult = {
    success: number;
    errors: { row: number; email: string; reason: string }[];
};

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File | null;

        if (!file) {
            return NextResponse.json({ error: 'Fichier manquant' }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const wb = XLSX.read(buffer, { type: 'buffer' });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json<Record<string, string>>(ws, { defval: '' });

        const result: ImportResult = { success: 0, errors: [] };

        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            const rowNum = i + 2;

            const email = String(row['email'] ?? '').trim();
            const password = String(row['password'] ?? '').trim();

            if (!email) {
                result.errors.push({ row: rowNum, email: '—', reason: 'Email manquant' });
                continue;
            }
            if (!password) {
                result.errors.push({ row: rowNum, email, reason: 'Mot de passe manquant' });
                continue;
            }

            const isAdminRaw = String(row['isAdmin'] ?? '').trim().toUpperCase();
            const isAdmin = isAdminRaw === 'TRUE' || isAdminRaw === '1' || isAdminRaw === 'OUI';

            try {
                const existing = await prisma.user.findUnique({ where: { email } });
                if (existing) {
                    result.errors.push({ row: rowNum, email, reason: 'Email déjà utilisé' });
                    continue;
                }

                const hashedPassword = await bcrypt.hash(password, 10);

                await prisma.user.create({
                    data: {
                        email,
                        password: hashedPassword,
                        firstname: String(row['firstname'] ?? '').trim() || null,
                        lastname: String(row['lastname'] ?? '').trim() || null,
                        miage: String(row['miage'] ?? '').trim() || null,
                        ville: String(row['ville'] ?? '').trim() || null,
                        hotelRoom: String(row['hotelRoom'] ?? '').trim(),
                        hotelFloor: String(row['hotelFloor'] ?? '').trim() || null,
                        doorCode: String(row['doorCode'] ?? '').trim() || null,
                        isAdmin,
                    },
                });

                result.success++;
            } catch {
                result.errors.push({ row: rowNum, email, reason: 'Erreur lors de la création' });
            }
        }

        return NextResponse.json(result);
    } catch (error) {
        console.error('Erreur import Excel:', error);
        return NextResponse.json({ error: 'Erreur lors du traitement du fichier' }, { status: 500 });
    }
}
