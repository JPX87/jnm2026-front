'use client';

import { useState } from 'react';
import React from 'react';

interface EventBlock {
    title?: string;
    location?: string;
    content?: string;
    startTime: string;
    duration: number;
    size?: number;
    position?: 'minimum' | 'midium' | 'medium';
    borderDisable?: boolean;
}

interface DaySchedule {
    day: string;
    shortDay: string;
    date: string;
    events: EventBlock[];
}

const programme: DaySchedule[] = [
    {
        day: 'Mardi 26/05',
        shortDay: 'Mardi',
        date: '26 mai',
        events: [
            {
                title: 'Arrivée des participants',
                location: 'Université de Toulouse',
                content: "Pensez à apporter votre repas du midi ou à prévoir une solution de restauration sur place (Crous, restaurants à proximité, etc).",
                startTime: '8h',
                duration: 6,
            },
            {
                title: 'Ouverture des JNM 2026',
                location: 'Bât. U4',
                startTime: '14h30',
                duration: 1.1,
                borderDisable: true,
            },
            {
                title: 'Jeu de cohésion',
                startTime: '16h',
                duration: 2,
                size: 1.9,
            },
            {
                title: 'Cocktail de bienvenue',
                location: 'Upsidom',
                startTime: '18h',
                duration: 3,
                size: 2.9,
            },
            {
                title: 'Soirée au délirium',
                location: 'Délirium Café',
                startTime: '21h',
                duration: 3,
            },
        ],
    },
    {
        day: 'Mercredi 27/05',
        shortDay: 'Mercredi',
        date: '27 mai',
        events: [
            {
                title: 'Petit déjeuner',
                location: 'Bât. 2A',
                startTime: '9h',
                duration: 0.5,
                borderDisable: true,
            },
            {
                title: 'Rencontres ALUMNI',
                location: 'Amphi GRIGNARD & Salles 2A',
                startTime: '9h30',
                duration: 1,
            },
            {
                title: 'Forum Entreprises',
                location: 'Amphi GRIGNARD & Salles 2A',
                startTime: '11h',
                duration: 1.5,
            },
            {
                title: 'Buffet partenaires',
                location: 'Bât. 2A',
                startTime: '12h30',
                duration: 1.5,
                borderDisable: true,
            },
            {
                title: 'Ateliers & Challenges',
                location: 'Amphi GRIGNARD & Salles 2A',
                startTime: '14h',
                duration: 1.5,
            },
            {
                title: 'Atelier E-sport',
                location: 'Amphi GRIGNARD & Salles 2A',
                startTime: '16h',
                duration: 2,
            },
            {
                title: 'Soirée conviviale',
                startTime: '20h',
                duration: 4,
            },
        ],
    },
    {
        day: 'Jeudi 28/05',
        shortDay: 'Jeudi',
        date: '28 mai',
        events: [
            {
                title: 'Petit déjeuner',
                location: 'Bât. 2A',
                startTime: '9h',
                duration: 0.5,
                borderDisable: true,
            },
            {
                title: 'Team building',
                location: 'Centre-ville',
                startTime: '9h30',
                duration: 2.5,
            },
            {
                title: 'Pique-nique',
                location: 'Prairie des filtres',
                startTime: '12h',
                duration: 2,
                borderDisable: true,
            },
            {
                title: 'Conférences & Ateliers',
                location: 'Amphi CONCORDE / GRIGNARD',
                startTime: '15h',
                duration: 1.5,
            },
            {
                title: 'Atelier pitch ascenseur',
                location: 'Bât. U6',
                startTime: '16h45',
                duration: 1.25,
            },
            {
                title: 'Soirée conviviale',
                location: '« Central » de la fac',
                startTime: '20h',
                duration: 4,
            },
        ],
    },
    {
        day: 'Vendredi 29/05',
        shortDay: 'Vendredi',
        date: '29 mai',
        events: [
            {
                title: 'Petit déjeuner',
                location: 'Bât. 2A',
                startTime: '8h',
                duration: 1,
                borderDisable: true,
            },
            {
                title: 'Concours MIAGE',
                location: 'Amphi Médecine',
                startTime: '9h',
                duration: 2,
            },
            {
                title: 'Activité Vélo Smoothie',
                location: 'Amphi Médecine',
                startTime: '11h',
                duration: 1.5,
            },
            {
                title: 'Pique-nique',
                location: 'Jardin des Plantes',
                startTime: '12h30',
                duration: 1.5,
                borderDisable: true,
            },
            {
                title: 'Résultats des concours',
                location: 'Amphi Médecine',
                startTime: '14h',
                duration: 2,
            },
            {
                title: 'GALA',
                startTime: '20h',
                duration: 6,
            },
        ],
    },
];

