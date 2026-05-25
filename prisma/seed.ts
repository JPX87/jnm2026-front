import 'dotenv/config';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from '../src/generated/prisma/client';
import bcrypt from 'bcrypt';

const adapter = new PrismaMariaDb({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    connectionLimit: 1,
});

const prisma = new PrismaClient({ adapter });

async function main() {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
        console.error('ADMIN_EMAIL et ADMIN_PASSWORD doivent être définis dans le .env');
        process.exit(1);
    }

    // Settings
    await prisma.setting.upsert({ where: { key: 'loginEnabled' }, update: {}, create: { key: 'loginEnabled', value: 'true' } });
    await prisma.setting.upsert({ where: { key: 'voteVideoOpen' }, update: {}, create: { key: 'voteVideoOpen', value: 'false' } });
    await prisma.setting.upsert({ where: { key: 'voteRugbyOpen' }, update: {}, create: { key: 'voteRugbyOpen', value: 'false' } });
    await prisma.setting.upsert({ where: { key: 'resultsVideoVisible' }, update: {}, create: { key: 'resultsVideoVisible', value: 'false' } });
    await prisma.setting.upsert({ where: { key: 'resultsRugbyVisible' }, update: {}, create: { key: 'resultsRugbyVisible', value: 'false' } });
    console.log('Paramètres initialisés.');

    // Groupes MIAGE
    const PARIS_NAMES = ['Paris Cité', 'Paris Dauphine', 'Paris Saclay / Evry', 'Paris Saclay / Orsay', 'Paris Sorbonne'];
    const ALL_GROUPS = [
        'Aix-Marseille', 'Amiens', 'Antilles', 'Bordeaux', 'Grenoble',
        'Lille', 'Lyon', 'Mulhouse', 'Nancy', 'Nantes', 'Nice',
        'Paris Cité', 'Paris Dauphine', 'Paris Saclay / Evry', 'Paris Saclay / Orsay',
        'Paris Sorbonne', 'Rennes',
    ];
    for (let i = 0; i < ALL_GROUPS.length; i++) {
        const name = ALL_GROUPS[i];
        await prisma.miageGroup.upsert({
            where: { name },
            update: {},
            create: { name, isParisGroup: PARIS_NAMES.includes(name), active: true, order: i + 1 },
        });
    }
    console.log(`${ALL_GROUPS.length} groupes MIAGE initialisés.`);

    // Admin user
    const existing = await prisma.user.findUnique({ where: { email: adminEmail } });
    if (existing) {
        if (!existing.isAdmin) {
            await prisma.user.update({ where: { email: adminEmail }, data: { isAdmin: true } });
            console.log(`Utilisateur ${adminEmail} promu administrateur.`);
        } else {
            console.log(`L'administrateur ${adminEmail} existe déjà.`);
        }
        return;
    }
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    await prisma.user.create({ data: { email: adminEmail, password: hashedPassword, isAdmin: true, hotelRoom: '' } });
    console.log(`Administrateur créé : ${adminEmail}`);
}

main()
    .catch(e => { console.error(e); process.exit(1); })
    .finally(() => prisma.$disconnect());
