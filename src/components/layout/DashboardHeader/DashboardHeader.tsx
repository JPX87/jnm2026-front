'use client';

import { MobileNav } from '@/components/layout/MobileNav/MobileNav';

export function DashboardHeader({ title }: { title: string }) {
    return (
        <header className="w-full dashboard-glass border-b border-[#ff89b8]/30 flex items-center justify-between py-3 px-4 sm:py-4 sm:px-6 md:py-5 md:px-10 dashboard-fade-in gap-3">
            <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                <MobileNav />
                <div className="hidden sm:block w-2 h-8 sm:h-10 bg-gradient-to-b from-[#ff89b8] to-[#ef6a9f] rounded-full flex-shrink-0"></div>
                <h1 className="text-[#ef6a9f] font-bold text-2xl sm:text-3xl md:text-4xl tracking-tight truncate">
                    {title}
                </h1>
            </div>

            <button className="group flex items-center gap-2 bg-gradient-to-r from-[#ff89b8] to-[#ef6a9f] text-white px-4 py-2 sm:px-5 sm:py-2.5 md:px-6 md:py-3 rounded-full font-medium shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex-shrink-0">
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
        </header>
    );
}