const timeToMinutes = (time: string): number => {
    const [h, m] = time.replace('h', ':').split(':');
    return parseInt(h) * 60 + (parseInt(m) || 0);
};

const minutesToTime = (minutes: number): string => {
    const h = Math.floor(minutes / 60) % 24;
    const m = minutes % 60;
    return m === 0 ? `${h}h` : `${h}h${String(m).padStart(2, '0')}`;
};

const getEndTime = (startTime: string, duration: number) =>
    minutesToTime(timeToMinutes(startTime) + Math.round(duration * 60));

function renderContent(content?: string) {
    if (!content) return null;
    return content.split('\n').map((line, i, arr) => (
        <React.Fragment key={i}>
            {line}
            {i < arr.length - 1 && <br />}
        </React.Fragment>
    ));
}

/* ── Icône épingle ── */
function PinIcon() {
    return (
        <svg className="w-3 h-3 flex-shrink-0 text-[#ef6a9f]" fill="currentColor" viewBox="0 0 10 14">
            <path d="M5 0C2.24 0 0 2.24 0 5C0 8.75 5 14 5 14C5 14 10 8.75 10 5C10 2.24 7.76 0 5 0ZM5 6.8C4.01 6.8 3.2 5.99 3.2 5C3.2 4.01 4.01 3.2 5 3.2C5.99 3.2 6.8 4.01 6.8 5C6.8 5.99 5.99 6.8 5 6.8Z" />
        </svg>
    );
}

/* ── Couleurs selon l'heure (ambiance) ── */
function getEventAccent(startTime: string): { dot: string; badge: string } {
    const mins = timeToMinutes(startTime);
    if (mins < 12 * 60) return { dot: 'bg-amber-400', badge: 'bg-amber-400/15 text-amber-600' };
    if (mins < 14 * 60) return { dot: 'bg-orange-400', badge: 'bg-orange-400/15 text-orange-600' };
    if (mins < 18 * 60) return { dot: 'bg-[#ef6a9f]', badge: 'bg-[#ff89b8]/20 text-[#c4527a]' };
    return { dot: 'bg-violet-400', badge: 'bg-violet-400/15 text-violet-600' };
}

