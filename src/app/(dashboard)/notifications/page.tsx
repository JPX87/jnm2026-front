'use client';

import { useState, useEffect, useCallback } from 'react';

type Message = {
    id: number;
    title: string;
    content: string;
    createdAt: string;
    read: boolean;
    readAt: string | null;
};

export default function NotificationsPage() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);
    const [expanded, setExpanded] = useState<number | null>(null);

    const fetchMessages = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/messages');
            const data = await res.json();
            setMessages(Array.isArray(data) ? data : []);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchMessages(); }, [fetchMessages]);

    const markAsRead = useCallback(async (id: number) => {
        await fetch(`/api/messages/${id}/read`, { method: 'POST' });
        setMessages(prev => prev.map(m => m.id === id ? { ...m, read: true } : m));
    }, []);

    const handleExpand = (id: number, read: boolean) => {
        setExpanded(prev => prev === id ? null : id);
        if (!read) markAsRead(id);
    };

    const unreadCount = messages.filter(m => !m.read).length;

    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-0">
            <div className="mb-6 sm:mb-8 flex items-center gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                </div>
                <div>
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold italic text-white drop-shadow-lg">
                        Notifications
                    </h2>
                    {unreadCount > 0 && (
                        <p className="text-white/70 text-sm mt-0.5">
                            {unreadCount} message{unreadCount > 1 ? 's' : ''} non lu{unreadCount > 1 ? 's' : ''}
                        </p>
                    )}
                </div>
            </div>

            <div className="card-shadow glass-effect rounded-2xl sm:rounded-3xl border border-white/30 overflow-hidden animate-fade-in">
                {loading ? (
                    <div className="flex items-center justify-center py-16">
                        <div className="w-8 h-8 border-4 border-[#ff89b8]/30 border-t-[#ef6a9f] rounded-full animate-spin" />
                    </div>
                ) : messages.length === 0 ? (
                    <div className="text-center py-16 text-[#ef6a9f]/50">
                        <svg className="w-12 h-12 mx-auto mb-3 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                        <p>Aucune notification</p>
                    </div>
                ) : (
                    <ul className="divide-y divide-[#ff89b8]/10">
                        {messages.map(msg => (
                            <li key={msg.id}>
                                <button
                                    onClick={() => handleExpand(msg.id, msg.read)}
                                    className="w-full text-left px-5 sm:px-6 py-5 hover:bg-[#ff89b8]/5 transition-colors"
                                >
                                    <div className="flex items-start gap-3">
                                        <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${msg.read ? 'bg-transparent' : 'bg-[#ef6a9f]'}`} />

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between gap-2 mb-1">
                                                <p className={`font-bold truncate ${msg.read ? 'text-[#ef6a9f]/70' : 'text-[#ef6a9f]'}`}>
                                                    {msg.title}
                                                </p>
                                                <div className="flex items-center gap-2 flex-shrink-0">
                                                    {!msg.read && (
                                                        <span className="text-[10px] bg-gradient-to-r from-[#ff89b8] to-[#ef6a9f] text-white font-bold px-2 py-0.5 rounded-full">
                                                            Nouveau
                                                        </span>
                                                    )}
                                                    <svg
                                                        className={`w-4 h-4 text-[#ef6a9f]/40 transition-transform duration-300 ${expanded === msg.id ? 'rotate-180' : ''}`}
                                                        fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                                    >
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                    </svg>
                                                </div>
                                            </div>

                                            <p className="text-[#ef6a9f]/50 text-xs">
                                                {new Date(msg.createdAt).toLocaleDateString('fr-FR', {
                                                    day: 'numeric', month: 'long', year: 'numeric',
                                                    hour: '2-digit', minute: '2-digit',
                                                })}
                                            </p>

                                            {expanded === msg.id && (
                                                <div className="mt-4 pt-4 border-t border-[#ff89b8]/15">
                                                    <p className="text-[#ef6a9f]/80 text-sm leading-relaxed whitespace-pre-line">
                                                        {msg.content}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
