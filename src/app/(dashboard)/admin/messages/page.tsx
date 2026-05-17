'use client';

import { useState, useEffect, useCallback } from 'react';

type Message = {
    id: number;
    title: string;
    content: string;
    createdAt: string;
    _count: { reads: number };
};

export default function AdminMessagesPage() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [sending, setSending] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

    const fetchMessages = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/messages');
            const data = await res.json();
            setMessages(Array.isArray(data) ? data : []);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchMessages(); }, [fetchMessages]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        setSending(true);
        setError('');
        setSuccess('');

        try {
            const res = await fetch('/api/admin/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, content }),
            });

            if (!res.ok) {
                const data = await res.json();
                setError(data.error || 'Erreur lors de l\'envoi');
                return;
            }

            setTitle('');
            setContent('');
            setSuccess('Message envoyé à tous les utilisateurs !');
            await fetchMessages();
            setTimeout(() => setSuccess(''), 4000);
        } catch {
            setError('Erreur réseau');
        } finally {
            setSending(false);
        }
    };

    const handleDelete = async (id: number) => {
        await fetch(`/api/admin/messages/${id}`, { method: 'DELETE' });
        setDeleteConfirm(null);
        await fetchMessages();
    };

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-0 space-y-8">
            <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold italic text-white drop-shadow-lg">
                    Envoyer un message
                </h2>
            </div>

            <div className="card-shadow glass-effect rounded-2xl sm:rounded-3xl border border-white/30 p-6 sm:p-8 animate-fade-in">
                <form onSubmit={handleSend} className="space-y-5">
                    <div>
                        <label className="block text-[#ef6a9f]/70 text-xs font-semibold uppercase tracking-wide mb-2">Titre *</label>
                        <input
                            type="text"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            required
                            placeholder="Ex : Informations importantes sur l'hébergement"
                            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-[#ff89b8]/20 text-[#ef6a9f] placeholder-[#ef6a9f]/30 focus:outline-none focus:border-[#ff89b8]/50 focus:bg-white/20 transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-[#ef6a9f]/70 text-xs font-semibold uppercase tracking-wide mb-2">Contenu *</label>
                        <textarea
                            value={content}
                            onChange={e => setContent(e.target.value)}
                            required
                            rows={6}
                            placeholder="Rédigez votre message ici..."
                            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-[#ff89b8]/20 text-[#ef6a9f] placeholder-[#ef6a9f]/30 focus:outline-none focus:border-[#ff89b8]/50 focus:bg-white/20 transition-all resize-none"
                        />
                    </div>

                    {error && (
                        <div className="px-4 py-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl text-sm">{error}</div>
                    )}
                    {success && (
                        <div className="px-4 py-3 bg-green-500/10 border border-green-500/30 text-green-400 rounded-xl text-sm flex items-center gap-2">
                            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            {success}
                        </div>
                    )}

                    <div className="flex items-center justify-between pt-1">
                        <p className="text-[#ef6a9f]/50 text-xs">
                            Le message sera envoyé à tous les utilisateurs par email et notification.
                        </p>
                        <button
                            type="submit"
                            disabled={sending}
                            className="flex items-center gap-2 bg-gradient-to-r from-[#ff89b8] to-[#ef6a9f] text-white font-bold px-6 py-3 rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:scale-100 flex-shrink-0"
                        >
                            {sending ? (
                                <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                            ) : (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                </svg>
                            )}
                            {sending ? 'Envoi...' : 'Envoyer'}
                        </button>
                    </div>
                </form>
            </div>

            <div>
                <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Historique
                </h3>

                <div className="card-shadow glass-effect rounded-2xl sm:rounded-3xl border border-white/30 overflow-hidden animate-fade-in">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="w-7 h-7 border-4 border-[#ff89b8]/30 border-t-[#ef6a9f] rounded-full animate-spin" />
                        </div>
                    ) : messages.length === 0 ? (
                        <div className="text-center py-12 text-[#ef6a9f]/50 text-sm">
                            Aucun message envoyé pour l'instant
                        </div>
                    ) : (
                        <ul className="divide-y divide-[#ff89b8]/10">
                            {messages.map(msg => (
                                <li key={msg.id} className="px-6 py-5 hover:bg-[#ff89b8]/5 transition-colors">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-3 mb-1">
                                                <p className="text-[#ef6a9f] font-bold truncate">{msg.title}</p>
                                                <span className="text-xs text-[#ef6a9f]/50 bg-white/10 px-2 py-0.5 rounded-full flex-shrink-0">
                                                    {msg._count.reads} lu{msg._count.reads > 1 ? 's' : ''}
                                                </span>
                                            </div>
                                            <p className="text-[#ef6a9f]/60 text-sm line-clamp-2">{msg.content}</p>
                                            <p className="text-[#ef6a9f]/40 text-xs mt-2">
                                                {new Date(msg.createdAt).toLocaleDateString('fr-FR', {
                                                    day: 'numeric', month: 'long', year: 'numeric',
                                                    hour: '2-digit', minute: '2-digit',
                                                })}
                                            </p>
                                        </div>
                                        <div className="flex-shrink-0">
                                            {deleteConfirm === msg.id ? (
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => handleDelete(msg.id)}
                                                        className="text-xs bg-red-500 text-white px-3 py-1.5 rounded-lg hover:bg-red-600 transition-colors font-semibold"
                                                    >
                                                        Confirmer
                                                    </button>
                                                    <button
                                                        onClick={() => setDeleteConfirm(null)}
                                                        className="text-xs text-[#ef6a9f]/60 hover:text-[#ef6a9f]"
                                                    >
                                                        Annuler
                                                    </button>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => setDeleteConfirm(msg.id)}
                                                    className="p-2 rounded-lg text-red-400/50 hover:text-red-400 hover:bg-red-500/10 transition-all"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
}
