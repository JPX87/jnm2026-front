'use client';
import { apiFetch } from '@/lib/clientFetch';
import { useEffect, useState, useCallback, useRef } from 'react';

const CONTESTS = {
    video: { label: 'Concours Vidéo' },
    rugby: { label: 'Ballons de Rugby' },
} as const;
type ContestKey = keyof typeof CONTESTS;

const RANK_STYLES = [
    { border: 'border-yellow-400', bg: 'bg-yellow-50', text: 'text-yellow-700', badge: '🥇', label: '1er' },
    { border: 'border-gray-300', bg: 'bg-gray-50', text: 'text-gray-600', badge: '🥈', label: '2ème' },
    { border: 'border-amber-500', bg: 'bg-amber-50', text: 'text-amber-700', badge: '🥉', label: '3ème' },
];

type ResultCity = { city: string; participantScore: number; juryScore: number; finalScore: number };

type VoteData = {
    results: ResultCity[];
    groups: string[];
    hasVoted: boolean;
    myVote: { first: string; second: string; third: string } | null;
    isJury: boolean;
    userCity: string | null;
    totalVotes: number | null;
    totalJuryVotes: number | null;
    voteOpen: boolean;
    resultsVisible: boolean;
};

export default function VotesPage() {
    const [activeTab, setActiveTab] = useState<ContestKey>('video');
    const [data, setData] = useState<Partial<Record<ContestKey, VoteData>>>({});
    const [loadingTabs, setLoadingTabs] = useState<Set<ContestKey>>(new Set(['video', 'rugby']));
    const [selections, setSelections] = useState<(string | null)[]>([null, null, null]);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const fetchContest = useCallback(async (contest: ContestKey, silent = false) => {
        if (!silent) setLoadingTabs(prev => new Set([...prev, contest]));
        try {
            const res = await apiFetch(`/api/votes/${contest}`);
            const json = await res.json() as VoteData;
            setData(prev => ({ ...prev, [contest]: json }));
        } catch { /* silent */ }
        finally {
            if (!silent) setLoadingTabs(prev => { const n = new Set(prev); n.delete(contest); return n; });
        }
    }, []);

    useEffect(() => {
        fetchContest('video');
        fetchContest('rugby');
    }, [fetchContest]);

    useEffect(() => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        // Sondage uniquement si le concours est voté ET les résultats sont publiés
        if (data[activeTab]?.hasVoted && data[activeTab]?.resultsVisible) {
            intervalRef.current = setInterval(() => fetchContest(activeTab, true), 10000);
        }
        return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
    }, [data, activeTab, fetchContest]);

    useEffect(() => { setSelections([null, null, null]); setError(''); }, [activeTab]);

    const currentData = data[activeTab];
    const isLoading = loadingTabs.has(activeTab);
    const userCity = currentData?.userCity ?? null;
    const excluded = userCity ? [userCity] : [];

    const toggleCity = (city: string) => {
        setSelections(prev => {
            const idx = prev.indexOf(city);
            if (idx !== -1) {
                const next = prev.filter((_, i) => i !== idx);
                return [...next, null];
            }
            const nextSlot = prev.indexOf(null);
            if (nextSlot === -1) return prev;
            const next = [...prev];
            next[nextSlot] = city;
            return next;
        });
    };

    const handleConfirm = async () => {
        const [first, second, third] = selections;
        if (!first || !second || !third) return;
        setSubmitting(true);
        setError('');
        try {
            const res = await apiFetch(`/api/votes/${activeTab}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ first, second, third }),
            });
            const json = await res.json();
            if (!res.ok) { setError(json.error || 'Erreur'); return; }
            setSelections([null, null, null]);
            await fetchContest(activeTab);
        } catch {
            setError('Erreur réseau');
        } finally {
            setSubmitting(false);
        }
    };

    const hasAllSelections = selections.every(Boolean);
    const selectionCount = selections.filter(Boolean).length;

    return (
        <div className="max-w-2xl mx-auto px-4 sm:px-0 pb-8">
            {/* Header */}
            <div className="mb-6 sm:mb-8 flex items-center gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#ff89b8] to-[#ef6a9f] flex items-center justify-center flex-shrink-0 shadow-lg">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                </div>
                <div>
                    <div className="flex items-center gap-2 flex-wrap">
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold italic text-white drop-shadow-lg">Mes votes</h1>
                        {currentData?.isJury && (
                            <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-purple-500 text-white shadow-md">
                                ✨ Jury
                            </span>
                        )}
                    </div>
                    <p className="text-white/70 text-sm mt-0.5">Classez vos 3 villes · vote anonyme</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex bg-white/20 backdrop-blur-sm rounded-2xl p-1 mb-6 gap-1">
                {(Object.entries(CONTESTS) as [ContestKey, { label: string }][]).map(([key, { label }]) => (
                    <button
                        key={key}
                        onClick={() => setActiveTab(key)}
                        className={`flex-1 py-2.5 px-4 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
                            activeTab === key
                                ? 'bg-white shadow-md text-[#ef6a9f]'
                                : 'text-white/80 hover:text-white hover:bg-white/10'
                        }`}
                    >
                        <span>{label}</span>
                        {data[key]?.hasVoted && (
                            <span className="w-2 h-2 rounded-full bg-green-400 flex-shrink-0" />
                        )}
                        {data[key] && !data[key]?.voteOpen && !data[key]?.hasVoted && (
                            <span className="w-2 h-2 rounded-full bg-gray-400/60 flex-shrink-0" />
                        )}
                    </button>
                ))}
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="w-8 h-8 border-4 border-[#ff89b8]/30 border-t-[#ef6a9f] rounded-full animate-spin" />
                </div>
            ) : !currentData ? null : !currentData.voteOpen && !currentData.hasVoted ? (
                /* Vote pas encore ouvert */
                <div className="card-shadow glass-effect rounded-2xl border-2 border-gray-300/50 bg-white/60 p-10 text-center animate-fade-in">
                    <div className="w-14 h-14 rounded-2xl bg-gray-100 border-2 border-gray-200 flex items-center justify-center mx-auto mb-5">
                        <svg className="w-7 h-7 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                    <p className="text-gray-700 font-bold text-lg mb-2">Vote non ouvert</p>
                    <p className="text-gray-400 text-sm leading-relaxed">
                        Les votes pour ce concours ne sont pas encore disponibles.<br />
                        Revenez plus tard.
                    </p>
                </div>
            ) : currentData.hasVoted ? (
                <>
                    {/* Vote confirmé */}
                    <div className="mb-6 card-shadow glass-effect rounded-2xl border border-green-300/40 bg-green-50/50 p-5 animate-fade-in">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                                <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <p className="font-bold text-green-700 text-sm">Vote enregistré</p>
                        </div>
                        {currentData.myVote && (
                            <div className="flex flex-wrap gap-2">
                                {([currentData.myVote.first, currentData.myVote.second, currentData.myVote.third]).map((city, i) => (
                                    <span key={city} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-green-200 text-sm font-semibold text-gray-700">
                                        <span>{RANK_STYLES[i].badge}</span>
                                        {city}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    {currentData.resultsVisible ? (
                        <ResultsPanel data={currentData} />
                    ) : (
                        <div className="card-shadow glass-effect rounded-2xl border border-[#ff89b8]/20 p-8 text-center animate-fade-in">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#ff89b8]/20 to-[#ef6a9f]/20 border border-[#ff89b8]/30 flex items-center justify-center mx-auto mb-5">
                                <svg className="w-7 h-7 text-[#ef6a9f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                            <p className="text-gray-800 font-bold text-lg mb-2">Résultats sous embargo</p>
                            <p className="text-gray-500 text-sm leading-relaxed">
                                Les classements seront dévoilés lors du gala.<br />
                                Rendez-vous ce soir !
                            </p>
                        </div>
                    )}
                </>
            ) : (
                <>
                    {/* Info bar */}
                    <div className="mb-5 card-shadow glass-effect rounded-2xl border border-[#ff89b8]/20 p-4 animate-fade-in">
                        <div className="flex items-center gap-3">
                            <div className="flex gap-1.5 flex-shrink-0">
                                {[0, 1, 2].map(i => (
                                    <div key={i} className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-200 ${
                                        selections[i]
                                            ? 'bg-gradient-to-br from-[#ff89b8] to-[#ef6a9f] text-white shadow-md'
                                            : i === selectionCount
                                                ? 'border-2 border-[#ef6a9f] text-[#ef6a9f] bg-white'
                                                : 'border-2 border-gray-200 text-gray-300 bg-white'
                                    }`}>
                                        {i + 1}
                                    </div>
                                ))}
                            </div>
                            <div className="min-w-0">
                                <p className="font-bold text-gray-800 text-sm">
                                    {selectionCount === 0 && 'Choisissez votre ville favorite'}
                                    {selectionCount === 1 && 'Choisissez votre 2ème ville'}
                                    {selectionCount === 2 && 'Choisissez votre 3ème ville'}
                                    {selectionCount === 3 && 'Confirmez votre classement ↓'}
                                </p>
                                {excluded.length > 0 && (
                                    <p className="text-gray-400 text-xs mt-0.5 truncate">
                                        {currentData.userCity ? `${currentData.userCity} exclue · ` : ''}Vote anonyme
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {error && (
                        <div className="mb-4 px-4 py-3 bg-red-500/15 border border-red-400/30 text-red-300 rounded-xl text-sm">{error}</div>
                    )}

                    {/* City grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                        {(currentData.groups ?? []).map((city) => {
                            const rankIdx = selections.indexOf(city);
                            const isSelected = rankIdx !== -1;
                            const isExcluded = excluded.includes(city);
                            const isDisabled = isExcluded || (!isSelected && hasAllSelections);
                            const style = isSelected ? RANK_STYLES[rankIdx] : null;

                            return (
                                <button
                                    key={city}
                                    onClick={() => !isDisabled && toggleCity(city)}
                                    disabled={isDisabled}
                                    className={`relative flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl border-2 transition-all duration-200 text-center gap-1 min-h-[76px] ${
                                        isExcluded
                                            ? 'border-gray-100 bg-white/30 opacity-40 cursor-not-allowed'
                                            : isSelected
                                                ? `${style!.border} ${style!.bg} shadow-md scale-[1.02]`
                                                : hasAllSelections
                                                    ? 'border-[#ff89b8]/10 bg-white/40 opacity-50 cursor-not-allowed'
                                                    : 'border-[#ff89b8]/20 bg-white/80 hover:border-[#ef6a9f]/60 hover:shadow-md hover:scale-[1.02] active:scale-[0.98]'
                                    }`}
                                >
                                    {isSelected && (
                                        <span className="text-xl leading-none">{style!.badge}</span>
                                    )}
                                    <span className={`font-bold text-xs sm:text-sm leading-tight ${
                                        isSelected ? style!.text : isExcluded ? 'text-gray-400' : 'text-gray-700'
                                    }`}>
                                        {city}
                                    </span>
                                    {isExcluded && (
                                        <span className="text-[10px] text-gray-400">Votre groupe</span>
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {/* Confirm block — above results */}
                    {selections.some(Boolean) && (
                        <div className="mt-5 card-shadow glass-effect rounded-2xl border border-[#ff89b8]/20 p-4 animate-fade-in">
                            <div className="flex items-center gap-2 sm:gap-3">
                                <div className="flex-1 flex gap-1.5 sm:gap-2 min-w-0">
                                    {[0, 1, 2].map(i => (
                                        <div key={i} className={`flex-1 flex items-center gap-1.5 px-2 sm:px-3 py-2.5 rounded-xl border text-xs font-semibold min-w-0 transition-all ${
                                            selections[i]
                                                ? `${RANK_STYLES[i].border} ${RANK_STYLES[i].bg} ${RANK_STYLES[i].text}`
                                                : 'border-dashed border-gray-200 text-gray-300'
                                        }`}>
                                            <span className="flex-shrink-0 text-base">{selections[i] ? RANK_STYLES[i].badge : (i + 1)}</span>
                                            <span className="truncate">{selections[i] ?? '...'}</span>
                                        </div>
                                    ))}
                                </div>
                                <button
                                    onClick={handleConfirm}
                                    disabled={!hasAllSelections || submitting}
                                    className="flex-shrink-0 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#ff89b8] to-[#ef6a9f] text-white font-bold text-sm shadow-lg hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed"
                                >
                                    {submitting
                                        ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        : 'Voter'}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Résultats masqués jusqu'au gala — aucun aperçu avant vote */}
                </>
            )}
        </div>
    );
}

