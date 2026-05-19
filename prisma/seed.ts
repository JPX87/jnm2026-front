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

    await prisma.setting.upsert({
        where: { key: 'loginEnabled' },
        update: {},
        create: { key: 'loginEnabled', value: 'true' },
    });
    await prisma.setting.upsert({
        where: { key: 'roundTablesOpen' },
        update: {},
        create: { key: 'roundTablesOpen', value: 'false' },
    });
    console.log('Paramètres initialisés.');

    const existingTables = await prisma.roundTable.count();
    if (existingTables === 0) {
        const tablesData = [
            {
                order: 1, title: "Influence et travail indépendant", maxSeats: null, description: null,
                speakers: [{ name: "Guillaume MURAT", role: null, company: null, linkedinUrl: "https://www.linkedin.com/in/gmrt/" }],
            },
            {
                order: 2, title: "ERASMUS & VIE", maxSeats: null, description: null,
                speakers: [
                    { name: "Jean GUIRAUD", role: null, company: "EXTIA", linkedinUrl: null },
                    { name: "Ana PALEA", role: null, company: "EXTIA", linkedinUrl: null },
                    { name: "Laetitia PRETET", role: null, company: "EXTIA", linkedinUrl: null },
                    { name: "Luc MANFREDI", role: null, company: "EXTIA", linkedinUrl: null },
                ],
            },
            {
                order: 3, title: "Enseignement et recherche", maxSeats: null, description: "Institut de Recherche en Informatique de Toulouse — irit.fr",
                speakers: [
                    { name: "Rémi SAUREL", role: "Doctorant", company: "IRIT", linkedinUrl: null },
                    { name: "Karen PINEL-SAUVAGNAT", role: "MCF-HDR", company: "IRIT", linkedinUrl: null },
                ],
            },
            {
                order: 4, title: "ESN & Digitalisation des activités", maxSeats: null, description: null,
                speakers: [{ name: "Claire JOLY DE SAILLY", role: "Responsable d'agence", company: "EXTIA", linkedinUrl: null }],
            },
            {
                order: 5, title: "Data & Fonction support dans les grandes entreprises", maxSeats: null, description: "Banque et industrie",
                speakers: [
                    { name: "Loïc BEAUCHAINTS", role: "Développeur", company: "La Banque Postale", linkedinUrl: null },
                    { name: "Bastien ALETRUT", role: null, company: "THALES ALENIA SPACE", linkedinUrl: null },
                ],
            },
            {
                order: 6, title: "Conseil & Services numériques", maxSeats: null, description: null,
                speakers: [
                    { name: "Aude LATRÉ", role: "Campus Manager", company: "CAPGEMINI", linkedinUrl: null },
                    { name: "Juliette LEVY", role: "Software Engineer", company: "CAPGEMINI", linkedinUrl: null },
                ],
            },
            {
                order: 7, title: "Avenir numérique porté par l'IA et évolutions de l'IT", maxSeats: null, description: null,
                speakers: [{ name: "Sofia EL JAHIRI", role: "Talent Acquisition Specialist IT", company: "ATOS", linkedinUrl: null }],
            },
            {
                order: 8, title: "Une même formation MIAGE pour une diversité des parcours RH et des relations clients", maxSeats: 35, description: null,
                speakers: [
                    { name: "Yannick PALMADE", role: null, company: "SOPRA", linkedinUrl: null },
                    { name: "Johanna RIOS-ALFARO", role: null, company: "SOPRA", linkedinUrl: null },
                    { name: "Maryam FORISSIER", role: null, company: "SOPRA", linkedinUrl: null },
                ],
            },
            {
                order: 9, title: "ORANGE", maxSeats: null, description: "Intervenant à confirmer",
                speakers: [],
            },
        ];

        for (const t of tablesData) {
            await prisma.roundTable.create({
                data: {
                    order: t.order, title: t.title, description: t.description,
                    maxSeats: t.maxSeats,
                    speakers: { create: t.speakers },
                },
            });
        }
        console.log('Tables rondes créées.');
    }

    const existing = await prisma.user.findUnique({ where: { email: adminEmail } });

    if (existing) {
        if (!existing.isAdmin) {
            await prisma.user.update({
                where: { email: adminEmail },
                data: { isAdmin: true },
            });
            console.log(`Utilisateur ${adminEmail} promu administrateur.`);
        } else {
            console.log(`L'administrateur ${adminEmail} existe déjà.`);
        }
        return;
    }

    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    await prisma.user.create({
        data: {
            email: adminEmail,
            password: hashedPassword,
            isAdmin: true,
            hotelRoom: '',
        },
    });

    console.log(`Administrateur créé : ${adminEmail}`);
}

main()
    .catch(e => { console.error(e); process.exit(1); })
    .finally(() => prisma.$disconnect());
