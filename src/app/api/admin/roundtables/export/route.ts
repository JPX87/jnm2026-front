export const dynamic = 'force-dynamic';

import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import * as XLSX from 'xlsx';

export async function GET() {
    try {
        const tables = await prisma.roundTable.findMany({
            orderBy: { order: 'asc' },
            include: {
                speakers: true,
                registrations: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                firstname: true,
                                lastname: true,
                                email: true,
                                miage: true,
                                ville: true,
                            },
                        },
                    },
                    orderBy: { createdAt: 'asc' },
                },
            },
        });

        const wb = XLSX.utils.book_new();

        /* ── Feuille 1 : Résumé par table ── */
        const summaryRows = tables.map(t => ({
            'Table': t.order,
            'Titre': t.title,
            'Intervenants': t.speakers.map(s => [s.name, s.company].filter(Boolean).join(' · ')).join(' — ') || '',
            'Places max': t.maxSeats ?? 'Illimité',
            'Inscrits': t.registrations.length,
            'Places restantes': t.maxSeats !== null ? Math.max(0, t.maxSeats - t.registrations.length) : '—',
        }));
        const summarySheet = XLSX.utils.json_to_sheet(summaryRows);
        summarySheet['!cols'] = [
            { wch: 7 },
            { wch: 40 },
            { wch: 50 },
            { wch: 12 },
            { wch: 10 },
            { wch: 16 },
        ];
        XLSX.utils.book_append_sheet(wb, summarySheet, 'Résumé');

        /* ── Feuille 2 : Toutes les inscriptions ── */
        const allRows: object[] = [];
        for (const t of tables) {
            for (const reg of t.registrations) {
                allRows.push({
                    'Table n°': t.order,
                    'Titre de la table': t.title,
                    'Prénom': reg.user.firstname ?? '',
                    'Nom': reg.user.lastname ?? '',
                    'Email': reg.user.email,
                    'MIAGE': reg.user.miage ?? '',
                    'Ville': reg.user.ville ?? '',
                    'Inscrit le': new Date(reg.createdAt).toLocaleString('fr-FR'),
                });
            }
        }
        const allSheet = XLSX.utils.json_to_sheet(allRows.length > 0 ? allRows : [{ 'Info': 'Aucune inscription pour le moment' }]);
        allSheet['!cols'] = [
            { wch: 10 },
            { wch: 40 },
            { wch: 15 },
            { wch: 15 },
            { wch: 30 },
            { wch: 12 },
            { wch: 12 },
            { wch: 20 },
        ];
        XLSX.utils.book_append_sheet(wb, allSheet, 'Toutes les inscriptions');

        /* ── Une feuille par table ── */
        for (const t of tables) {
            const rows = t.registrations.map(reg => ({
                'Prénom': reg.user.firstname ?? '',
                'Nom': reg.user.lastname ?? '',
                'Email': reg.user.email,
                'MIAGE': reg.user.miage ?? '',
                'Ville': reg.user.ville ?? '',
                'Inscrit le': new Date(reg.createdAt).toLocaleString('fr-FR'),
            }));
            const sheet = XLSX.utils.json_to_sheet(rows.length > 0 ? rows : [{ 'Info': 'Aucune inscription' }]);
            sheet['!cols'] = [{ wch: 15 }, { wch: 15 }, { wch: 30 }, { wch: 12 }, { wch: 12 }, { wch: 20 }];
            // Truncate sheet name to 31 chars (Excel limit)
            const sheetName = `T${t.order} - ${t.title}`.slice(0, 31);
            XLSX.utils.book_append_sheet(wb, sheet, sheetName);
        }

        const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

        const now = new Date().toISOString().slice(0, 10);
        return new Response(buffer, {
            headers: {
                'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'Content-Disposition': `attachment; filename="tables-rondes-${now}.xlsx"`,
                'Cache-Control': 'no-store',
            },
        });
    } catch (error) {
        console.error('Erreur GET /api/admin/roundtables/export:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}
