import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyToken } from '@/lib/auth';

export default async function AppIndexPage() {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    const payload = token ? await verifyToken(token) : null;

    if (!payload) {
        redirect('/login');
    }

    redirect('/app/profile');
}