function ResultsPanel({ data }: { data: VoteData }) {
    const ranked = data.results.filter(r => r.finalScore > 0);
    const unranked = data.results.filter(r => r.finalScore === 0);
    const allSorted = [...ranked, ...unranked];
    const top3 = ranked.slice(0, 3);
    const maxScore = ranked[0]?.finalScore ?? 1;

    return (
        <div className="animate-fade-in space-y-4">
            {/* Live indicator */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-white/70 text-xs font-semibold">Résultats en direct</span>
                </div>
                <span className="text-white/50 text-xs">
                    {data.totalVotes} participant{data.totalVotes !== 1 ? 's' : ''}
                    {(data.totalJuryVotes ?? 0) > 0 && ` · ${data.totalJuryVotes} jury`}
                </span>
            </div>

            {/* Podium */}
            {top3.length >= 3 && (
                <div className="card-shadow glass-effect rounded-2xl border border-[#ff89b8]/20 p-5">
                    <div className="flex items-end justify-center gap-4">
                        {/* 2nd */}
                        <div className="flex flex-col items-center gap-1.5 flex-1">
                            <span className="text-2xl">🥈</span>
                            <span className="text-gray-700 font-bold text-xs text-center leading-tight">{top3[1].city}</span>
                            <span className="text-gray-500 text-xs font-mono">{top3[1].finalScore.toFixed(1)}</span>
                            <div className="w-full bg-gradient-to-t from-gray-300 to-gray-200 rounded-t-xl" style={{ height: 52 }} />
                        </div>
                        {/* 1st */}
                        <div className="flex flex-col items-center gap-1.5 flex-1">
                            <span className="text-3xl">🥇</span>
                            <span className="text-gray-800 font-extrabold text-sm text-center leading-tight">{top3[0].city}</span>
                            <span className="text-[#ef6a9f] font-bold text-sm font-mono">{top3[0].finalScore.toFixed(1)}</span>
                            <div className="w-full bg-gradient-to-t from-[#ef6a9f] to-[#ff89b8] rounded-t-xl" style={{ height: 80 }} />
                        </div>
                        {/* 3rd */}
                        <div className="flex flex-col items-center gap-1.5 flex-1">
                            <span className="text-2xl">🥉</span>
                            <span className="text-gray-700 font-bold text-xs text-center leading-tight">{top3[2].city}</span>
                            <span className="text-gray-500 text-xs font-mono">{top3[2].finalScore.toFixed(1)}</span>
                            <div className="w-full bg-gradient-to-t from-amber-400 to-amber-300 rounded-t-xl" style={{ height: 36 }} />
                        </div>
                    </div>
                </div>
            )}

            {/* Full ranking */}
            <div className="card-shadow glass-effect rounded-2xl border border-[#ff89b8]/20 overflow-hidden">
                {allSorted.length === 0 ? (
                    <div className="p-10 text-center text-gray-400 text-sm">Aucun vote pour le moment</div>
                ) : (
                    <div className="divide-y divide-[#ff89b8]/10">
                        {allSorted.map((city, i) => (
                            <div key={city.city} className="px-4 py-3 flex items-center gap-3">
                                <span className="w-7 text-center text-sm font-bold text-gray-400 flex-shrink-0">
                                    {i === 0 && city.finalScore > 0 ? '🥇' : i === 1 && city.finalScore > 0 ? '🥈' : i === 2 && city.finalScore > 0 ? '🥉' : `${i + 1}`}
                                </span>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between gap-2 mb-1.5">
                                        <span className="font-bold text-gray-800 text-sm truncate">{city.city}</span>
                                        <span className="text-[#ef6a9f] font-bold text-sm font-mono flex-shrink-0">{city.finalScore.toFixed(1)}</span>
                                    </div>
                                    {city.finalScore > 0 && (
                                        <>
                                            <div className="flex gap-1 mb-1">
                                                <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-gradient-to-r from-[#ff89b8] to-[#ef6a9f] rounded-full transition-all duration-700"
                                                        style={{ width: `${(city.participantScore / maxScore) * 100}%` }}
                                                    />
                                                </div>
                                                <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-gradient-to-r from-purple-400 to-purple-500 rounded-full transition-all duration-700"
                                                        style={{ width: `${(city.juryScore / maxScore) * 100}%` }}
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex gap-3">
                                                <span className="text-[10px] text-gray-400">👥 {city.participantScore.toFixed(1)} part.</span>
                                                <span className="text-[10px] text-purple-400">✨ {city.juryScore.toFixed(1)} jury</span>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <p className="text-center text-white/40 text-xs">Mise à jour toutes les 10 secondes</p>
        </div>
    );
}
