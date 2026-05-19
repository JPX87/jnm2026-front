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
};

type ImportResult = {
    success: number;
    errors: { row: number; email: string; reason: string }[];
};

const emptyForm: UserFormData = {
    email: '', password: '', firstname: '', lastname: '',
    miage: '', ville: '', hotelRoom: '', hotelFloor: '', doorCode: '', isAdmin: false,
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
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [mounted, setMounted] = useState(false);
    const [loginEnabled, setLoginEnabled] = useState(true);
    const [settingsLoading, setSettingsLoading] = useState(true);
    const [settingsError, setSettingsError] = useState('');
    const [settingsSaved, setSettingsSaved] = useState(false);

    useEffect(() => { setMounted(true); }, []);

    useEffect(() => {
        apiFetch('/api/admin/settings')
            .then(r => r.json())
            .then(data => {
                if (data.error) throw new Error(data.error);
                setLoginEnabled(data.loginEnabled === 'true');
            })
            .catch(() => setSettingsError('Impossible de charger les paramètres'))
            .finally(() => setSettingsLoading(false));
    }, []);

    const toggleLogin = async () => {
        const prev = loginEnabled;
        const next = !loginEnabled;
        setLoginEnabled(next);
        setSettingsError('');
        setSettingsSaved(false);
        try {
            const res = await apiFetch('/api/admin/settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ key: 'loginEnabled', value: String(next) }),
            });
            if (!res.ok) throw new Error();
            setSettingsSaved(true);
            setTimeout(() => setSettingsSaved(false), 2000);
        } catch {
            setLoginEnabled(prev);
            setSettingsError('Erreur lors de la sauvegarde');
        }
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
        });
        setError('');
        setShowModal(true);
    };

    const closeModal = () => { setShowModal(false); setEditingUser(null); setForm(emptyForm); setError(''); };

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
            await fetchUsers();
            closeModal();
        } catch {
            setError('Une erreur est survenue');
        } finally {
            setSubmitting(false);
        }
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
        try {
            const formData = new FormData();
            formData.append('file', file);
            const res = await apiFetch('/api/admin/users/import', { method: 'POST', body: formData });
            const result = await res.json();
            setImportResult(result);
            await fetchUsers();
        } catch {
            setImportResult({ success: 0, errors: [{ row: 0, email: '—', reason: 'Erreur réseau' }] });
        } finally {
            setImporting(false);
        }
    };

    const adminCount = users.filter(u => u.isAdmin).length;

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
                <div className="flex items-center justify-between gap-4 pt-4 border-t border-[#ff89b8]/15">
                    <div>
                        <p className="text-gray-800 font-semibold text-sm">Bouton de connexion</p>
                        <p className="text-gray-500 text-xs mt-0.5">Affiche ou masque le bouton &quot;Se connecter&quot; sur la page d&apos;accueil publique</p>
                        {settingsError && <p className="text-red-500 text-xs mt-1 font-medium">{settingsError}</p>}
                        {settingsSaved && <p className="text-green-600 text-xs mt-1 font-medium">Sauvegardé</p>}
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                        <span className={`text-xs font-semibold ${settingsLoading ? 'text-gray-400' : loginEnabled ? 'text-green-600' : 'text-gray-400'}`}>
                            {settingsLoading ? 'Chargement...' : loginEnabled ? 'Activé' : 'Désactivé'}
                        </span>
                        <button
                            onClick={toggleLogin}
                            disabled={settingsLoading}
                            className="relative flex-shrink-0 disabled:opacity-50"
                            aria-label="Activer/désactiver le bouton de connexion"
                        >
                            <div className={`w-12 h-6 rounded-full transition-colors duration-300 ${loginEnabled ? 'bg-gradient-to-r from-[#ff89b8] to-[#ef6a9f]' : 'bg-gray-200'}`}>
                                <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300 ${loginEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
                            </div>
                        </button>
                    </div>
                </div>
            </div>

            {/* Accès rapide */}
            <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link
                    href="/app/admin/roundtables"
                    className="card-shadow glass-effect rounded-2xl border border-[#ff89b8]/20 p-5 flex items-center gap-4 hover:border-[#ff89b8]/50 hover:scale-[1.02] transition-all duration-200 group"
                >
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#ff89b8] to-[#ef6a9f] flex items-center justify-center flex-shrink-0 shadow-md group-hover:shadow-lg transition-shadow">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-gray-800 font-bold text-sm">Tables rondes</p>
                        <p className="text-gray-500 text-xs mt-0.5">Gérer les inscriptions et le statut</p>
                    </div>
                    <svg className="w-4 h-4 text-gray-400 group-hover:text-[#ef6a9f] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </Link>
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
                    <a
                        href="/api/admin/users/template"
                        download
                        className="flex items-center gap-2 bg-white/90 border border-[#ff89b8]/30 text-[#ef6a9f] font-semibold px-4 py-2.5 rounded-2xl hover:bg-white transition-all duration-200 text-sm shadow-sm"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Template Excel
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

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="card-shadow glass-effect rounded-2xl border border-[#ff89b8]/20 p-4 sm:p-6 text-center animate-fade-in">
                    <p className="text-gray-500 text-xs sm:text-sm font-semibold uppercase tracking-widest mb-1">Total</p>
                    <p className="text-[#ef6a9f] text-4xl sm:text-5xl font-extrabold">{users.length}</p>
                </div>
                <div className="card-shadow glass-effect rounded-2xl border border-[#ff89b8]/20 p-4 sm:p-6 text-center animate-fade-in">
                    <p className="text-gray-500 text-xs sm:text-sm font-semibold uppercase tracking-widest mb-1">Admins</p>
                    <p className="text-[#ef6a9f] text-4xl sm:text-5xl font-extrabold">{adminCount}</p>
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

                                <div className="flex gap-3 pt-2">
                                    <button type="button" onClick={closeModal} className="flex-1 py-3 rounded-2xl border border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 transition-all">Annuler</button>
                                    <button type="submit" disabled={submitting} className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-[#ff89b8] to-[#ef6a9f] text-white font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:scale-100">
                                        {submitting ? 'Enregistrement...' : editingUser ? 'Modifier' : 'Créer'}
                                    </button>
                                </div>
                            </form>
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
