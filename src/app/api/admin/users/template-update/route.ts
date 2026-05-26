export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import * as XLSX from 'xlsx';

export async function GET() {
    const wb = XLSX.utils.book_new();

    const headers = ['email', 'hotelRoom', 'hotelFloor', 'doorCode', 'firstname', 'lastname', 'miage', 'ville'];

    const examples = [
        ['alice@toulouse.miage.fr', '101', '1', 'A1B2', '', '', '', ''],
        ['bob@toulouse.miage.fr', '102', '1', 'C3D4', '', '', '', ''],
    ];

    const ws = XLSX.utils.aoa_to_sheet([headers, ...examples]);

    ws['!cols'] = [
        { wch: 30 }, { wch: 12 }, { wch: 10 }, { wch: 12 },
        { wch: 14 }, { wch: 14 }, { wch: 14 }, { wch: 14 },
    ];

    // Header row styling
    const headerStyle = {
        font: { bold: true, color: { rgb: 'FFFFFF' } },
        fill: { fgColor: { rgb: 'EF6A9F' } },
        alignment: { horizontal: 'center' },
    };
    headers.forEach((_, col) => {
        const cell = XLSX.utils.encode_cell({ r: 0, c: col });
        if (ws[cell]) ws[cell].s = headerStyle;
    });

    XLSX.utils.book_append_sheet(wb, ws, 'Mise à jour');

    const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

    return new NextResponse(buffer, {
        headers: {
            'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Disposition': 'attachment; filename="template_mise_a_jour.xlsx"',
        },
    });
}
