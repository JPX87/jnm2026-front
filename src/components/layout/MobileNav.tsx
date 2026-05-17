'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';

export function MobileNav() {
    const [isOpen, setIsOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => { setMounted(true); }, []);

    const sidebarContent = (
        <>
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50"
                    style={{ zIndex: 9998 }}
                    onClick={() => setIsOpen(false)}
                />
            )}

            <aside
                className={`fixed top-0 left-0 h-full w-72 bg-white border-r border-[#ff89b8]/20 flex flex-col shadow-2xl transform transition-transform duration-300 ${
                    isOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
                style={{ zIndex: 9999 }}
            >
                <div className="flex items-center justify-between py-6 px-4 border-b border-[#ff89b8]/10">
                    <img src="/assets/logo/logo.png" className="w-32 drop-shadow-lg" alt="Logo" />
                    <button
                        onClick={() => setIsOpen(false)}
                        className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#ff89b8]/10 text-[#ef6a9f]"
                        aria-label="Fermer le menu"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <nav className="flex-1 flex flex-col px-4 py-6 gap-2">
                    {[
                        { href: '/lodging', label: 'Mon logement', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
                        { href: '/profile', label: 'Programme', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
                        { href: '/notifications', label: 'Notifications', icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9' },
                    ].map(({ href, label, icon }) => (
                        <Link
                            key={href}
                            href={href}
                            onClick={() => setIsOpen(false)}
                            className="group flex items-center gap-3 px-4 py-3 rounded-xl text-[#ef6a9f] font-semibold hover:bg-gradient-to-r hover:from-[#ff89b8]/10 hover:to-[#ef6a9f]/10 transition-all duration-300"
                        >
                            <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-[#ff89b8] to-[#ef6a9f] text-white shadow-lg">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
                                </svg>
                            </span>
                            <span>{label}</span>
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t border-[#ff89b8]/10">
                    <div className="flex items-center gap-2 text-sm text-[#ef6a9f]/60">
                        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                        Connecté
                    </div>
                </div>
            </aside>
        </>
    );

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="md:hidden flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-[#ff89b8] to-[#ef6a9f] text-white shadow-lg"
                aria-label="Ouvrir le menu"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </button>

            {mounted && createPortal(sidebarContent, document.body)}
        </>
    );
}
