export const dynamic = 'force-dynamic';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';
import * as XLSX from 'xlsx';

export async function GET() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;
        const payload = token ? await verifyToken(token) : null;
        if (!payload?.isAdmin) {
            return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
        }

        const votes = await prisma.vote.findMany({
            include: {
                user: {
                    select: { email: true, firstname: true, lastname: true, miage: true, ville: true },
                },
            },
            orderBy: [{ contest: 'asc' }, { createdAt: 'asc' }],
        });

        const rows = votes.map((v, i) => ({
            '#': i + 1,
            'Concours': v.contest === 'video' ? '🎬 Vidéo' : '🏉 Rugby',
            'Email': v.user.email,
            'Prénom': v.user.firstname ?? '',
            'Nom': v.user.lastname ?? '',
            'MIAGE': v.user.miage ?? '',
            'Jury': v.isJury ? 'Oui' : 'Non',
            '1er choix': v.first,
            '2ème choix': v.second,
            '3ème choix': v.third,
            'Date du vote': new Date(v.createdAt).toLocaleString('fr-FR'),
        }));

        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(rows);

        // Column widths
        ws['!cols'] = [
            { wch: 4 }, { wch: 12 }, { wch: 28 }, { wch: 14 }, { wch: 14 },
            { wch: 20 }, { wch: 6 }, { wch: 22 }, { wch: 22 }, { wch: 22 }, { wch: 18 },
        ];

        XLSX.utils.book_append_sheet(wb, ws, 'Votes');

        // Summary sheet per contest
        for (const contest of ['video', 'rugby'] as const) {
            const contestVotes = votes.filter(v => v.contest === contest);
            const points = new Map<string, { p: number; j: number; votes: number }>();

            for (const vote of contestVotes) {
                for (const [city, pts] of [[vote.first, 3], [vote.second, 2], [vote.third, 1]] as [string, number][]) {
                    const cur = points.get(city) ?? { p: 0, j: 0, votes: 0 };
                    if (vote.isJury) points.set(city, { ...cur, j: cur.j + pts, votes: cur.votes + 1 });
                    else points.set(city, { ...cur, p: cur.p + pts, votes: cur.votes + 1 });
                }
            }

            const totalP = [...points.values()].reduce((s, c) => s + c.p, 0);
            const totalJ = [...points.values()].reduce((s, c) => s + c.j, 0);

            const summaryRows = [...points.entries()]
                .map(([city, pts]) => ({
                    'Ville': city,
                    'Points participants': pts.p,
                    'Points jury': pts.j,
                    'Score participants (/ 50)': totalP > 0 ? +((pts.p / totalP) * 50).toFixed(2) : 0,
                    'Score jury (/ 50)': totalJ > 0 ? +((pts.j / totalJ) * 50).toFixed(2) : 0,
                    'Score final (/ 100)': +(
                        (totalP > 0 ? (pts.p / totalP) * 50 : 0) +
                        (totalJ > 0 ? (pts.j / totalJ) * 50 : 0)
                    ).toFixed(2),
                }))
                .sort((a, b) => b['Score final (/ 100)'] - a['Score final (/ 100)']);

            const wsSummary = XLSX.utils.json_to_sheet(summaryRows);
            wsSummary['!cols'] = [{ wch: 22 }, { wch: 20 }, { wch: 14 }, { wch: 22 }, { wch: 18 }, { wch: 18 }];
            XLSX.utils.book_append_sheet(wb, wsSummary, contest === 'video' ? 'Résultats Vidéo' : 'Résultats Rugby');
        }

        const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
        const date = new Date().toISOString().slice(0, 10);

        return new NextResponse(buffer, {
            headers: {
                'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'Content-Disposition': `attachment; filename="votes-jnm2026-${date}.xlsx"`,
            },
        });
    } catch (error) {
        console.error('GET /api/admin/votes/export:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}
