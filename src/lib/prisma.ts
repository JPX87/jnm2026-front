import 'dotenv/config';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from '@/generated/prisma/client';

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

const createPrismaClient = () => {
    const adapter = new PrismaMariaDb({
        host: process.env.DB_HOST || 'localhost',
        port: Number(process.env.DB_PORT) || 3306,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        connectionLimit: 10,
        idleTimeout: 60000,
        connectTimeout: 10000,
    });

    return new PrismaClient({ adapter });
};

// Toujours sauvegarder le singleton (dev ET production)
if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = createPrismaClient();
}

export const prisma = globalForPrisma.prisma;
