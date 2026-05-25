export const dynamic = 'force-dynamic';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import * as XLSX from 'xlsx';

export async function GET() {
    try {
        const groups = await prisma.activityGroup.findMany({
            orderBy: { order: 'asc' },
            include: {
                activities: {
                    orderBy: { order: 'asc' },
                    include: {
                        speakers: true,
                        registrations: {
                            include: {
                                user: { select: { firstname: true, lastname: true, email: true, miage: true, ville: true } },
                            },
                            orderBy: { createdAt: 'asc' },
                        },
                    },
                },
            },
        });

        const wb = XLSX.utils.book_new();

        // Résumé global
        const summaryRows: object[] = [];
        for (const g of groups) {
            for (const a of g.activities) {
                summaryRows.push({
                    'Groupe': g.title,
                    'Activité': a.title,
                    'Places max': a.maxSeats ?? 'Illimité',
                    'Inscrits': a.registrations.length,
                    'Intervenants': a.speakers.map(s => [s.name, s.company].filter(Boolean).join(' · ')).join(' — ') || '',
                    'Statut groupe': g.isOpen ? 'Ouvert' : 'Fermé',
                });
            }
        }
        const summarySheet = XLSX.utils.json_to_sheet(summaryRows.length > 0 ? summaryRows : [{ Info: 'Aucune activité' }]);
        summarySheet['!cols'] = [{ wch: 25 }, { wch: 45 }, { wch: 12 }, { wch: 10 }, { wch: 50 }, { wch: 14 }];
        XLSX.utils.book_append_sheet(wb, summarySheet, 'Résumé');

        // Toutes les inscriptions
        const allRows: object[] = [];
        for (const g of groups) {
            for (const a of g.activities) {
                for (const reg of a.registrations) {
                    allRows.push({
                        'Groupe': g.title,
                        'Activité': a.title,
                        'Prénom': reg.user.firstname ?? '',
                        'Nom': reg.user.lastname ?? '',
                        'Email': reg.user.email,
                        'MIAGE': reg.user.miage ?? '',
                        'Ville': reg.user.ville ?? '',
                        'Inscrit le': new Date(reg.createdAt).toLocaleString('fr-FR'),
                    });
                }
            }
        }
        const allSheet = XLSX.utils.json_to_sheet(allRows.length > 0 ? allRows : [{ Info: 'Aucune inscription' }]);
        allSheet['!cols'] = [{ wch: 25 }, { wch: 45 }, { wch: 15 }, { wch: 15 }, { wch: 30 }, { wch: 12 }, { wch: 12 }, { wch: 20 }];
        XLSX.utils.book_append_sheet(wb, allSheet, 'Toutes les inscriptions');

        // Une feuille par groupe
        for (const g of groups) {
            const rows: object[] = [];
            for (const a of g.activities) {
                for (const reg of a.registrations) {
                    rows.push({
                        'Activité': a.title,
                        'Prénom': reg.user.firstname ?? '',
                        'Nom': reg.user.lastname ?? '',
                        'Email': reg.user.email,
                        'MIAGE': reg.user.miage ?? '',
                        'Inscrit le': new Date(reg.createdAt).toLocaleString('fr-FR'),
                    });
                }
            }
            const sheet = XLSX.utils.json_to_sheet(rows.length > 0 ? rows : [{ Info: 'Aucune inscription' }]);
            sheet['!cols'] = [{ wch: 45 }, { wch: 15 }, { wch: 15 }, { wch: 30 }, { wch: 12 }, { wch: 20 }];
            XLSX.utils.book_append_sheet(wb, sheet, g.title.slice(0, 31));
        }

        const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
        const now = new Date().toISOString().slice(0, 10);
        return new Response(buffer, {
            headers: {
                'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'Content-Disposition': `attachment; filename="activites-${now}.xlsx"`,
                'Cache-Control': 'no-store',
            },
        });
    } catch (error) {
        console.error('Erreur export activités:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}
