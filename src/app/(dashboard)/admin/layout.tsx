'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    const tabs = [
        {
            href: '/admin',
            label: 'Utilisateurs',
            icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
            ),
        },
        {
            href: '/admin/messages',
            label: 'Messages',
            icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
            ),
        },
    ];

    return (
        <div>
            <div className="flex gap-2 mb-6 p-1 glass-effect border border-white/20 rounded-2xl w-fit">
                {tabs.map(tab => {
                    const active = pathname === tab.href;
                    return (
                        <Link
                            key={tab.href}
                            href={tab.href}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 ${
                                active
                                    ? 'bg-gradient-to-r from-[#ff89b8] to-[#ef6a9f] text-white shadow-lg'
                                    : 'text-[#ef6a9f]/70 hover:text-[#ef6a9f] hover:bg-white/10'
                            }`}
                        >
                            {tab.icon}
                            {tab.label}
                        </Link>
                    );
                })}
            </div>

            {children}
        </div>
    );
}
