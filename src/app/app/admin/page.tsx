'use client';
import { apiFetch } from '@/lib/clientFetch';

import { useState, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';

type User = {
    id: number;
    email: string;
    firstname: string | null;
    lastname: string | null;
    miage: string | null;
    ville: string | null;
    hotelRoom: string;
    hotelFloor: string | null;
    doorCode: string | null;
    isAdmin: boolean;
    isJury: boolean;
    createdAt: string;
};

type UserFormData = {
    email: string;
    password: string;
    firstname: string;
    lastname: string;
    miage: string;
    ville: string;
    hotelRoom: string;
    hotelFloor: string;
    doorCode: string;
    isAdmin: boolean;
    isJury: boolean;
};

type ImportResult = {
    success: number;
    created: { id: number; email: string; firstname: string | null; password: string }[];
    errors: { row: number; email: string; reason: string }[];
};

type UpdateResult = {
    updated: number;
    errors: { row: number; email: string; reason: string }[];
};

const emptyForm: UserFormData = {
    email: '', password: '', firstname: '', lastname: '',
    miage: '', ville: '', hotelRoom: '', hotelFloor: '', doorCode: '', isAdmin: false, isJury: false,
};

export default function AdminPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [form, setForm] = useState<UserFormData>(emptyForm);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
    const [importing, setImporting] = useState(false);
    const [importResult, setImportResult] = useState<ImportResult | null>(null);
    const [updating, setUpdating] = useState(false);
    const [updateResult, setUpdateResult] = useState<UpdateResult | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const updateFileInputRef = useRef<HTMLInputElement>(null);
    const [mounted, setMounted] = useState(false);
    const [loginEnabled, setLoginEnabled] = useState(true);
    const [voteVideoOpen, setVoteVideoOpen] = useState(false);
    const [voteRugbyOpen, setVoteRugbyOpen] = useState(false);
    const [resultsVideoVisible, setResultsVideoVisible] = useState(false);
    const [resultsRugbyVisible, setResultsRugbyVisible] = useState(false);
    const [settingsLoading, setSettingsLoading] = useState(true);
    const [settingsError, setSettingsError] = useState('');
    const [settingsSaved, setSettingsSaved] = useState(false);
    const [confirmReveal, setConfirmReveal] = useState<{ key: string; setter: (v: boolean) => void } | null>(null);

    // Email de bienvenue – création unique
    const [modalStep, setModalStep] = useState<'form' | 'email-confirm'>('form');
    const [pendingEmailUser, setPendingEmailUser] = useState<{ id: number; email: string; firstname: string; password: string } | null>(null);
    const [sendingEmail, setSendingEmail] = useState(false);
    const [emailSent, setEmailSent] = useState(false);

    // Email de bienvenue – import masse
    const [pendingImportEmails, setPendingImportEmails] = useState<{ id: number; email: string; firstname: string | null; password: string }[]>([]);
    const [emailProgress, setEmailProgress] = useState<{ sent: number; total: number; errors: string[] } | null>(null);
    const [sendingImportEmails, setSendingImportEmails] = useState(false);

    useEffect(() => { setMounted(true); }, []);

    useEffect(() => {
        apiFetch('/api/admin/settings')
            .then(r => r.json())
            .then(data => {
                if (data.error) throw new Error(data.error);
                setLoginEnabled(data.loginEnabled === 'true');
                setVoteVideoOpen(data.voteVideoOpen === 'true');
                setVoteRugbyOpen(data.voteRugbyOpen === 'true');
                setResultsVideoVisible(data.resultsVideoVisible === 'true');
                setResultsRugbyVisible(data.resultsRugbyVisible === 'true');
            })
            .catch(() => setSettingsError('Impossible de charger les paramètres'))
            .finally(() => setSettingsLoading(false));
    }, []);

    const toggleSetting = async (
        key: string,
        current: boolean,
        setter: (v: boolean) => void,
    ) => {
        const next = !current;
        setter(next);
        setSettingsError('');
        setSettingsSaved(false);
        try {
            const res = await apiFetch('/api/admin/settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ key, value: String(next) }),
            });
            if (!res.ok) throw new Error();
            setSettingsSaved(true);
            setTimeout(() => setSettingsSaved(false), 2000);
        } catch {
            setter(current);
            setSettingsError('Erreur lors de la sauvegarde');
        }
    };

    const toggleLogin = () => toggleSetting('loginEnabled', loginEnabled, setLoginEnabled);

    // Pour les résultats : demande confirmation avant d'activer (mais pas avant de désactiver)
    const handleRevealToggle = (key: string, current: boolean, setter: (v: boolean) => void) => {
        if (!current) {
            // On va activer → demander confirmation
            setConfirmReveal({ key, setter });
        } else {
            // On va désactiver → direct
            toggleSetting(key, current, setter);
        }
    };

    const confirmAndReveal = async () => {
        if (!confirmReveal) return;
        const { key, setter } = confirmReveal;
        setConfirmReveal(null);
        const current = key === 'resultsVideoVisible' ? resultsVideoVisible : resultsRugbyVisible;
        await toggleSetting(key, current, setter);
    };

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        try {
            const res = await apiFetch('/api/admin/users');
            const data = await res.json();
            setUsers(data);
        } catch {
            setError('Impossible de charger les utilisateurs');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchUsers(); }, [fetchUsers]);

    const openAddModal = () => { setEditingUser(null); setForm(emptyForm); setError(''); setShowModal(true); };

    const openEditModal = (user: User) => {
        setEditingUser(user);
        setForm({
            email: user.email, password: '',
            firstname: user.firstname ?? '', lastname: user.lastname ?? '',
            miage: user.miage ?? '', ville: user.ville ?? '',
            hotelRoom: user.hotelRoom, hotelFloor: user.hotelFloor ?? '',
            doorCode: user.doorCode ?? '',
            isAdmin: user.isAdmin,
            isJury: user.isJury,
        });
        setError('');
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingUser(null);
        setForm(emptyForm);
        setError('');
        setModalStep('form');
        setPendingEmailUser(null);
        setSendingEmail(false);
        setEmailSent(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');
        try {
            const url = editingUser ? `/api/admin/users/${editingUser.id}` : '/api/admin/users';
            const method = editingUser ? 'PUT' : 'POST';
            const body = editingUser && !form.password ? { ...form, password: undefined } : form;

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            if (!res.ok) {
                const data = await res.json();
                setError(data.error || 'Une erreur est survenue');
                return;
            }

            if (editingUser) {
                await fetchUsers();
                closeModal();
            } else {
                const created = await res.json();
                await fetchUsers();
                setPendingEmailUser({ id: created.id, email: created.email, firstname: created.firstname ?? '', password: form.password });
                setModalStep('email-confirm');
            }
        } catch {
            setError('Une erreur est survenue');
        } finally {
            setSubmitting(false);
        }
    };

    const handleUpdate = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        e.target.value = '';
        setUpdating(true);
        setUpdateResult(null);
        try {
            const formData = new FormData();
            formData.append('file', file);
            const res = await apiFetch('/api/admin/users/update', { method: 'POST', body: formData });
            const result = await res.json();
            setUpdateResult(result);
            await fetchUsers();
        } catch {
            setUpdateResult({ updated: 0, errors: [{ row: 0, email: '—', reason: 'Erreur réseau' }] });
        } finally {
            setUpdating(false);
        }
    };

    const handleSendWelcomeEmail = async () => {
        if (!pendingEmailUser) return;
        setSendingEmail(true);
        try {
            await fetch(`/api/admin/users/${pendingEmailUser.id}/send-welcome`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password: pendingEmailUser.password }),
            });
            setEmailSent(true);
        } catch {
            setEmailSent(true); // on ferme quand même
        } finally {
            setSendingEmail(false);
        }
    };

    const handleSendImportEmails = async () => {
        if (pendingImportEmails.length === 0) return;
        setSendingImportEmails(true);
        setEmailProgress({ sent: 0, total: pendingImportEmails.length, errors: [] });
        for (const user of pendingImportEmails) {
            try {
                await fetch(`/api/admin/users/${user.id}/send-welcome`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ password: user.password }),
                });
                setEmailProgress(prev => prev ? { ...prev, sent: prev.sent + 1 } : prev);
            } catch {
                setEmailProgress(prev => prev ? { ...prev, sent: prev.sent + 1, errors: [...prev.errors, user.email] } : prev);
            }
        }
        setSendingImportEmails(false);
        setPendingImportEmails([]);
    };

    const handleDelete = async (id: number) => {
        try {
            await fetch(`/api/admin/users/${id}`, { method: 'DELETE' });
            setDeleteConfirm(null);
            await fetchUsers();
        } catch {
            setError('Erreur lors de la suppression');
        }
    };

    const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        e.target.value = '';
        setImporting(true);
        setImportResult(null);
        setEmailProgress(null);
        setPendingImportEmails([]);
        try {
            const formData = new FormData();
            formData.append('file', file);
            const res = await apiFetch('/api/admin/users/import', { method: 'POST', body: formData });
            const result = await res.json();
            setImportResult(result);
            if (result.created?.length > 0) {
                setPendingImportEmails(result.created);
            }
            await fetchUsers();
        } catch {
            setImportResult({ success: 0, created: [], errors: [{ row: 0, email: '—', reason: 'Erreur réseau' }] });
        } finally {
            setImporting(false);
        }
    };

    const adminCount = users.filter(u => u.isAdmin).length;
    const juryCount = users.filter(u => u.isJury).length;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-0">

            {/* Paramètres */}
            <div className="mb-8 card-shadow glass-effect rounded-2xl border border-[#ff89b8]/20 p-5 sm:p-6 animate-fade-in">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#ff89b8] to-[#ef6a9f] flex items-center justify-center flex-shrink-0">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </div>
                    <h2 className="text-lg font-bold text-gray-800">Paramètres</h2>
                </div>
                {settingsError && <p className="text-red-500 text-xs mb-3 font-medium">{settingsError}</p>}
                {settingsSaved && <p className="text-green-600 text-xs mb-3 font-medium">Sauvegardé</p>}

                <div className="space-y-0 divide-y divide-[#ff89b8]/10 pt-2 border-t border-[#ff89b8]/15">
                    {([
                        { key: 'loginEnabled', label: 'Bouton de connexion', desc: 'Affiche ou masque le bouton "Se connecter" sur la page publique', value: loginEnabled, setter: setLoginEnabled, color: 'pink', onLabel: 'Ouvert', offLabel: 'Fermé', reveal: false },
                        { key: 'voteVideoOpen', label: '🎬 Vote Concours Vidéo', desc: 'Ouvre ou ferme le vote participants pour le concours vidéo', value: voteVideoOpen, setter: setVoteVideoOpen, color: 'purple', onLabel: 'Ouvert', offLabel: 'Fermé', reveal: false },
                        { key: 'voteRugbyOpen', label: '🏉 Vote Ballons de Rugby', desc: 'Ouvre ou ferme le vote participants pour le concours rugby', value: voteRugbyOpen, setter: setVoteRugbyOpen, color: 'purple', onLabel: 'Ouvert', offLabel: 'Fermé', reveal: false },
                        { key: 'resultsVideoVisible', label: '🎬 Résultats Vidéo', desc: 'Rend visibles les classements du concours vidéo pour tous les participants', value: resultsVideoVisible, setter: setResultsVideoVisible, color: 'amber', onLabel: 'Visible', offLabel: 'Masqué', reveal: true },
                        { key: 'resultsRugbyVisible', label: '🏉 Résultats Rugby', desc: 'Rend visibles les classements du concours rugby pour tous les participants', value: resultsRugbyVisible, setter: setResultsRugbyVisible, color: 'amber', onLabel: 'Visible', offLabel: 'Masqué', reveal: true },
                    ] as const).map(({ key, label, desc, value, setter, color, onLabel, offLabel, reveal }) => (
                        <div key={key} className="flex items-center justify-between gap-4 py-3.5">
                            <div>
                                <p className="text-gray-800 font-semibold text-sm">{label}</p>
                                <p className="text-gray-500 text-xs mt-0.5">{desc}</p>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                                <span className={`text-xs font-semibold ${settingsLoading ? 'text-gray-400' : value ? 'text-green-600' : 'text-gray-400'}`}>
                                    {settingsLoading ? '...' : value ? onLabel : offLabel}
                                </span>
                                <button
                                    onClick={() => reveal
                                        ? handleRevealToggle(key, value, setter as (v: boolean) => void)
                                        : toggleSetting(key, value, setter as (v: boolean) => void)
                                    }
                                    disabled={settingsLoading}
                                    className="relative flex-shrink-0 disabled:opacity-50"
                                >
                                    <div className={`w-12 h-6 rounded-full transition-colors duration-300 ${value
                                        ? color === 'purple' ? 'bg-gradient-to-r from-purple-400 to-purple-600'
                                        : color === 'amber' ? 'bg-gradient-to-r from-amber-400 to-orange-500'
                                        : 'bg-gradient-to-r from-[#ff89b8] to-[#ef6a9f]'
                                        : 'bg-gray-200'}`}>
                                        <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300 ${value ? 'translate-x-6' : 'translate-x-0'}`} />
                                    </div>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Accès rapide */}
            <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <Link
                    href="/app/admin/ateliers"
                    className="card-shadow glass-effect rounded-2xl border border-[#ff89b8]/20 p-5 flex items-center gap-4 hover:border-[#ff89b8]/50 hover:scale-[1.02] transition-all duration-200 group"
                >
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#ff89b8] to-[#ef6a9f] flex items-center justify-center flex-shrink-0 shadow-md group-hover:shadow-lg transition-shadow">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                        </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-gray-800 font-bold text-sm">Activités</p>
                        <p className="text-gray-500 text-xs mt-0.5">Gérer les groupes, activités et inscriptions</p>
                    </div>
                    <svg className="w-4 h-4 text-gray-400 group-hover:text-[#ef6a9f] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </Link>

                <Link
                    href="/app/admin/miages"
                    className="card-shadow glass-effect rounded-2xl border border-[#ff89b8]/20 p-5 flex items-center gap-4 hover:border-[#ff89b8]/50 hover:scale-[1.02] transition-all duration-200 group"
                >
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#ff89b8] to-[#ef6a9f] flex items-center justify-center flex-shrink-0 shadow-md group-hover:shadow-lg transition-shadow">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-gray-800 font-bold text-sm">Groupes MIAGE</p>
                        <p className="text-gray-500 text-xs mt-0.5">Configurer les villes qui participent aux concours</p>
                    </div>
                    <svg className="w-4 h-4 text-gray-400 group-hover:text-[#ef6a9f] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </Link>

                <a
                    href="/api/admin/votes/export"
                    download
                    className="card-shadow glass-effect rounded-2xl border border-purple-300/30 p-5 flex items-center gap-4 hover:border-purple-400/50 hover:scale-[1.02] transition-all duration-200 group"
                >
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-md group-hover:shadow-lg transition-shadow">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-gray-800 font-bold text-sm">Export des votes</p>
                        <p className="text-gray-500 text-xs mt-0.5">Télécharger tous les votes + résultats calculés (.xlsx)</p>
                    </div>
                    <svg className="w-4 h-4 text-gray-400 group-hover:text-purple-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </a>
            </div>

            {/* En-tête gestion utilisateurs */}
            <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3 sm:gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#ff89b8] to-[#ef6a9f] flex items-center justify-center flex-shrink-0 shadow-lg">
                        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold italic text-white drop-shadow-lg">
                        Gestion des utilisateurs
                    </h2>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    {/* Création en masse */}
                    <a
                        href="/api/admin/users/template"
                        download
                        className="flex items-center gap-2 bg-white/90 border border-[#ff89b8]/30 text-[#ef6a9f] font-semibold px-4 py-2.5 rounded-2xl hover:bg-white transition-all duration-200 text-sm shadow-sm"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Template création
                    </a>
                    <input ref={fileInputRef} type="file" accept=".xlsx,.xls,.csv" className="hidden" onChange={handleImport} />
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={importing}
                        className="flex items-center gap-2 bg-white/90 border border-[#ff89b8]/30 text-[#ef6a9f] font-semibold px-4 py-2.5 rounded-2xl hover:bg-white transition-all duration-200 text-sm shadow-sm disabled:opacity-50"
                    >
                        {importing ? (
                            <div className="w-4 h-4 border-2 border-[#ef6a9f]/30 border-t-[#ef6a9f] rounded-full animate-spin" />
                        ) : (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        )}
                        {importing ? 'Import...' : 'Importer Excel'}
                    </button>

                    {/* Mise à jour en masse */}
                    <a
                        href="/api/admin/users/template-update"
                        download
                        className="flex items-center gap-2 bg-white/90 border border-blue-200 text-blue-500 font-semibold px-4 py-2.5 rounded-2xl hover:bg-white transition-all duration-200 text-sm shadow-sm"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Template mise à jour
                    </a>
                    <input ref={updateFileInputRef} type="file" accept=".xlsx,.xls,.csv" className="hidden" onChange={handleUpdate} />
                    <button
                        onClick={() => updateFileInputRef.current?.click()}
                        disabled={updating}
                        className="flex items-center gap-2 bg-white/90 border border-blue-200 text-blue-500 font-semibold px-4 py-2.5 rounded-2xl hover:bg-white transition-all duration-200 text-sm shadow-sm disabled:opacity-50"
                    >
                        {updating ? (
                            <div className="w-4 h-4 border-2 border-blue-300 border-t-blue-500 rounded-full animate-spin" />
                        ) : (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                        )}
                        {updating ? 'Mise à jour...' : 'Mettre à jour'}
                    </button>

                    <button
                        onClick={openAddModal}
                        className="flex items-center gap-2 bg-gradient-to-r from-[#ff89b8] to-[#ef6a9f] text-white font-bold px-5 py-2.5 rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 text-sm"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Ajouter
                    </button>
                </div>
            </div>

            {/* Résultat import */}
            {importResult && (
                <div className="mb-6 card-shadow glass-effect rounded-2xl border border-[#ff89b8]/20 p-5 animate-fade-in">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <p className="text-gray-800 font-bold text-base mb-2">Résultat de l&apos;import</p>
                            <p className="text-gray-600 text-sm">
                                <span className="font-semibold text-green-600">{importResult.success} utilisateur{importResult.success > 1 ? 's' : ''} créé{importResult.success > 1 ? 's' : ''}</span>
                                {importResult.errors.length > 0 && (
                                    <span className="text-red-500 ml-3">{importResult.errors.length} erreur{importResult.errors.length > 1 ? 's' : ''}</span>
                                )}
                            </p>
                            {importResult.errors.length > 0 && (
                                <ul className="mt-3 space-y-1">
                                    {importResult.errors.map((e, i) => (
                                        <li key={i} className="text-xs text-red-500">Ligne {e.row} — {e.email} : {e.reason}</li>
                                    ))}
                                </ul>
                            )}
                        </div>
                        <button onClick={() => setImportResult(null)} className="p-1.5 rounded-lg hover:bg-[#ff89b8]/10 text-gray-400 hover:text-[#ef6a9f] transition-all flex-shrink-0">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}

            {/* Résultat mise à jour */}
            {updateResult && (
                <div className="mb-6 card-shadow glass-effect rounded-2xl border border-blue-100 p-5 animate-fade-in">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <p className="text-gray-800 font-bold text-base mb-2">Résultat de la mise à jour</p>
                            <p className="text-gray-600 text-sm">
                                <span className="font-semibold text-blue-600">{updateResult.updated} utilisateur{updateResult.updated > 1 ? 's' : ''} mis à jour</span>
                                {updateResult.errors.length > 0 && (
                                    <span className="text-red-500 ml-3">{updateResult.errors.length} erreur{updateResult.errors.length > 1 ? 's' : ''}</span>
                                )}
                            </p>
                            {updateResult.errors.length > 0 && (
                                <ul className="mt-3 space-y-1">
                                    {updateResult.errors.map((e, i) => (
                                        <li key={i} className="text-xs text-red-500">Ligne {e.row} — {e.email} : {e.reason}</li>
                                    ))}
                                </ul>
                            )}
                        </div>
                        <button onClick={() => setUpdateResult(null)} className="p-1.5 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-500 transition-all flex-shrink-0">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}

            {/* Envoi emails import – confirmation */}
            {pendingImportEmails.length > 0 && !emailProgress && (
                <div className="mb-6 card-shadow glass-effect rounded-2xl border border-[#ff89b8]/20 p-5 animate-fade-in">
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <p className="text-gray-800 font-bold text-base">Envoyer les emails de bienvenue</p>
                            <p className="text-gray-500 text-sm mt-0.5">
                                {pendingImportEmails.length} utilisateur{pendingImportEmails.length > 1 ? 's' : ''} créé{pendingImportEmails.length > 1 ? 's' : ''}
                            </p>
                        </div>
                        <div className="flex gap-2 flex-shrink-0">
                            <button
                                onClick={() => setPendingImportEmails([])}
                                className="px-4 py-2 rounded-xl border border-gray-200 text-gray-500 text-sm font-semibold hover:bg-gray-50 transition-all"
                            >
                                Ignorer
                            </button>
                            <button
                                onClick={handleSendImportEmails}
                                disabled={sendingImportEmails}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#ff89b8] to-[#ef6a9f] text-white text-sm font-bold shadow hover:shadow-md hover:scale-105 transition-all disabled:opacity-50"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                Envoyer les emails
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Envoi emails import – progress bar */}
            {emailProgress && (
                <div className="mb-6 card-shadow glass-effect rounded-2xl border border-[#ff89b8]/20 p-5 animate-fade-in">
                    <div className="flex items-center justify-between mb-3">
                        <p className="text-gray-800 font-bold text-base">
                            {sendingImportEmails ? 'Envoi des emails...' : 'Emails envoyés'}
                        </p>
                        <span className="text-sm font-semibold text-[#ef6a9f]">{emailProgress.sent} / {emailProgress.total}</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                        <div
                            className="h-3 rounded-full bg-gradient-to-r from-[#ff89b8] to-[#ef6a9f] transition-all duration-300"
                            style={{ width: `${Math.round((emailProgress.sent / emailProgress.total) * 100)}%` }}
                        />
                    </div>
                    {!sendingImportEmails && (
                        <div className="mt-3 flex items-center justify-between">
                            <p className="text-sm">
                                {emailProgress.errors.length === 0
                                    ? <span className="text-green-600 font-semibold">Tous les emails ont été envoyés ✓</span>
                                    : <span className="text-orange-500">{emailProgress.errors.length} échec{emailProgress.errors.length > 1 ? 's' : ''}</span>
                                }
                            </p>
                            <button onClick={() => setEmailProgress(null)} className="text-xs text-gray-400 hover:text-gray-600 transition-colors">Fermer</button>
                        </div>
                    )}
                </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="card-shadow glass-effect rounded-2xl border border-[#ff89b8]/20 p-4 sm:p-6 text-center animate-fade-in">
                    <p className="text-gray-500 text-xs sm:text-sm font-semibold uppercase tracking-widest mb-1">Total</p>
                    <p className="text-[#ef6a9f] text-4xl sm:text-5xl font-extrabold">{users.length}</p>
                </div>
                <div className="card-shadow glass-effect rounded-2xl border border-[#ff89b8]/20 p-4 sm:p-6 text-center animate-fade-in">
                    <p className="text-gray-500 text-xs sm:text-sm font-semibold uppercase tracking-widest mb-1">Admins</p>
                    <p className="text-[#ef6a9f] text-4xl sm:text-5xl font-extrabold">{adminCount}</p>
                </div>
                <div className="card-shadow glass-effect rounded-2xl border border-[#ff89b8]/20 p-4 sm:p-6 text-center animate-fade-in">
                    <p className="text-gray-500 text-xs sm:text-sm font-semibold uppercase tracking-widest mb-1">Jury</p>
                    <p className="text-purple-500 text-4xl sm:text-5xl font-extrabold">{juryCount}</p>
                </div>
            </div>

            {/* Tableau */}
            <div className="card-shadow glass-effect rounded-2xl sm:rounded-3xl border border-[#ff89b8]/20 overflow-hidden animate-fade-in">
                {loading ? (
                    <div className="flex items-center justify-center py-16">
                        <div className="w-8 h-8 border-4 border-[#ff89b8]/30 border-t-[#ef6a9f] rounded-full animate-spin" />
                    </div>
                ) : users.length === 0 ? (
                    <div className="text-center py-16 text-gray-400">
                        <svg className="w-12 h-12 mx-auto mb-3 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Aucun utilisateur
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-[#ff89b8]/20 bg-[#fff0f6]">
                                    <th className="text-left px-4 sm:px-6 py-3.5 text-[#ef6a9f] font-bold uppercase tracking-widest text-xs">Nom</th>
                                    <th className="text-left px-4 sm:px-6 py-3.5 text-[#ef6a9f] font-bold uppercase tracking-widest text-xs">Email</th>
                                    <th className="hidden md:table-cell text-left px-4 sm:px-6 py-3.5 text-[#ef6a9f] font-bold uppercase tracking-widest text-xs">Ville</th>
                                    <th className="hidden lg:table-cell text-left px-4 sm:px-6 py-3.5 text-[#ef6a9f] font-bold uppercase tracking-widest text-xs">Chambre</th>
                                    <th className="hidden lg:table-cell text-left px-4 sm:px-6 py-3.5 text-[#ef6a9f] font-bold uppercase tracking-widest text-xs">Code porte</th>
                                    <th className="text-left px-4 sm:px-6 py-3.5 text-[#ef6a9f] font-bold uppercase tracking-widest text-xs">Rôle</th>
                                    <th className="px-4 sm:px-6 py-3.5" />
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user, i) => (
                                    <tr key={user.id} className="border-b border-[#ff89b8]/10 hover:bg-[#fff0f6]/60 transition-colors duration-150" style={{ animationDelay: `${i * 0.05}s` }}>
                                        <td className="px-4 sm:px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#ff89b8] to-[#ef6a9f] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                                                    {(user.firstname?.[0] ?? user.email[0]).toUpperCase()}
                                                </div>
                                                <span className="text-gray-800 font-semibold truncate max-w-[120px]">
                                                    {user.firstname || user.lastname ? `${user.firstname ?? ''} ${user.lastname ?? ''}`.trim() : '—'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-4 sm:px-6 py-4 text-gray-600 truncate max-w-[160px]">{user.email}</td>
                                        <td className="hidden md:table-cell px-4 sm:px-6 py-4 text-gray-600">{user.ville || <span className="text-gray-300">—</span>}</td>
                                        <td className="hidden lg:table-cell px-4 sm:px-6 py-4 text-gray-600">{user.hotelRoom || <span className="text-gray-300">—</span>}</td>
                                        <td className="hidden lg:table-cell px-4 sm:px-6 py-4 text-gray-700 font-mono font-medium">{user.doorCode || <span className="text-gray-300">—</span>}</td>
                                        <td className="px-4 sm:px-6 py-4">
                                            {user.isAdmin ? (
                                                <span className="inline-flex items-center bg-gradient-to-r from-[#ff89b8]/20 to-[#ef6a9f]/20 text-[#ef6a9f] text-xs font-bold px-3 py-1 rounded-full border border-[#ff89b8]/40">Admin</span>
                                            ) : (
                                                <span className="inline-flex items-center bg-gray-100 text-gray-500 text-xs font-semibold px-3 py-1 rounded-full">Utilisateur</span>
                                            )}
                                        </td>
                                        <td className="px-4 sm:px-6 py-4">
                                            {deleteConfirm === user.id ? (
                                                <div className="flex items-center gap-2">
                                                    <button onClick={() => handleDelete(user.id)} className="text-xs bg-red-500 text-white px-3 py-1.5 rounded-lg hover:bg-red-600 transition-colors font-semibold">Confirmer</button>
                                                    <button onClick={() => setDeleteConfirm(null)} className="text-xs text-gray-400 hover:text-gray-600 transition-colors">Annuler</button>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2 justify-end">
                                                    <button onClick={() => openEditModal(user)} className="p-2 rounded-lg text-gray-400 hover:text-[#ef6a9f] hover:bg-[#ff89b8]/10 transition-all" title="Modifier">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                    </button>
                                                    <button onClick={() => setDeleteConfirm(user.id)} className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all" title="Supprimer">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Modale de confirmation dévoilement résultats */}
            {confirmReveal && mounted && createPortal(
                <div className="fixed inset-0 flex items-center justify-center p-4" style={{ zIndex: 10001 }}>
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setConfirmReveal(null)} />
                    <div className="relative glass-effect border border-amber-300/40 rounded-3xl shadow-2xl w-full max-w-md animate-fade-in">
                        <div className="p-7 text-center">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mx-auto mb-5 shadow-lg">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-3">Dévoiler les résultats ?</h3>
                            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6 text-left">
                                <p className="text-amber-800 text-sm font-semibold mb-1">⚠️ Attention</p>
                                <p className="text-amber-700 text-sm leading-relaxed">
                                    Ces données seront présentées durant le gala. Une fois les résultats visibles, tous les participants pourront les consulter immédiatement.
                                </p>
                            </div>
                            <p className="text-gray-500 text-sm mb-6">Êtes-vous sûr de vouloir rendre les classements publics maintenant ?</p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setConfirmReveal(null)}
                                    className="flex-1 py-3 rounded-2xl border border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 transition-all text-sm"
                                >
                                    Annuler
                                </button>
                                <button
                                    onClick={confirmAndReveal}
                                    className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 text-white font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all text-sm"
                                >
                                    Oui, dévoiler
                                </button>
                            </div>
                        </div>
                    </div>
                </div>,
                document.body
            )}

            {/* Modal */}
            {showModal && mounted && createPortal(
                <div className="fixed inset-0 flex items-center justify-center p-4" style={{ zIndex: 10000 }}>
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={closeModal} />
                    <div className="relative glass-effect border border-[#ff89b8]/20 rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-fade-in">
                        <div className="p-6 sm:p-8">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold text-gray-800">
                                    {editingUser ? 'Modifier l\'utilisateur' : 'Nouvel utilisateur'}
                                </h3>
                                <button onClick={closeModal} className="p-2 rounded-xl hover:bg-[#ff89b8]/10 text-gray-400 hover:text-[#ef6a9f] transition-all">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            {modalStep === 'email-confirm' && pendingEmailUser ? (
                                <div className="text-center py-2">
                                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#ff89b8] to-[#ef6a9f] flex items-center justify-center mx-auto mb-4 shadow-lg">
                                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    {emailSent ? (
                                        <>
                                            <p className="text-green-600 font-bold text-lg mb-1">Email envoyé !</p>
                                            <p className="text-gray-500 text-sm mb-6">Les identifiants ont été envoyés à <span className="font-semibold text-gray-700">{pendingEmailUser.email}</span></p>
                                            <button onClick={closeModal} className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#ff89b8] to-[#ef6a9f] text-white font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all">
                                                Fermer
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <p className="text-gray-800 font-bold text-lg mb-1">Utilisateur créé ✓</p>
                                            <p className="text-gray-500 text-sm mb-6">
                                                Envoyer un email de bienvenue avec ses identifiants à <span className="font-semibold text-gray-700">{pendingEmailUser.email}</span> ?
                                            </p>
                                            <div className="flex gap-3">
                                                <button type="button" onClick={closeModal} className="flex-1 py-3 rounded-2xl border border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 transition-all">
                                                    Ignorer
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={handleSendWelcomeEmail}
                                                    disabled={sendingEmail}
                                                    className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-[#ff89b8] to-[#ef6a9f] text-white font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2"
                                                >
                                                    {sendingEmail
                                                        ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                        : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                                                    }
                                                    {sendingEmail ? 'Envoi...' : "Envoyer l'email"}
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            ) : (
                            <>
                            {error && (
                                <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">{error}</div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <Field label="Prénom" value={form.firstname} onChange={v => setForm(f => ({ ...f, firstname: v }))} />
                                    <Field label="Nom" value={form.lastname} onChange={v => setForm(f => ({ ...f, lastname: v }))} />
                                </div>
                                <Field label="Email *" type="email" value={form.email} onChange={v => setForm(f => ({ ...f, email: v }))} required />
                                <Field
                                    label={editingUser ? 'Nouveau mot de passe (laisser vide pour ne pas changer)' : 'Mot de passe *'}
                                    type="password"
                                    value={form.password}
                                    onChange={v => setForm(f => ({ ...f, password: v }))}
                                    required={!editingUser}
                                />
                                <div className="grid grid-cols-2 gap-4">
                                    <Field label="Ville" value={form.ville} onChange={v => setForm(f => ({ ...f, ville: v }))} />
                                    <Field label="MIAGE" value={form.miage} onChange={v => setForm(f => ({ ...f, miage: v }))} />
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    <Field label="N° chambre" value={form.hotelRoom} onChange={v => setForm(f => ({ ...f, hotelRoom: v }))} />
                                    <Field label="Étage" value={form.hotelFloor} onChange={v => setForm(f => ({ ...f, hotelFloor: v }))} />
                                    <Field label="Code porte" value={form.doorCode} onChange={v => setForm(f => ({ ...f, doorCode: v }))} />
                                </div>
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <div className="relative">
                                        <input type="checkbox" className="sr-only" checked={form.isAdmin} onChange={e => setForm(f => ({ ...f, isAdmin: e.target.checked }))} />
                                        <div className={`w-11 h-6 rounded-full transition-colors duration-300 ${form.isAdmin ? 'bg-gradient-to-r from-[#ff89b8] to-[#ef6a9f]' : 'bg-gray-200'}`}>
                                            <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300 ${form.isAdmin ? 'translate-x-5' : 'translate-x-0'}`} />
                                        </div>
                                    </div>
                                    <span className="text-gray-700 font-medium text-sm">Administrateur</span>
                                </label>
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <div className="relative">
                                        <input type="checkbox" className="sr-only" checked={form.isJury} onChange={e => setForm(f => ({ ...f, isJury: e.target.checked }))} />
                                        <div className={`w-11 h-6 rounded-full transition-colors duration-300 ${form.isJury ? 'bg-gradient-to-r from-purple-400 to-purple-600' : 'bg-gray-200'}`}>
                                            <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300 ${form.isJury ? 'translate-x-5' : 'translate-x-0'}`} />
                                        </div>
                                    </div>
                                    <span className="text-gray-700 font-medium text-sm">Membre du jury ✨</span>
                                </label>

                                <div className="flex gap-3 pt-2">
                                    <button type="button" onClick={closeModal} className="flex-1 py-3 rounded-2xl border border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 transition-all">Annuler</button>
                                    <button type="submit" disabled={submitting} className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-[#ff89b8] to-[#ef6a9f] text-white font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:scale-100">
                                        {submitting ? 'Enregistrement...' : editingUser ? 'Modifier' : 'Créer'}
                                    </button>
                                </div>
                            </form>
                            </>
                            )}
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
}

function Field({ label, value, onChange, type = 'text', required = false }: {
    label: string; value: string; onChange: (v: string) => void; type?: string; required?: boolean;
}) {
    return (
        <div>
            <label className="block text-gray-500 text-xs font-semibold uppercase tracking-widest mb-1.5">{label}</label>
            <input
                type={type}
                value={value}
                onChange={e => onChange(e.target.value)}
                required={required}
                className="w-full px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-800 placeholder-gray-300 focus:outline-none focus:border-[#ff89b8] focus:ring-2 focus:ring-[#ff89b8]/20 transition-all text-sm"
            />
        </div>
    );
}
