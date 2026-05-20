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
    console.log('Paramètres initialisés.');

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
