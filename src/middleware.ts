import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const token = request.cookies.get('token')?.value;

    const isAdminRoute = pathname.startsWith('/admin') || pathname.startsWith('/api/admin');
    const isProtectedRoute = isAdminRoute || pathname.startsWith('/lodging') || pathname.startsWith('/profile') || pathname.startsWith('/notifications');

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
        return NextResponse.redirect(new URL('/profile', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*', '/api/admin/:path*', '/lodging/:path*', '/profile/:path*', '/lodging', '/profile', '/notifications'],
};
