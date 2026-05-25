export const dynamic = 'force-dynamic';

import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import LodgingClient from './LodgingClient';

export default async function LogementPage() {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    const payload = token ? await verifyToken(token) : null;

    if (!payload) redirect('/login');

    const user = await prisma.user.findUnique({
        where: { id: payload.userId },
        select: {
            hotelRoom: true,
            hotelFloor: true,
            doorCode: true,
        },
    });

    if (!user) redirect('/login');

    const roommates = user.hotelRoom
        ? await prisma.user.findMany({
              where: {
                  hotelRoom: user.hotelRoom,
                  id: { not: payload.userId },
              },
              select: {
                  firstname: true,
                  lastname: true,
                  miage: true,
                  ville: true,
              },
          })
        : [];

    return (
        <LodgingClient
            hotelFloor={user.hotelFloor ?? null}
            hotelRoom={user.hotelRoom}
            doorCode={user.doorCode ?? null}
            roommates={roommates}
        />
    );
}
