export const dynamic = 'force-dynamic';

import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import * as XLSX from 'xlsx';

type UpdateResult = {
    updated: number;
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

        const result: UpdateResult = { updated: 0, errors: [] };

        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            const rowNum = i + 2;

            const email = String(row['email'] ?? '').trim();
            if (!email) {
                result.errors.push({ row: rowNum, email: '—', reason: 'Email manquant' });
                continue;
            }

            const user = await prisma.user.findUnique({ where: { email } });
            if (!user) {
                result.errors.push({ row: rowNum, email, reason: 'Utilisateur introuvable' });
                continue;
            }

            // Only update fields that are explicitly provided (non-empty string)
            const data: Record<string, string> = {};
            const fields: { col: string; key: string }[] = [
                { col: 'hotelRoom',  key: 'hotelRoom' },
                { col: 'hotelFloor', key: 'hotelFloor' },
                { col: 'doorCode',   key: 'doorCode' },
                { col: 'firstname',  key: 'firstname' },
                { col: 'lastname',   key: 'lastname' },
                { col: 'miage',      key: 'miage' },
                { col: 'ville',      key: 'ville' },
            ];

            for (const { col, key } of fields) {
                const val = String(row[col] ?? '').trim();
                if (val !== '') data[key] = val;
            }

            if (Object.keys(data).length === 0) {
                result.errors.push({ row: rowNum, email, reason: 'Aucune donnée à mettre à jour' });
                continue;
            }

            try {
                await prisma.user.update({ where: { email }, data });
                result.updated++;
            } catch {
                result.errors.push({ row: rowNum, email, reason: 'Erreur lors de la mise à jour' });
            }
        }

        return NextResponse.json(result);
    } catch (error) {
        console.error('Erreur update Excel:', error);
        return NextResponse.json({ error: 'Erreur lors du traitement du fichier' }, { status: 500 });
    }
}
