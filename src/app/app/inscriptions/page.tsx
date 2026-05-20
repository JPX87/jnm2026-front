'use client';
import { apiFetch } from '@/lib/clientFetch';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import React from 'react';

type Speaker = { id: number; name: string; role: string | null; company: string | null; linkedinUrl: string | null };
type ActivityItem = {
    id: number; title: string; description: string | null; maxSeats: number | null; order: number;
    speakers: Speaker[]; registrationCount: number; isRegistered: boolean; isFull: boolean;
};
type Group = {
    id: number; title: string; description: string | null; isOpen: boolean;
    maxPerUser: number; order: number;
    activities: ActivityItem[];
    userRegistrationCount: number;
};

export default function InscriptionsPage() {
    const [groups, setGroups] = useState<Group[]>([]);
    const [loading, setLoading] = useState(true);
    const [pending, setPending] = useState<number | null>(null);
    const [error, setError] = useState('');
    const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => { setMounted(true); }, []);

    useEffect(() => {
        apiFetch('/api/activities')
            .then(r => r.json())
            .then(data => setGroups(data.groups ?? []))
            .catch(() => setError('Impossible de charger les activités'))
            .finally(() => setLoading(false));
    }, []);

    // Sync selectedGroup avec les données fraîches
    useEffect(() => {
        if (selectedGroup) {
            const updated = groups.find(g => g.id === selectedGroup.id);
            if (updated) setSelectedGroup(updated);
        }
    }, [groups]);

    const handleRegister = async (activityId: number, groupId: number) => {
        setPending(activityId);
        setError('');
        try {
            const res = await fetch(`/api/activities/${activityId}/register`, { method: 'POST' });
            const data = await res.json();
            if (!res.ok) { setError(data.error || 'Erreur'); setPending(null); return; }
            setGroups(prev => prev.map(g => {
                if (g.id !== groupId) return g;
                const newActivities = g.activities.map(a => {
                    if (a.id !== activityId) return a;
                    const newCount = data.registered ? a.registrationCount + 1 : a.registrationCount - 1;
                    return { ...a, isRegistered: data.registered, registrationCount: newCount, isFull: a.maxSeats !== null && newCount >= a.maxSeats };
                });
                const newUserCount = newActivities.filter(a => a.isRegistered).length;
                return { ...g, activities: newActivities, userRegistrationCount: newUserCount };
            }));
        } catch {
            setError('Erreur réseau');
        } finally {
            setPending(null);
        }
    };

    const totalRegistrations = groups.reduce((s, g) => s + g.userRegistrationCount, 0);

    return (
        <div className="max-w-2xl mx-auto px-4 sm:px-0">
            {/* Header */}
            <div className="mb-6 sm:mb-8 flex items-center gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#ff89b8] to-[#ef6a9f] flex items-center justify-center flex-shrink-0 shadow-lg">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 8l2 2 4-4" />
                    </svg>
                </div>
                <div>
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold italic text-white drop-shadow-lg">Mes inscriptions</h1>
                    <p className="text-white/70 text-sm mt-0.5">
                        {totalRegistrations > 0
                            ? `${totalRegistrations} inscription${totalRegistrations > 1 ? 's' : ''} au total`
                            : 'Découvrez et inscrivez-vous aux activités'}
                    </p>
                </div>
            </div>

            {error && <div className="mb-4 px-4 py-3 bg-red-500/15 border border-red-400/30 text-red-300 rounded-xl text-sm">{error}</div>}

            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="w-8 h-8 border-4 border-[#ff89b8]/30 border-t-[#ef6a9f] rounded-full animate-spin" />
                </div>
            ) : groups.length === 0 ? (
                <div className="card-shadow glass-effect rounded-2xl border border-[#ff89b8]/20 p-10 text-center">
                    <p className="text-gray-500 font-semibold">Aucune activité disponible pour le moment.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {groups.map(group => (
                        <button
                            key={group.id}
                            onClick={() => setSelectedGroup(group)}
                            className="text-left card-shadow glass-effect rounded-2xl border border-[#ff89b8]/20 p-5 transition-all duration-200 hover:border-[#ff89b8]/50 hover:shadow-lg hover:scale-[1.02] active:scale-[0.99] focus:outline-none"
                        >
                            {/* Statut + badge max */}
                            <div className="flex items-center justify-between gap-2 mb-3">
                                <div className="flex items-center gap-1.5">
                                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${group.isOpen ? 'bg-green-400 animate-pulse' : 'bg-gray-300'}`} />
                                    <span className={`text-xs font-semibold ${group.isOpen ? 'text-green-500' : 'text-gray-400'}`}>
                                        {group.isOpen ? 'Ouvertes' : 'Fermées'}
                                    </span>
                                </div>
                                {group.maxPerUser === 1 && (
                                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#ff89b8]/10 text-[#ef6a9f]">1 choix max</span>
                                )}
                                {group.maxPerUser > 1 && (
                                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#ff89b8]/10 text-[#ef6a9f]">{group.maxPerUser} choix max</span>
                                )}
                            </div>

                            {/* Titre */}
                            <h2 className="text-gray-800 font-extrabold text-base leading-snug mb-1">{group.title}</h2>

                            {group.description && (
                                <p className="text-gray-400 text-xs leading-relaxed mb-3 line-clamp-2">{group.description}</p>
                            )}

                            {/* Footer : nb activités + mes inscriptions */}
                            <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                                <span className="text-gray-400 text-xs">
                                    {group.activities.length} activité{group.activities.length > 1 ? 's' : ''}
                                </span>
                                <div className="flex items-center gap-2">
                                    {group.userRegistrationCount > 0 && (
                                        <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#ff89b8]/15 text-[#ef6a9f]">
                                            <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                            {group.userRegistrationCount} inscrit{group.userRegistrationCount > 1 ? 's' : ''}
                                        </span>
                                    )}
                                    <span className="flex items-center justify-center w-7 h-7 rounded-full bg-[#ff89b8]/10 text-[#ef6a9f]">
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </span>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            )}

            {/* Modal détail groupe */}
            {mounted && selectedGroup && createPortal(
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
                    style={{ zIndex: 10000 }}
                    onClick={e => { if (e.target === e.currentTarget) setSelectedGroup(null); }}
                >
                    <div className="bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
                        {/* Header modal */}
                        <div className={`px-6 py-5 flex items-start justify-between gap-3 flex-shrink-0 ${selectedGroup.isOpen ? 'bg-gradient-to-r from-[#ff89b8] to-[#ef6a9f]' : 'bg-gray-100'}`}>
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <div className={`w-2 h-2 rounded-full ${selectedGroup.isOpen ? 'bg-white animate-pulse' : 'bg-gray-400'}`} />
                                    <span className={`text-xs font-semibold ${selectedGroup.isOpen ? 'text-white/80' : 'text-gray-500'}`}>
                                        {selectedGroup.isOpen ? 'Inscriptions ouvertes' : 'Inscriptions fermées'}
                                    </span>
                                    {selectedGroup.maxPerUser > 0 && (
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${selectedGroup.isOpen ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-500'}`}>
                                            {selectedGroup.maxPerUser === 1 ? '1 choix max' : `${selectedGroup.maxPerUser} choix max`}
                                        </span>
                                    )}
                                </div>
                                <h2 className={`font-extrabold text-xl leading-tight ${selectedGroup.isOpen ? 'text-white' : 'text-gray-700'}`}>
                                    {selectedGroup.title}
                                </h2>
                                {selectedGroup.description && (
                                    <p className={`text-sm mt-1 ${selectedGroup.isOpen ? 'text-white/75' : 'text-gray-500'}`}>{selectedGroup.description}</p>
                                )}
                            </div>
                            <button
                                onClick={() => setSelectedGroup(null)}
                                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all ${selectedGroup.isOpen ? 'bg-white/20 hover:bg-white/30 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-500'}`}
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Liste des activités */}
                        <div className="overflow-y-auto flex-1 p-4 space-y-3">
                            {error && <div className="px-4 py-3 bg-red-50 border border-red-200 text-red-500 rounded-xl text-sm">{error}</div>}

                            {selectedGroup.activities.map(activity => {
                                const atLimit = selectedGroup.maxPerUser > 0 && selectedGroup.userRegistrationCount >= selectedGroup.maxPerUser && !activity.isRegistered;
                                const canRegister = selectedGroup.isOpen && !activity.isFull && !atLimit;
                                const showBtn = activity.isRegistered || canRegister || (selectedGroup.isOpen && atLimit);

                                return (
                                    <div
                                        key={activity.id}
                                        className={`rounded-2xl border p-4 transition-all duration-200 ${activity.isRegistered ? 'border-[#ff89b8]/40 bg-[#fff5f9]' : 'border-gray-100 bg-white'}`}
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex-1 min-w-0">
                                                {/* Badges */}
                                                <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                                                    {activity.isRegistered && (
                                                        <span className="inline-flex items-center gap-1 bg-[#ff89b8]/20 text-[#ef6a9f] text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#ff89b8]/30">
                                                            <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                                            Inscrit
                                                        </span>
                                                    )}
                                                    {activity.isFull && !activity.isRegistered && (
                                                        <span className="inline-flex items-center bg-red-50 text-red-400 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-red-100">Complet</span>
                                                    )}
                                                </div>

                                                <h3 className="text-gray-800 font-bold text-sm leading-snug mb-1">{activity.title}</h3>

                                                {activity.description && (
                                                    <p className="text-gray-400 text-xs mb-2 leading-relaxed">{activity.description}</p>
                                                )}

                                                {/* Intervenants */}
                                                {activity.speakers.length > 0 && (
                                                    <div className="flex flex-wrap gap-1.5 mt-2">
                                                        {activity.speakers.map(s => (
                                                            <div key={s.id} className="flex items-center gap-1.5 bg-gray-50 border border-gray-100 rounded-xl px-2.5 py-1.5">
                                                                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#ff89b8] to-[#ef6a9f] flex items-center justify-center flex-shrink-0">
                                                                    <span className="text-white text-[8px] font-bold">{s.name.charAt(0)}</span>
                                                                </div>
                                                                <div>
                                                                    <p className="text-gray-700 font-semibold text-xs leading-tight">{s.name}</p>
                                                                    {(s.role || s.company) && (
                                                                        <p className="text-gray-400 text-[10px] leading-tight">{[s.role, s.company].filter(Boolean).join(' · ')}</p>
                                                                    )}
                                                                </div>
                                                                {s.linkedinUrl && (
                                                                    <a href={s.linkedinUrl} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} className="ml-1 text-[#0a66c2] hover:opacity-70 flex-shrink-0">
                                                                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                                                                    </a>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}

                                                {/* Jauge places */}
                                                {activity.maxSeats !== null && (
                                                    <div className="mt-2.5 flex items-center gap-2">
                                                        <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden max-w-[120px]">
                                                            <div
                                                                className={`h-full rounded-full transition-all ${activity.isFull ? 'bg-red-400' : 'bg-gradient-to-r from-[#ff89b8] to-[#ef6a9f]'}`}
                                                                style={{ width: `${Math.min(100, (activity.registrationCount / activity.maxSeats) * 100)}%` }}
                                                            />
                                                        </div>
                                                        <span className="text-gray-400 text-xs">{activity.registrationCount}/{activity.maxSeats} places</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Bouton inscription */}
                                            {showBtn && (
                                                <button
                                                    onClick={() => handleRegister(activity.id, selectedGroup.id)}
                                                    disabled={pending === activity.id || atLimit}
                                                    title={atLimit ? `Maximum ${selectedGroup.maxPerUser} choix dans ce groupe` : undefined}
                                                    className={`flex-shrink-0 mt-1 px-3 py-2 rounded-xl font-semibold text-sm transition-all duration-200 ${
                                                        activity.isRegistered
                                                            ? 'border border-[#ff89b8]/40 text-[#ef6a9f] hover:bg-red-50 hover:border-red-200 hover:text-red-500'
                                                            : atLimit
                                                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed text-xs'
                                                                : 'bg-gradient-to-r from-[#ff89b8] to-[#ef6a9f] text-white shadow-md hover:shadow-lg hover:scale-105'
                                                    }`}
                                                >
                                                    {pending === activity.id
                                                        ? <div className="w-4 h-4 border-2 border-current/40 border-t-current rounded-full animate-spin" />
                                                        : activity.isRegistered ? 'Se désinscrire'
                                                        : atLimit ? '1 max'
                                                        : "S'inscrire"}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Footer modal */}
                        <div className="flex-shrink-0 border-t border-gray-100 px-5 py-4">
                            <button
                                onClick={() => setSelectedGroup(null)}
                                className="w-full py-3 rounded-xl border border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50 transition-all"
                            >
                                Fermer
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
}