export default function AppProgramme() {
    const [selectedDay, setSelectedDay] = useState(0);
    const day = programme[selectedDay];
    const mainEvents = day.events.filter(e => !e.borderDisable);
    const pauseEvents = day.events.filter(e => e.borderDisable && e.title);

    return (
        <div className="max-w-2xl mx-auto w-full">

            {/* ── Onglets jours ── */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-1 no-scrollbar">
                {programme.map((d, i) => (
                    <button
                        key={i}
                        onClick={() => setSelectedDay(i)}
                        className={`flex-shrink-0 flex flex-col items-center px-4 py-2.5 rounded-2xl transition-all duration-200 ${
                            selectedDay === i
                                ? 'bg-white text-[#ef6a9f] shadow-lg scale-105'
                                : 'bg-white/10 text-white hover:bg-white/20'
                        }`}
                    >
                        <span className="font-bold text-sm leading-tight">{d.shortDay}</span>
                        <span className={`text-[11px] mt-0.5 ${selectedDay === i ? 'text-[#ef6a9f]/60' : 'text-white/60'}`}>{d.date}</span>
                    </button>
                ))}
            </div>

            {/* ── En-tête du jour ── */}
            <div className="rounded-2xl bg-gradient-to-r from-[#ff89b8] to-[#ef6a9f] px-5 py-4 mb-4 flex items-center justify-between shadow-lg">
                <div>
                    <h2 className="text-white font-extrabold text-lg leading-tight">{day.day}</h2>
                    <p className="text-white/75 text-xs mt-0.5">
                        {mainEvents.length} activité{mainEvents.length > 1 ? 's' : ''}
                        {pauseEvents.length > 0 && ` · ${pauseEvents.length} pause${pauseEvents.length > 1 ? 's' : ''}`}
                    </p>
                </div>
                {/* Navigation rapide */}
                <div className="flex gap-1">
                    <button
                        onClick={() => setSelectedDay(i => Math.max(0, i - 1))}
                        disabled={selectedDay === 0}
                        className="w-8 h-8 rounded-xl bg-white/20 hover:bg-white/30 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-all"
                    >
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <button
                        onClick={() => setSelectedDay(i => Math.min(programme.length - 1, i + 1))}
                        disabled={selectedDay === programme.length - 1}
                        className="w-8 h-8 rounded-xl bg-white/20 hover:bg-white/30 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-all"
                    >
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* ── Timeline ── */}
            <div className="relative pl-8">
                {/* Ligne verticale */}
                <div className="absolute left-[15px] top-2 bottom-2 w-px bg-gradient-to-b from-[#ff89b8]/60 via-[#ff89b8]/30 to-transparent rounded-full" />

                <div className="flex flex-col gap-1">
                    {day.events.map((event, i) => {
                        const accent = getEventAccent(event.startTime);

                        /* ── Pause / break ── */
                        if (event.borderDisable) {
                            return (
                                <div key={i} className="flex items-center gap-3 py-2 group">
                                    {/* Dot */}
                                    <div className="absolute left-[11px] w-2 h-2 rounded-full bg-white/20 ring-2 ring-white/10" />
                                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/6 border border-white/10 w-full">
                                        <span className="text-white/40 text-xs font-bold tabular-nums">{event.startTime}</span>
                                        {event.title && (
                                            <>
                                                <span className="text-white/20 text-xs">·</span>
                                                <span className="text-white/50 text-xs font-semibold italic">{event.title}</span>
                                            </>
                                        )}
                                        {event.location && (
                                            <span className="ml-auto flex items-center gap-1 text-white/30 text-xs">
                                                <PinIcon />
                                                {event.location}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            );
                        }

                        /* ── Événement principal ── */
                        return (
                            <div key={i} className="flex items-start gap-3 py-1.5 group">
                                {/* Dot coloré */}
                                <div className={`absolute left-[10px] mt-[18px] w-2.5 h-2.5 rounded-full ${accent.dot} shadow-md ring-2 ring-white/20 flex-shrink-0`} />

                                {/* Carte */}
                                <div className="flex-1 rounded-2xl bg-white/92 backdrop-blur-sm border border-white/60 shadow-md p-4 transition-all duration-200 hover:shadow-lg hover:scale-[1.01]">
                                    {/* Ligne du haut : horaire + badge durée */}
                                    <div className="flex items-start justify-between gap-2 mb-2">
                                        <div className="flex items-center gap-1.5">
                                            <span className="text-[#ef6a9f] font-extrabold text-sm tabular-nums">{event.startTime}</span>
                                            <svg className="w-3 h-3 text-[#ff89b8]/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                            </svg>
                                            <span className="text-[#ef6a9f]/60 font-semibold text-xs tabular-nums">{getEndTime(event.startTime, event.duration)}</span>
                                        </div>
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${accent.badge}`}>
                                            {(() => {
                                                const d = event.duration;
                                                const h = Math.floor(d);
                                                const m = Math.round((d - h) * 60);
                                                if (h === 0) return `${m}min`;
                                                if (m === 0) return `${h}h`;
                                                return `${h}h${m}`;
                                            })()}
                                        </span>
                                    </div>

                                    {/* Titre */}
                                    {event.title && (
                                        <h3 className="text-[#c4527a] font-extrabold text-base leading-tight mb-1.5">
                                            {event.title}
                                        </h3>
                                    )}

                                    {/* Lieu */}
                                    {event.location && (
                                        <div className="flex items-center gap-1.5 mb-1.5">
                                            <PinIcon />
                                            <span className="text-[#ef6a9f] text-xs font-semibold">{event.location}</span>
                                        </div>
                                    )}

                                    {/* Contenu */}
                                    {event.content && (
                                        <p className="text-gray-500 text-xs leading-relaxed mt-1 border-t border-gray-100 pt-2">
                                            {renderContent(event.content)}
                                        </p>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
