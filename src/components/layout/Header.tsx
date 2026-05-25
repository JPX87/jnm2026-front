'use client';
import { apiFetch } from '@/lib/clientFetch';

import { MobileNav } from './MobileNav';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export function Header({ title, isAdmin = false }: { title: string; isAdmin?: boolean }) {
    const [unreadCount, setUnreadCount] = useState(0);
    const router = useRouter();

    const handleLogout = async () => {
        await apiFetch('/api/auth/logout', { method: 'POST' });
        router.push('/login');
    };

    useEffect(() => {
        const fetchCount = async () => {
            try {
                const res = await apiFetch('/api/messages/unread-count');
                const data = await res.json();
                setUnreadCount(data.count ?? 0);
            } catch {
                // silently fail
            }
        };

        fetchCount();
        const interval = setInterval(fetchCount, 30000);
        return () => clearInterval(interval);
    }, []);

    return (
        <header className="w-full glass-effect border-b border-[#ff89b8]/30 flex items-center justify-between py-3 px-4 sm:py-4 sm:px-6 md:py-5 md:px-10 animate-fade-in gap-3">
            <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                <MobileNav isAdmin={isAdmin} />
                <div className="hidden sm:block w-2 h-8 sm:h-10 bg-gradient-to-b from-[#ff89b8] to-[#ef6a9f] rounded-full flex-shrink-0"></div>
                <h1 className="text-[#ef6a9f] font-bold text-2xl sm:text-3xl md:text-4xl tracking-tight truncate">
                    {title}
                </h1>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                <Link
                    href="/app/notifications"
                    className="relative flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/10 hover:bg-white/20 text-[#ef6a9f] transition-all duration-300 hover:scale-105"
                    title="Notifications"
                >
                    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    {unreadCount > 0 && (
                        <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-gradient-to-br from-[#ff89b8] to-[#ef6a9f] text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 shadow-lg">
                            {unreadCount > 99 ? '99+' : unreadCount}
                        </span>
                    )}
                </Link>

                <button onClick={handleLogout} className="group flex items-center gap-2 bg-gradient-to-r from-[#ff89b8] to-[#ef6a9f] text-white px-4 py-2 sm:px-5 sm:py-2.5 md:px-6 md:py-3 rounded-full font-medium shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                    <svg
                        className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:-translate-x-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                    </svg>
                    <span className="hidden sm:inline">Se déconnecter</span>
                </button>
            </div>
        </header>
    );
}
