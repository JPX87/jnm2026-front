import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const token = request.cookies.get('token')?.value;

    const isAdminRoute = pathname.startsWith('/app/admin') || pathname.startsWith('/api/admin');
    const isProtectedRoute = isAdminRoute
        || pathname.startsWith('/app/lodging')
        || pathname.startsWith('/app/profile')
        || pathname.startsWith('/app/notifications')
        || pathname.startsWith('/app/programme')
        || pathname.startsWith('/app/inscriptions');

    if (!isProtectedRoute) return NextResponse.next();

    if (!token) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    const payload = await verifyToken(token);

    if (!payload) {
        const response = NextResponse.redirect(new URL('/login', request.url));
        response.cookies.delete('token');
        return response;
    }

    if (isAdminRoute && !payload.isAdmin) {
        return NextResponse.redirect(new URL('/app/lodging', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/app/:path*', '/api/admin/:path*'],
};
