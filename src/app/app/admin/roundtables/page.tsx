'use client';
import { apiFetch } from '@/lib/clientFetch';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';

type Speaker = {
    id: number;
    name: string;
    role: string | null;
    company: string | null;
};

type RoundTable = {
    id: number;
    title: string;
    description: string | null;
    maxSeats: number | null;
    order: number;
    speakers: Speaker[];
    registrationCount: number;
};

type SeatsEdits = Record<number, string>;

export default function AdminRoundTablesPage() {
    const [tables, setTables] = useState<RoundTable[]>([]);
    const [roundTablesOpen, setRoundTablesOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [globalSaving, setGlobalSaving] = useState(false);
    const [globalSaved, setGlobalSaved] = useState(false);
    const [seatsEdits, setSeatsEdits] = useState<SeatsEdits>({});
    const [savingSeatsId, setSavingSeatsId] = useState<number | null>(null);
    const [savedSeatsId, setSavedSeatsId] = useState<number | null>(null);
    const saveTimeouts = useRef<Record<number, ReturnType<typeof setTimeout>>>({});

    const fetchData = async () => {
        try {
            const res = await apiFetch('/api/admin/roundtables');
            const data = await res.json();
            const t: RoundTable[] = data.tables ?? [];
            setTables(t);
            setRoundTablesOpen(data.roundTablesOpen ?? false);
            // Init seats edits with current values
            const edits: SeatsEdits = {};
            t.forEach(table => { edits[table.id] = table.maxSeats?.toString() ?? ''; });
            setSeatsEdits(edits);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    /* ---- Global toggle ---- */
    const toggleGlobal = async () => {
        const next = !roundTablesOpen;
        setRoundTablesOpen(next);
        setGlobalSaving(true);
        setGlobalSaved(false);
        try {
            const res = await apiFetch('/api/admin/settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ key: 'roundTablesOpen', value: String(next) }),
            });
            if (!res.ok) throw new Error();
            setGlobalSaved(true);
            setTimeout(() => setGlobalSaved(false), 2500);
        } catch {
            setRoundTablesOpen(!next);
        } finally {
            setGlobalSaving(false);
        }
    };

    /* ---- Save maxSeats ---- */
    const saveSeats = async (id: number) => {
        const raw = seatsEdits[id] ?? '';
        const maxSeats = raw === '' ? null : parseInt(raw);
        if (raw !== '' && (isNaN(maxSeats!) || maxSeats! < 0)) return;

        setSavingSeatsId(id);
        try {
            const res = await fetch(`/api/admin/roundtables/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ maxSeats: raw === '' ? null : maxSeats }),
            });
            if (!res.ok) throw new Error();
            setTables(prev => prev.map(t => t.id === id ? { ...t, maxSeats: maxSeats ?? null } : t));
            setSavedSeatsId(id);
            clearTimeout(saveTimeouts.current[id]);
            saveTimeouts.current[id] = setTimeout(() => setSavedSeatsId(null), 2000);
        } catch {
            // revert
            setSeatsEdits(prev => ({ ...prev, [id]: tables.find(t => t.id === id)?.maxSeats?.toString() ?? '' }));
        } finally {
            setSavingSeatsId(null);
        }
    };

    const handleSeatsKeyDown = (e: React.KeyboardEvent, id: number) => {
        if (e.key === 'Enter') saveSeats(id);
    };

    const totalRegistrations = tables.reduce((sum, t) => sum + t.registrationCount, 0);

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-0">

            {/* En-tête */}
            <div className="mb-8 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Link href="/app/admin" className="p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-all">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </Link>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#ff89b8] to-[#ef6a9f] flex items-center justify-center flex-shrink-0 shadow-lg">
                            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold italic text-white drop-shadow-lg">Tables rondes</h1>
                    </div>
                </div>
                <a
                    href="/api/admin/roundtables/export"
                    download
                    className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 px-4 py-2 rounded-xl font-semibold text-sm transition-all hover:scale-105 flex-shrink-0"
                    title="Télécharger le fichier Excel des inscriptions"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                    </svg>
                    <span className="hidden sm:inline">Exporter Excel</span>
                </a>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="card-shadow glass-effect rounded-2xl border border-[#ff89b8]/20 p-4 sm:p-5 text-center animate-fade-in">
                    <p className="text-gray-500 text-xs font-semibold uppercase tracking-widest mb-1">Tables rondes</p>
                    <p className="text-[#ef6a9f] text-3xl sm:text-4xl font-extrabold">{tables.length}</p>
                </div>
                <div className="card-shadow glass-effect rounded-2xl border border-[#ff89b8]/20 p-4 sm:p-5 text-center animate-fade-in">
                    <p className="text-gray-500 text-xs font-semibold uppercase tracking-widest mb-1">Total inscrits</p>
                    <p className="text-[#ef6a9f] text-3xl sm:text-4xl font-extrabold">{totalRegistrations}</p>
                </div>
            </div>

            {/* Toggle global */}
            <div className="card-shadow glass-effect rounded-2xl border border-[#ff89b8]/20 p-5 sm:p-6 mb-8 animate-fade-in">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <p className="text-gray-800 font-bold text-base">Accès global aux inscriptions</p>
                        <p className="text-gray-500 text-xs mt-0.5">Active ou désactive les inscriptions pour toutes les tables simultanément</p>
                        {globalSaved && <p className="text-green-600 text-xs mt-1.5 font-semibold">✓ Sauvegardé</p>}
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                        <span className={`text-sm font-bold px-3 py-1 rounded-full ${roundTablesOpen ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                            {roundTablesOpen ? 'Ouvertes' : 'Fermées'}
                        </span>
                        <button
                            onClick={toggleGlobal}
                            disabled={globalSaving}
                            className="relative flex-shrink-0 disabled:opacity-50"
                            aria-label="Ouvrir/fermer les inscriptions"
                        >
                            <div className={`w-14 h-7 rounded-full transition-colors duration-300 ${roundTablesOpen ? 'bg-gradient-to-r from-[#ff89b8] to-[#ef6a9f]' : 'bg-gray-200'}`}>
                                <div className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300 ${roundTablesOpen ? 'translate-x-7' : 'translate-x-0'}`} />
                            </div>
                        </button>
                    </div>
                </div>
            </div>

            {/* Liste des tables */}
            <p className="text-white/60 text-xs font-semibold uppercase tracking-widest mb-3 ml-1">Configuration par table</p>

            {loading ? (
                <div className="flex items-center justify-center py-16">
                    <div className="w-8 h-8 border-4 border-[#ff89b8]/30 border-t-[#ef6a9f] rounded-full animate-spin" />
                </div>
            ) : (
                <div className="space-y-3">
                    {tables.map(table => {
                        const seatsValue = seatsEdits[table.id] ?? '';
                        const seatsChanged = seatsValue !== (table.maxSeats?.toString() ?? '');
                        const isFull = table.maxSeats !== null && table.registrationCount >= table.maxSeats;

                        return (
                            <div key={table.id} className="card-shadow glass-effect rounded-2xl border border-[#ff89b8]/25 p-4 sm:p-5 animate-fade-in">
                                {/* Ligne 1 : titre + badges */}
                                <div className="flex flex-wrap items-center gap-2 mb-2">
                                    <span className="text-[#ef6a9f]/60 text-xs font-bold uppercase tracking-widest">Table {table.order}</span>
                                    {isFull && <span className="bg-red-100 text-red-600 text-xs font-semibold px-2 py-0.5 rounded-full border border-red-200">Complet</span>}
                                </div>

                                <p className="text-gray-800 font-semibold text-sm leading-snug mb-1">{table.title}</p>

                                {table.speakers.length > 0 && (
                                    <p className="text-gray-500 text-xs mb-4">
                                        {table.speakers.map(s => [s.name, s.company].filter(Boolean).join(' · ')).join('  —  ')}
                                    </p>
                                )}

                                {/* Ligne de config */}
                                <div className="flex flex-wrap items-end gap-4 pt-3 border-t border-gray-100">

                                    {/* Places */}
                                    <div className="flex-1 min-w-[140px]">
                                        <label className="block text-gray-500 text-xs font-semibold uppercase tracking-widest mb-1.5">
                                            Nombre de places
                                        </label>
                                        <div className="flex items-center gap-2">
                                            <div className="relative flex items-center">
                                                <input
                                                    type="number"
                                                    min="1"
                                                    placeholder="Illimité"
                                                    value={seatsValue}
                                                    onChange={e => setSeatsEdits(prev => ({ ...prev, [table.id]: e.target.value }))}
                                                    onKeyDown={e => handleSeatsKeyDown(e, table.id)}
                                                    className="w-28 px-3 py-2 rounded-xl bg-white border border-gray-200 text-gray-800 placeholder-gray-300 focus:outline-none focus:border-[#ff89b8] focus:ring-2 focus:ring-[#ff89b8]/20 transition-all text-sm font-medium"
                                                />
                                            </div>
                                            {seatsChanged && (
                                                <button
                                                    onClick={() => saveSeats(table.id)}
                                                    disabled={savingSeatsId === table.id}
                                                    className="px-3 py-2 rounded-xl bg-gradient-to-r from-[#ff89b8] to-[#ef6a9f] text-white text-xs font-bold shadow hover:shadow-md hover:scale-105 transition-all disabled:opacity-50"
                                                >
                                                    {savingSeatsId === table.id ? (
                                                        <div className="w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                                                    ) : 'Sauver'}
                                                </button>
                                            )}
                                            {savedSeatsId === table.id && !seatsChanged && (
                                                <span className="text-green-600 text-xs font-semibold">✓ Sauvegardé</span>
                                            )}
                                        </div>
                                        {/* Barre de remplissage */}
                                        {table.maxSeats !== null && (
                                            <div className="mt-2 flex items-center gap-2">
                                                <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden max-w-[120px]">
                                                    <div
                                                        className={`h-full rounded-full transition-all ${isFull ? 'bg-red-400' : 'bg-gradient-to-r from-[#ff89b8] to-[#ef6a9f]'}`}
                                                        style={{ width: `${Math.min(100, (table.registrationCount / table.maxSeats) * 100)}%` }}
                                                    />
                                                </div>
                                                <span className="text-gray-500 text-xs">{table.registrationCount} / {table.maxSeats}</span>
                                            </div>
                                        )}
                                        {table.maxSeats === null && (
                                            <p className="text-gray-400 text-xs mt-1">{table.registrationCount} inscrit{table.registrationCount > 1 ? 's' : ''}</p>
                                        )}
                                    </div>

                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

