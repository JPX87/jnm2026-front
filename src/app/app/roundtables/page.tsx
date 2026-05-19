'use client';
import { apiFetch } from '@/lib/clientFetch';

import { useEffect, useState } from 'react';

type Speaker = {
    id: number;
    name: string;
    role: string | null;
    company: string | null;
    linkedinUrl: string | null;
};

type RoundTable = {
    id: number;
    title: string;
    description: string | null;
    maxSeats: number | null;
    order: number;
    speakers: Speaker[];
    registrationCount: number;
    isRegistered: boolean;
    isFull: boolean;
};

export default function RoundTablesPage() {
    const [tables, setTables] = useState<RoundTable[]>([]);
    const [roundTablesOpen, setRoundTablesOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [pending, setPending] = useState<number | null>(null);
    const [error, setError] = useState('');

    const fetchTables = async () => {
        try {
            const res = await apiFetch('/api/roundtables');
            const data = await res.json();
            setTables(data.tables ?? []);
            setRoundTablesOpen(data.roundTablesOpen ?? false);
        } catch {
            setError('Impossible de charger les tables rondes');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchTables(); }, []);

    const handleRegister = async (id: number) => {
        setPending(id);
        setError('');
        try {
            const res = await fetch(`/api/roundtables/${id}/register`, { method: 'POST' });
            const data = await res.json();
            if (!res.ok) { setError(data.error || 'Erreur'); return; }
            setTables(prev => prev.map(t =>
                t.id === id
                    ? {
                        ...t,
                        isRegistered: data.registered,
                        registrationCount: data.registered ? t.registrationCount + 1 : t.registrationCount - 1,
                        isFull: t.maxSeats !== null && (data.registered ? t.registrationCount + 1 : t.registrationCount - 1) >= t.maxSeats,
                    }
                    : t
            ));
        } catch {
            setError('Erreur réseau');
        } finally {
            setPending(null);
        }
    };

    const registeredCount = tables.filter(t => t.isRegistered).length;
    const hasRegistration = registeredCount > 0;

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-0">
            {/* En-tête */}
            <div className="mb-8">
                <div className="flex items-center gap-3 sm:gap-4 mb-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#ff89b8] to-[#ef6a9f] flex items-center justify-center flex-shrink-0 shadow-lg">
                        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </div>
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold italic text-white drop-shadow-lg">Tables rondes</h1>
                </div>
                <p className="text-white/70 text-sm sm:text-base ml-0 sm:ml-16">
                    Échangez avec des professionnels et alumni autour de thématiques variées.
                </p>
            </div>

            {/* Bannière statut global */}
            <div className={`mb-6 rounded-2xl px-5 py-4 flex items-center gap-3 ${roundTablesOpen ? 'bg-green-500/15 border border-green-400/30' : 'bg-white/10 border border-white/20'}`}>
                <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${roundTablesOpen ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`} />
                <div>
                    <p className={`font-semibold text-sm ${roundTablesOpen ? 'text-green-300' : 'text-white/60'}`}>
                        {roundTablesOpen ? 'Inscriptions ouvertes' : 'Inscriptions fermées'}
                    </p>
                    {roundTablesOpen && registeredCount > 0 && (
                        <p className="text-green-300/70 text-xs mt-0.5">Vous êtes inscrit à {registeredCount} table{registeredCount > 1 ? 's' : ''} ronde{registeredCount > 1 ? 's' : ''}</p>
                    )}
                    {!roundTablesOpen && (
                        <p className="text-white/40 text-xs mt-0.5">Les inscriptions ne sont pas encore ouvertes</p>
                    )}
                </div>
            </div>

            {error && (
                <div className="mb-4 px-4 py-3 bg-red-500/15 border border-red-400/30 text-red-300 rounded-xl text-sm">{error}</div>
            )}

            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="w-8 h-8 border-4 border-[#ff89b8]/30 border-t-[#ef6a9f] rounded-full animate-spin" />
                </div>
            ) : (
                <div className="space-y-4">
                    {tables.map(table => {
                        const canRegister = roundTablesOpen && !table.isFull && !hasRegistration;
                        const blockedByOther = roundTablesOpen && !table.isRegistered && hasRegistration;
                        const showRegisterBtn = canRegister || table.isRegistered || blockedByOther;

                        return (
                            <div
                                key={table.id}
                                className={`card-shadow glass-effect rounded-2xl border p-5 sm:p-6 transition-all duration-200 ${
                                    table.isRegistered
                                        ? 'border-[#ff89b8]/50 bg-[#ff89b8]/5'
                                        : 'border-[#ff89b8]/20'
                                }`}
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1 min-w-0">
                                        {/* Numéro + badges */}
                                        <div className="flex flex-wrap items-center gap-2 mb-2">
                                            <span className="text-[#ef6a9f]/50 text-xs font-bold uppercase tracking-widest">Table {table.order}</span>
                                            {table.isRegistered && (
                                                <span className="inline-flex items-center gap-1.5 bg-[#ff89b8]/20 text-[#ef6a9f] text-xs font-bold px-2.5 py-0.5 rounded-full border border-[#ff89b8]/40">
                                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                                    Inscrit
                                                </span>
                                            )}
                                            {table.isFull && !table.isRegistered && (
                                                <span className="inline-flex items-center bg-red-500/15 text-red-400 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-red-400/30">Complet</span>
                                            )}
                                        </div>

                                        {/* Titre */}
                                        <h2 className="text-gray-800 font-bold text-base sm:text-lg leading-tight mb-1">{table.title}</h2>

                                        {/* Description */}
                                        {table.description && (
                                            <p className="text-gray-500 text-xs sm:text-sm mb-3">{table.description}</p>
                                        )}

                                        {/* Speakers */}
                                        {table.speakers.length > 0 && (
                                            <div className="flex flex-wrap gap-2 mt-3">
                                                {table.speakers.map(s => (
                                                    <div key={s.id} className="flex items-center gap-1.5 bg-[#fff0f6] border border-[#ff89b8]/25 rounded-xl px-3 py-1.5">
                                                        <div>
                                                            <p className="text-gray-800 font-semibold text-xs leading-tight">{s.name}</p>
                                                            {(s.role || s.company) && (
                                                                <p className="text-gray-500 text-xs leading-tight">
                                                                    {[s.role, s.company].filter(Boolean).join(' · ')}
                                                                </p>
                                                            )}
                                                        </div>
                                                        {s.linkedinUrl && (
                                                            <a
                                                                href={s.linkedinUrl}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="ml-1 text-[#0a66c2] hover:opacity-70 transition-opacity flex-shrink-0"
                                                                title={`LinkedIn de ${s.name}`}
                                                            >
                                                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                                                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                                                </svg>
                                                            </a>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {/* Places */}
                                        {table.maxSeats !== null && (
                                            <div className="mt-3 flex items-center gap-2">
                                                <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden max-w-[160px]">
                                                    <div
                                                        className="h-full bg-gradient-to-r from-[#ff89b8] to-[#ef6a9f] rounded-full transition-all"
                                                        style={{ width: `${Math.min(100, (table.registrationCount / table.maxSeats) * 100)}%` }}
                                                    />
                                                </div>
                                                <span className="text-gray-500 text-xs font-medium">
                                                    {table.registrationCount}/{table.maxSeats} places
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Bouton inscription */}
                                    {showRegisterBtn && (
                                        <div className="flex flex-col items-end gap-1 flex-shrink-0 mt-1">
                                            <button
                                                onClick={() => handleRegister(table.id)}
                                                disabled={pending === table.id || blockedByOther}
                                                title={blockedByOther ? 'Vous êtes déjà inscrit à une table ronde' : undefined}
                                                className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-200 ${
                                                    table.isRegistered
                                                        ? 'border border-[#ff89b8]/40 text-[#ef6a9f] hover:bg-red-50 hover:border-red-200 hover:text-red-500'
                                                        : blockedByOther
                                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                            : 'bg-gradient-to-r from-[#ff89b8] to-[#ef6a9f] text-white shadow-md hover:shadow-lg hover:scale-105'
                                                }`}
                                            >
                                                {pending === table.id ? (
                                                    <div className="w-4 h-4 border-2 border-current/40 border-t-current rounded-full animate-spin" />
                                                ) : table.isRegistered ? (
                                                    "Se désinscrire"
                                                ) : (
                                                    "S'inscrire"
                                                )}
                                            </button>
                                            {blockedByOther && (
                                                <p className="text-gray-400 text-[10px] text-right max-w-[120px] leading-tight">1 table max</p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
