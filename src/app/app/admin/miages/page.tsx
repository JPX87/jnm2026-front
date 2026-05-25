'use client';
import { apiFetch } from '@/lib/clientFetch';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

type MiageGroup = { id: number; name: string; active: boolean; order: number };

const emptyForm = { name: '', active: true };

export default function AdminMiagesPage() {
    const [groups, setGroups] = useState<MiageGroup[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState<MiageGroup | null>(null);
    const [form, setForm] = useState(emptyForm);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

    const fetchGroups = useCallback(async () => {
        setLoading(true);
        try {
            const res = await apiFetch('/api/admin/miages');
            setGroups(await res.json());
        } catch { setError('Impossible de charger les groupes'); }
        finally { setLoading(false); }
    }, []);

    useEffect(() => { fetchGroups(); }, [fetchGroups]);

    const openAdd = () => { setEditing(null); setForm(emptyForm); setError(''); setShowModal(true); };
    const openEdit = (g: MiageGroup) => { setEditing(g); setForm({ name: g.name, active: g.active }); setError(''); setShowModal(true); };
    const closeModal = () => { setShowModal(false); setEditing(null); setForm(emptyForm); setError(''); };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');
        try {
            const url = editing ? `/api/admin/miages/${editing.id}` : '/api/admin/miages';
            const method = editing ? 'PUT' : 'POST';
            const res = await apiFetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });
            if (!res.ok) { setError((await res.json()).error || 'Erreur'); return; }
            await fetchGroups();
            closeModal();
        } catch { setError('Erreur réseau'); }
        finally { setSubmitting(false); }
    };

    const handleDelete = async (id: number) => {
        try {
            await apiFetch(`/api/admin/miages/${id}`, { method: 'DELETE' });
            setDeleteConfirm(null);
            await fetchGroups();
        } catch { setError('Erreur lors de la suppression'); }
    };

    const toggleActive = async (g: MiageGroup) => {
        try {
            await apiFetch(`/api/admin/miages/${g.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...g, active: !g.active }),
            });
            await fetchGroups();
        } catch { setError('Erreur'); }
    };

    const activeCount = groups.filter(g => g.active).length;

    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-0">
            {/* Header */}
            <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3 sm:gap-4">
                    <Link href="/app/admin" className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center hover:bg-white/30 transition-all flex-shrink-0">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                        </svg>
                    </Link>
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#ff89b8] to-[#ef6a9f] flex items-center justify-center flex-shrink-0 shadow-lg">
                        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold italic text-white drop-shadow-lg">Groupes MIAGE</h1>
                </div>
                <button
                    onClick={openAdd}
                    className="flex items-center gap-2 bg-gradient-to-r from-[#ff89b8] to-[#ef6a9f] text-white font-bold px-5 py-2.5 rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all text-sm"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Ajouter
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 mb-6">
                {[
                    { label: 'Total', value: groups.length, color: 'text-[#ef6a9f]' },
                    { label: 'Actifs', value: activeCount, color: 'text-green-500' },
                ].map(s => (
                    <div key={s.label} className="card-shadow glass-effect rounded-2xl border border-[#ff89b8]/20 p-4 text-center">
                        <p className="text-gray-500 text-xs font-semibold uppercase tracking-widest mb-1">{s.label}</p>
                        <p className={`text-3xl font-extrabold ${s.color}`}>{s.value}</p>
                    </div>
                ))}
            </div>

            {error && <div className="mb-4 px-4 py-3 bg-red-500/15 border border-red-400/30 text-red-300 rounded-xl text-sm">{error}</div>}

            {/* List */}
            <div className="card-shadow glass-effect rounded-2xl sm:rounded-3xl border border-[#ff89b8]/20 overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center py-16">
                        <div className="w-8 h-8 border-4 border-[#ff89b8]/30 border-t-[#ef6a9f] rounded-full animate-spin" />
                    </div>
                ) : groups.length === 0 ? (
                    <div className="text-center py-16 text-gray-400 text-sm">Aucun groupe configuré</div>
                ) : (
                    <div className="divide-y divide-[#ff89b8]/10">
                        {groups.map(g => (
                            <div key={g.id} className={`flex items-center gap-3 px-4 sm:px-5 py-3.5 transition-colors ${g.active ? '' : 'opacity-50'}`}>
                                {/* Drag handle indicator */}
                                <span className="text-gray-300 text-xs font-mono w-5 text-center flex-shrink-0">{g.order}</span>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className="font-bold text-gray-800 text-sm">{g.name}</span>
                                        {!g.active && (
                                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
                                                Inactif
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Toggle active */}
                                <button onClick={() => toggleActive(g)} className="relative flex-shrink-0" title={g.active ? 'Désactiver' : 'Activer'}>
                                    <div className={`w-10 h-5 rounded-full transition-colors duration-300 ${g.active ? 'bg-gradient-to-r from-[#ff89b8] to-[#ef6a9f]' : 'bg-gray-200'}`}>
                                        <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-300 ${g.active ? 'translate-x-5' : 'translate-x-0'}`} />
                                    </div>
                                </button>

                                {/* Actions */}
                                {deleteConfirm === g.id ? (
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                        <button onClick={() => handleDelete(g.id)} className="text-xs bg-red-500 text-white px-3 py-1.5 rounded-lg hover:bg-red-600 font-semibold">Confirmer</button>
                                        <button onClick={() => setDeleteConfirm(null)} className="text-xs text-gray-400 hover:text-gray-600">Annuler</button>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-1 flex-shrink-0">
                                        <button onClick={() => openEdit(g)} className="p-2 rounded-lg text-gray-400 hover:text-[#ef6a9f] hover:bg-[#ff89b8]/10 transition-all" title="Modifier">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                        </button>
                                        <button onClick={() => setDeleteConfirm(g.id)} className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all" title="Supprimer">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center p-4" style={{ zIndex: 10000 }}>
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={closeModal} />
                    <div className="relative glass-effect border border-[#ff89b8]/20 rounded-3xl shadow-2xl w-full max-w-md animate-fade-in">
                        <div className="p-6 sm:p-8">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-bold text-gray-800">
                                    {editing ? 'Modifier le groupe' : 'Nouveau groupe MIAGE'}
                                </h3>
                                <button onClick={closeModal} className="p-2 rounded-xl hover:bg-[#ff89b8]/10 text-gray-400 hover:text-[#ef6a9f] transition-all">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            {error && <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">{error}</div>}

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div>
                                    <label className="block text-gray-500 text-xs font-semibold uppercase tracking-widest mb-1.5">Nom du groupe *</label>
                                    <input
                                        type="text"
                                        value={form.name}
                                        onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                                        required
                                        placeholder="ex: Paris Cité, Lyon, Bordeaux…"
                                        className="w-full px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-800 placeholder-gray-300 focus:outline-none focus:border-[#ff89b8] focus:ring-2 focus:ring-[#ff89b8]/20 transition-all text-sm"
                                    />
                                    <p className="text-gray-400 text-xs mt-1.5">Doit correspondre exactement au champ <code className="bg-gray-100 px-1 rounded">miage</code> des utilisateurs</p>
                                </div>

                                <label className="flex items-center gap-3 cursor-pointer">
                                    <div className="relative flex-shrink-0">
                                        <input type="checkbox" className="sr-only" checked={form.active} onChange={e => setForm(f => ({ ...f, active: e.target.checked }))} />
                                        <div className={`w-11 h-6 rounded-full transition-colors duration-300 ${form.active ? 'bg-gradient-to-r from-[#ff89b8] to-[#ef6a9f]' : 'bg-gray-200'}`}>
                                            <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300 ${form.active ? 'translate-x-5' : 'translate-x-0'}`} />
                                        </div>
                                    </div>
                                    <div>
                                        <span className="text-gray-700 font-semibold text-sm">Participe au concours</span>
                                        <p className="text-gray-400 text-xs">Apparaît dans la liste des choix de vote</p>
                                    </div>
                                </label>

                                <div className="flex gap-3 pt-2">
                                    <button type="button" onClick={closeModal} className="flex-1 py-3 rounded-2xl border border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 transition-all text-sm">Annuler</button>
                                    <button type="submit" disabled={submitting} className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-[#ff89b8] to-[#ef6a9f] text-white font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:scale-100 text-sm">
                                        {submitting ? 'Enregistrement...' : editing ? 'Modifier' : 'Créer'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
