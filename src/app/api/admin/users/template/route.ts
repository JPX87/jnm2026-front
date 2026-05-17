import { NextResponse } from 'next/server';
import * as XLSX from 'xlsx';

export async function GET() {
    const wb = XLSX.utils.book_new();

    const headers = [
        'email', 'password', 'firstname', 'lastname',
        'miage', 'ville', 'hotelRoom', 'hotelFloor', 'isAdmin',
    ];

    const examples = [
        ['alice@toulouse.miage.fr', 'motdepasse123', 'Alice', 'Martin', 'M2 MIAGE', 'Toulouse', '101', '1', 'FALSE'],
        ['bob@toulouse.miage.fr', 'motdepasse456', 'Bob', 'Dupont', 'M1 MIAGE', 'Paris', '102', '1', 'FALSE'],
        ['admin@jnm.fr', 'adminpass', 'Admin', 'JNM', '', '', '', '', 'TRUE'],
    ];

    const ws = XLSX.utils.aoa_to_sheet([headers, ...examples]);

    ws['!cols'] = [
        { wch: 30 }, { wch: 18 }, { wch: 14 }, { wch: 14 },
        { wch: 14 }, { wch: 14 }, { wch: 12 }, { wch: 8 }, { wch: 9 },
    ];

    XLSX.utils.book_append_sheet(wb, ws, 'Utilisateurs');

    const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

    return new NextResponse(buffer, {
        headers: {
            'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Disposition': 'attachment; filename="template_utilisateurs.xlsx"',
        },
    });
}
