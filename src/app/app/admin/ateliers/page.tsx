'use client';
import { apiFetch } from '@/lib/clientFetch';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';

type Speaker = { name: string; role: string; company: string; linkedinUrl: string };
type ActivityItem = { id: number; title: string; description: string | null; maxSeats: number | null; order: number; speakers: Speaker[]; registrationCount: number };
type Group = { id: number; title: string; description: string | null; isOpen: boolean; maxPerUser: number; order: number; activities: ActivityItem[] };

const emptySpeaker = (): Speaker => ({ name: '', role: '', company: '', linkedinUrl: '' });

type ModalMode = 'group-create' | 'group-edit' | 'activity-create' | 'activity-edit';

export default function AdminAteliersPage() {
    const [groups, setGroups] = useState<Group[]>([]);
    const [loading, setLoading] = useState(true);
    const [expanded, setExpanded] = useState<Record<number, boolean>>({});
    const [modal, setModal] = useState<{ mode: ModalMode; groupId?: number; item?: Group | ActivityItem } | null>(null);
    const [form, setForm] = useState<Record<string, unknown>>({});
    const [speakers, setSpeakers] = useState<Speaker[]>([emptySpeaker()]);
    const [submitting, setSubmitting] = useState(false);
    const [formError, setFormError] = useState('');
    const [deleteTarget, setDeleteTarget] = useState<{ type: 'group' | 'activity'; id: number; groupId?: number } | null>(null);
    const [togglingId, setTogglingId] = useState<number | null>(null);
    const [mounted, setMounted] = useState(false);
    useEffect(() => { setMounted(true); }, []);

    const fetchGroups = async () => {
        try {
            const res = await apiFetch('/api/admin/activities');
            const data = await res.json();
            setGroups(data.groups ?? []);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchGroups(); }, []);

    const openGroupCreate = () => {
        setModal({ mode: 'group-create' });
        setForm({ title: '', description: '', maxPerUser: '1', order: '0', isOpen: false });
        setSpeakers([]);
        setFormError('');
    };

    const openGroupEdit = (g: Group) => {
        setModal({ mode: 'group-edit', item: g });
        setForm({ title: g.title, description: g.description ?? '', maxPerUser: String(g.maxPerUser), order: String(g.order), isOpen: g.isOpen });
        setSpeakers([]);
        setFormError('');
    };

    const openActivityCreate = (groupId: number) => {
        setModal({ mode: 'activity-create', groupId });
        setForm({ title: '', description: '', maxSeats: '', order: '0' });
        setSpeakers([emptySpeaker()]);
        setFormError('');
    };

    const openActivityEdit = (a: ActivityItem, groupId: number) => {
        setModal({ mode: 'activity-edit', groupId, item: a });
        setForm({ title: a.title, description: a.description ?? '', maxSeats: a.maxSeats?.toString() ?? '', order: String(a.order) });
        setSpeakers(a.speakers.length > 0 ? a.speakers.map(s => ({ name: s.name, role: s.role ?? '', company: s.company ?? '', linkedinUrl: s.linkedinUrl ?? '' })) : [emptySpeaker()]);
        setFormError('');
    };

    const handleSubmit = async () => {
        if (!String(form.title ?? '').trim()) { setFormError('Le titre est requis'); return; }
        setSubmitting(true);
        setFormError('');
        try {
            let url = '';
            let method = 'POST';
            let body: Record<string, unknown> = {};

            if (modal?.mode === 'group-create') {
                url = '/api/admin/activities';
                body = { title: String(form.title).trim(), description: String(form.description || '').trim() || null, isOpen: Boolean(form.isOpen), maxPerUser: Number(form.maxPerUser) || 1, order: Number(form.order) || 0 };
            } else if (modal?.mode === 'group-edit' && modal.item) {
                url = `/api/admin/activities/${(modal.item as Group).id}`;
                method = 'PUT';
                body = { title: String(form.title).trim(), description: String(form.description || '').trim() || null, isOpen: Boolean(form.isOpen), maxPerUser: Number(form.maxPerUser) || 1, order: Number(form.order) || 0 };
            } else if (modal?.mode === 'activity-create' && modal.groupId) {
                url = `/api/admin/activities/${modal.groupId}/items`;
                body = {
                    title: String(form.title).trim(),
                    description: String(form.description || '').trim() || null,
                    maxSeats: form.maxSeats === '' ? null : Number(form.maxSeats),
                    order: Number(form.order) || 0,
                    speakers: speakers.filter(s => s.name.trim()).map(s => ({ name: s.name.trim(), role: s.role.trim() || null, company: s.company.trim() || null, linkedinUrl: s.linkedinUrl.trim() || null })),
                };
            } else if (modal?.mode === 'activity-edit' && modal.item) {
                url = `/api/admin/activities/${modal.groupId}/items/${(modal.item as ActivityItem).id}`;
                method = 'PUT';
                body = {
                    title: String(form.title).trim(),
                    description: String(form.description || '').trim() || null,
                    maxSeats: form.maxSeats === '' ? null : Number(form.maxSeats),
                    order: Number(form.order) || 0,
                    speakers: speakers.filter(s => s.name.trim()).map(s => ({ name: s.name.trim(), role: s.role.trim() || null, company: s.company.trim() || null, linkedinUrl: s.linkedinUrl.trim() || null })),
                };
            }

            const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
            const data = await res.json();
            if (!res.ok) { setFormError(data.error || 'Erreur'); return; }
            await fetchGroups();
            setModal(null);
        } catch {
            setFormError('Erreur réseau');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;
        try {
            if (deleteTarget.type === 'group') {
                await fetch(`/api/admin/activities/${deleteTarget.id}`, { method: 'DELETE' });
            } else {
                await fetch(`/api/admin/activities/${deleteTarget.groupId}/items/${deleteTarget.id}`, { method: 'DELETE' });
            }
            await fetchGroups();
        } finally {
            setDeleteTarget(null);
        }
    };

    const toggleOpen = async (g: Group) => {
        setTogglingId(g.id);
        try {
            const res = await fetch(`/api/admin/activities/${g.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isOpen: !g.isOpen }),
            });
            if (res.ok) setGroups(prev => prev.map(x => x.id === g.id ? { ...x, isOpen: !x.isOpen } : x));
        } finally {
            setTogglingId(null);
        }
    };

    const totalRegistrations = groups.reduce((s, g) => s + g.activities.reduce((ss, a) => ss + a.registrationCount, 0), 0);
    const isActivityModal = modal?.mode === 'activity-create' || modal?.mode === 'activity-edit';
    const isGroupModal = modal?.mode === 'group-create' || modal?.mode === 'group-edit';

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-0">
            {/* En-tête */}
            <div className="mb-8 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Link href="/app/admin" className="p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-all">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                    </Link>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#ff89b8] to-[#ef6a9f] flex items-center justify-center flex-shrink-0 shadow-lg">
                            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold italic text-white drop-shadow-lg">Ateliers</h1>
                    </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                    <a href="/api/admin/activities/export" download className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 px-3 py-2 rounded-xl font-semibold text-sm transition-all" title="Exporter Excel">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" /></svg>
                        <span className="hidden sm:inline">Export</span>
                    </a>
                    <button onClick={openGroupCreate} className="flex items-center gap-2 bg-gradient-to-r from-[#ff89b8] to-[#ef6a9f] text-white px-4 py-2 rounded-xl font-semibold text-sm shadow-md hover:shadow-lg hover:scale-105 transition-all">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                        Nouveau groupe
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mb-6">
                {[
                    { label: 'Groupes', value: groups.length },
                    { label: 'Activités', value: groups.reduce((s, g) => s + g.activities.length, 0) },
                    { label: 'Inscrits', value: totalRegistrations },
                ].map(s => (
                    <div key={s.label} className="card-shadow glass-effect rounded-2xl border border-[#ff89b8]/20 p-4 text-center">
                        <p className="text-gray-500 text-xs font-semibold uppercase tracking-widest mb-1">{s.label}</p>
                        <p className="text-[#ef6a9f] text-3xl font-extrabold">{s.value}</p>
                    </div>
                ))}
            </div>

            {/* Liste des groupes */}
            {loading ? (
                <div className="flex items-center justify-center py-16">
                    <div className="w-8 h-8 border-4 border-[#ff89b8]/30 border-t-[#ef6a9f] rounded-full animate-spin" />
                </div>
            ) : groups.length === 0 ? (
                <div className="card-shadow glass-effect rounded-2xl border border-[#ff89b8]/20 p-10 text-center">
                    <p className="text-gray-500 text-sm mb-4">Aucun groupe créé.</p>
                    <button onClick={openGroupCreate} className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#ff89b8] to-[#ef6a9f] text-white font-semibold text-sm hover:shadow-lg transition-all">Créer le premier groupe</button>
                </div>
            ) : (
                <div className="space-y-4">
                    {groups.map(g => (
                        <div key={g.id} className="card-shadow glass-effect rounded-2xl border border-[#ff89b8]/25 overflow-hidden">
                            {/* Header groupe */}
                            <div className="p-4 sm:p-5">
                                <div className="flex items-center gap-3">
                                    <button onClick={() => setExpanded(e => ({ ...e, [g.id]: !e[g.id] }))} className="flex-1 flex items-center gap-3 text-left min-w-0">
                                        <svg className={`w-4 h-4 text-[#ef6a9f] flex-shrink-0 transition-transform ${expanded[g.id] ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                        <div className="min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <p className="text-gray-800 font-bold text-sm sm:text-base leading-snug">{g.title}</p>
                                                {g.maxPerUser === 1 && <span className="text-[10px] bg-[#ff89b8]/10 text-[#ef6a9f] px-2 py-0.5 rounded-full font-semibold">1 choix max</span>}
                                                {g.maxPerUser > 1 && <span className="text-[10px] bg-[#ff89b8]/10 text-[#ef6a9f] px-2 py-0.5 rounded-full font-semibold">{g.maxPerUser} choix max</span>}
                                                {g.maxPerUser === 0 && <span className="text-[10px] bg-[#ff89b8]/10 text-[#ef6a9f] px-2 py-0.5 rounded-full font-semibold">Illimité</span>}
                                            </div>
                                            <p className="text-gray-500 text-xs mt-0.5">{g.activities.length} activité{g.activities.length > 1 ? 's' : ''} · {g.activities.reduce((s, a) => s + a.registrationCount, 0)} inscrit{g.activities.reduce((s, a) => s + a.registrationCount, 0) > 1 ? 's' : ''}</p>
                                        </div>
                                    </button>

                                    <div className="flex items-center gap-2 flex-shrink-0">
                                        {/* Toggle open */}
                                        <button onClick={() => toggleOpen(g)} disabled={togglingId === g.id} className="relative disabled:opacity-50" title={g.isOpen ? 'Fermer' : 'Ouvrir'}>
                                            <div className={`w-11 h-6 rounded-full transition-colors duration-300 ${g.isOpen ? 'bg-gradient-to-r from-[#ff89b8] to-[#ef6a9f]' : 'bg-gray-200'}`}>
                                                <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300 ${g.isOpen ? 'translate-x-5' : ''}`} />
                                            </div>
                                        </button>
                                        <button onClick={() => openGroupEdit(g)} className="p-1.5 rounded-lg text-[#ef6a9f] hover:bg-[#ff89b8]/10 transition-all" title="Modifier le groupe">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                        </button>
                                        <button onClick={() => setDeleteTarget({ type: 'group', id: g.id })} className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 transition-all" title="Supprimer le groupe">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Activités (expandable) */}
                            {expanded[g.id] && (
                                <div className="border-t border-[#ff89b8]/15 bg-white/30 px-4 sm:px-5 py-4 space-y-2">
                                    {g.activities.map(a => (
                                        <div key={a.id} className="bg-white rounded-xl border border-gray-100 p-3 flex items-start gap-3">
                                            <div className="flex-1 min-w-0">
                                                <p className="text-gray-800 font-semibold text-sm">{a.title}</p>
                                                {a.speakers.length > 0 && <p className="text-gray-400 text-xs mt-0.5">{a.speakers.map(s => s.name).join(', ')}</p>}
                                                <div className="flex items-center gap-3 mt-1">
                                                    <span className="text-gray-400 text-xs">{a.registrationCount} inscrit{a.registrationCount > 1 ? 's' : ''}</span>
                                                    {a.maxSeats !== null && <span className="text-gray-400 text-xs">/ {a.maxSeats} places</span>}
                                                </div>
                                            </div>
                                            <div className="flex gap-1 flex-shrink-0">
                                                <button onClick={() => openActivityEdit(a, g.id)} className="p-1.5 rounded-lg text-[#ef6a9f] hover:bg-[#ff89b8]/10 transition-all">
                                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                                </button>
                                                <button onClick={() => setDeleteTarget({ type: 'activity', id: a.id, groupId: g.id })} className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 transition-all">
                                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                    <button onClick={() => openActivityCreate(g.id)} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 border-dashed border-[#ff89b8]/30 text-[#ef6a9f] font-semibold text-sm hover:border-[#ff89b8]/60 hover:bg-[#ff89b8]/5 transition-all">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                                        Ajouter une activité
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Modal groupe ou activité */}
            {mounted && modal && createPortal(
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-4" style={{ zIndex: 10000 }}>
                    <div className="bg-white rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
                        <div className="bg-gradient-to-r from-[#ff89b8] to-[#ef6a9f] px-6 py-5 rounded-t-3xl">
                            <h2 className="text-white font-extrabold text-xl">
                                {modal.mode === 'group-create' ? 'Nouveau groupe' :
                                 modal.mode === 'group-edit' ? 'Modifier le groupe' :
                                 modal.mode === 'activity-create' ? 'Nouvelle activité' : 'Modifier l\'activité'}
                            </h2>
                        </div>
                        <div className="p-6 space-y-4">
                            {formError && <p className="text-red-500 text-sm bg-red-50 px-3 py-2 rounded-xl">{formError}</p>}

                            <div>
                                <label className="block text-gray-600 text-xs font-semibold uppercase tracking-widest mb-1.5">Titre *</label>
                                <input type="text" value={String(form.title ?? '')} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#ff89b8] focus:ring-2 focus:ring-[#ff89b8]/20 text-sm text-gray-800" placeholder="Titre" />
                            </div>

                            <div>
                                <label className="block text-gray-600 text-xs font-semibold uppercase tracking-widest mb-1.5">Description</label>
                                <textarea value={String(form.description ?? '')} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={2} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#ff89b8] focus:ring-2 focus:ring-[#ff89b8]/20 text-sm text-gray-800 resize-none" placeholder="Description optionnelle" />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-gray-600 text-xs font-semibold uppercase tracking-widest mb-1.5">Ordre</label>
                                    <input type="number" value={String(form.order ?? '0')} onChange={e => setForm(f => ({ ...f, order: e.target.value }))} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#ff89b8] text-sm text-gray-800" />
                                </div>
                                {isGroupModal && (
                                    <div>
                                        <label className="block text-gray-600 text-xs font-semibold uppercase tracking-widest mb-1.5">Max/utilisateur</label>
                                        <input type="number" min="0" value={String(form.maxPerUser ?? '1')} onChange={e => setForm(f => ({ ...f, maxPerUser: e.target.value }))} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#ff89b8] text-sm text-gray-800" placeholder="0 = illimité" />
                                    </div>
                                )}
                                {isActivityModal && (
                                    <div>
                                        <label className="block text-gray-600 text-xs font-semibold uppercase tracking-widest mb-1.5">Places max</label>
                                        <input type="number" min="1" value={String(form.maxSeats ?? '')} onChange={e => setForm(f => ({ ...f, maxSeats: e.target.value }))} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#ff89b8] text-sm text-gray-800" placeholder="Illimité" />
                                    </div>
                                )}
                            </div>

                            {isGroupModal && (
                                <div className="flex items-center justify-between py-2">
                                    <label className="text-gray-700 text-sm font-semibold">Inscriptions ouvertes</label>
                                    <button type="button" onClick={() => setForm(f => ({ ...f, isOpen: !f.isOpen }))} className="flex items-center gap-2">
                                        <div className={`relative w-11 h-6 rounded-full transition-colors ${form.isOpen ? 'bg-gradient-to-r from-[#ff89b8] to-[#ef6a9f]' : 'bg-gray-200'}`}>
                                            <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.isOpen ? 'translate-x-5' : ''}`} />
                                        </div>
                                        <span className={`text-sm font-semibold ${form.isOpen ? 'text-green-600' : 'text-gray-400'}`}>{form.isOpen ? 'Ouvertes' : 'Fermées'}</span>
                                    </button>
                                </div>
                            )}

                            {isActivityModal && (
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="text-gray-600 text-xs font-semibold uppercase tracking-widest">Intervenants</label>
                                        <button type="button" onClick={() => setSpeakers(s => [...s, emptySpeaker()])} className="text-[#ef6a9f] text-xs font-semibold flex items-center gap-1">
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                                            Ajouter
                                        </button>
                                    </div>
                                    <div className="space-y-3">
                                        {speakers.map((s, i) => (
                                            <div key={i} className="bg-gray-50 rounded-xl p-3 space-y-2">
                                                <div className="flex gap-2">
                                                    <input type="text" value={s.name} onChange={e => setSpeakers(sp => sp.map((x, j) => j === i ? { ...x, name: e.target.value } : x))} className="flex-1 px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-[#ff89b8] text-sm" placeholder="Nom Prénom" />
                                                    {speakers.length > 1 && (
                                                        <button type="button" onClick={() => setSpeakers(sp => sp.filter((_, j) => j !== i))} className="p-1.5 text-red-400 hover:text-red-600">
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                                        </button>
                                                    )}
                                                </div>
                                                <div className="grid grid-cols-2 gap-2">
                                                    <input type="text" value={s.role} onChange={e => setSpeakers(sp => sp.map((x, j) => j === i ? { ...x, role: e.target.value } : x))} className="px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-[#ff89b8] text-sm" placeholder="Poste" />
                                                    <input type="text" value={s.company} onChange={e => setSpeakers(sp => sp.map((x, j) => j === i ? { ...x, company: e.target.value } : x))} className="px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-[#ff89b8] text-sm" placeholder="Entreprise" />
                                                </div>
                                                <input type="url" value={s.linkedinUrl} onChange={e => setSpeakers(sp => sp.map((x, j) => j === i ? { ...x, linkedinUrl: e.target.value } : x))} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-[#ff89b8] text-sm" placeholder="LinkedIn URL (optionnel)" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="flex gap-3 pt-2">
                                <button onClick={() => setModal(null)} className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50 transition-all">Annuler</button>
                                <button onClick={handleSubmit} disabled={submitting} className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-[#ff89b8] to-[#ef6a9f] text-white font-semibold text-sm shadow-md disabled:opacity-50 transition-all">
                                    {submitting ? 'Enregistrement...' : modal.mode.includes('edit') ? 'Modifier' : 'Créer'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>,
                document.body
            )}

            {/* Confirm delete */}
            {mounted && deleteTarget && createPortal(
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" style={{ zIndex: 10000 }}>
                    <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
                        <h3 className="font-bold text-gray-800 text-lg mb-2">Confirmer la suppression</h3>
                        <p className="text-gray-500 text-sm mb-6">
                            {deleteTarget.type === 'group'
                                ? 'Supprimer ce groupe supprimera toutes ses activités et inscriptions.'
                                : 'Supprimer cette activité supprimera toutes ses inscriptions.'}
                        </p>
                        <div className="flex gap-3">
                            <button onClick={() => setDeleteTarget(null)} className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50 transition-all">Annuler</button>
                            <button onClick={handleDelete} className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 text-white font-semibold text-sm hover:bg-red-600 transition-all">Supprimer</button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
}
