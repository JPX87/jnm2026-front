'use client';

import { useState } from 'react';
import React from 'react';

interface EventBlock {
    title?: string;
    location?: string;
    content?: string;
    startTime: string;
    duration: number;
    isPause?: boolean;
}

interface DaySchedule {
    day: string;
    shortDay: string;
    date: string;
    events: EventBlock[];
}

const programme: DaySchedule[] = [
    {
        day: "Mardi 26/05",
        shortDay: "Mardi",
        date: "26 mai",
        events: [
            {
                title: "Logistique Arrivées",
                content: "Récupération & Dépôt Hôtel\nRéception et orientation",
                startTime: "9h",
                duration: 3,
            },
            {
                isPause: true,
                startTime: "12h",
                duration: 2,
            },
            {
                title: "Accueil & Ouverture",
                location: "Amphi CONCORDE, Bât. U4",
                content: "14h: Étiquetage bagages & jeux d'attente\n15h: Ouverture JNM26 & Discours\n16h - 18h: Activité « Ice Breaker »",
                startTime: "14h",
                duration: 4,
            },
            {
                isPause: true,
                startTime: "18h",
                duration: 2,
            },
            {
                title: "Soirée d'Accueil",
                location: "Esplanade ou l'Upsidom",
                content: "Détails à définir",
                startTime: "20h",
                duration: 3,
            },
        ],
    },
    {
        day: "Mercredi 27/05",
        shortDay: "Mercredi",
        date: "27 mai",
        events: [
            {
                title: "Rencontres ALUMNI & Forum",
                location: "Amphi GRIGNARD & Salles 2A",
                content: "09h - 10h30: Tables rondes Alumni (Perspectives métiers, carrières, VIE, consulting, influence)\n11h - 12h30: Forum des entreprises (Rencontres MIAGE/Alumni)",
                startTime: "9h",
                duration: 3.5,
            },
            {
                isPause: true,
                title: "Buffet",
                content: "Buffet avec entreprises\nLieu: Bât. 2A (pergola + pelouse)",
                startTime: "12h30",
                duration: 1.5,
            },
            {
                title: "Ateliers & Challenges",
                content: "14h - 15h30: Green IT (IA & empreinte carbone / IA conscientisée)\n16h - 18h: E-Sport (Étudiants vs Entreprises avec CGI & EXTIA)",
                startTime: "14h",
                duration: 4,
            },
            {
                isPause: true,
                startTime: "18h",
                duration: 2,
            },
            {
                title: "Bowling",
                startTime: "20h",
                duration: 3,
            },
        ],
    },
    {
        day: "Jeudi 28/05",
        shortDay: "Jeudi",
        date: "28 mai",
        events: [
            {
                title: "Team building",
                location: "Centre-ville",
                content: "Découverte de Toulouse / Jeux de piste\n\nAG CDM en parallèle.",
                startTime: "9h",
                duration: 3,
            },
            {
                isPause: true,
                title: "Déjeuner",
                content: "Déjeuner sur l'herbe (Prairie des filtres)\nou Pique-nique (Jardin des Plantes)",
                startTime: "12h",
                duration: 3,
            },
            {
                title: "Conférences & Ateliers",
                location: "Amphi CONCORDE / GRIGNARD",
                content: "15h - 16h30: Conférence Table Ronde (Aéronautique / Cyberdéfense)\n16h45 - 18h: Atelier Pitch en ascenseur (Pecha Kucha)",
                startTime: "15h",
                duration: 3,
            },
            {
                isPause: true,
                startTime: "18h",
                duration: 2,
            },
            {
                title: "Soirée conviviale",
                location: "« Central » de la fac",
                content: "Quizz MIAGE & JNM (Kahoot)",
                startTime: "20h",
                duration: 3,
            },
        ],
    },
    {
        day: "Vendredi 29/05",
        shortDay: "Vendredi",
        date: "29 mai",
        events: [
            {
                title: "Concours MIAGE",
                location: "Amphi Médecine (Allées Jules Guesde)",
                content: "Présentation des vidéos / ballon de rugby Concours MIAGE",
                startTime: "9h",
                duration: 3,
            },
            {
                isPause: true,
                startTime: "12h",
                duration: 2,
            },
            {
                title: "Clôture",
                content: "Résultats « Concours MIAGE »\nClôture de l'événement",
                startTime: "14h",
                duration: 2,
            },
            {
                isPause: true,
                startTime: "16h",
                duration: 4,
            },
            {
                title: "GALA",
                startTime: "20h",
                duration: 3,
            },
        ],
    },
];

const timeToMinutes = (time: string): number => {
    const [hours, minutes] = time.split("h").map(Number);
    return hours * 60 + (minutes || 0);
};

const minutesToTime = (minutes: number): string => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return m === 0 ? `${h}h` : `${h}h${m}`;
};

const getEndTime = (startTime: string, duration: number): string => {
    const startMin = timeToMinutes(startTime);
    return minutesToTime(startMin + duration * 60);
};

function renderContent(content?: string) {
    if (!content) return null;
    return content.split("\n").map((line, j, arr) => (
        <React.Fragment key={j}>
            {line}
            {j < arr.length - 1 && <br />}
        </React.Fragment>
    ));
}

export default function ProgrammePage() {
    const [selectedDay, setSelectedDay] = useState(0);

    const day = programme[selectedDay];
    const activeEvents = day.events.filter(e => !e.isPause);

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-0">
            {/* Header */}
            <div className="mb-6 sm:mb-8 flex items-center gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                </div>
                <div>
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold italic text-white drop-shadow-lg">
                        Programme
                    </h2>
                    <p className="text-white/70 text-sm mt-0.5">JNM 2026 · 26–29 mai · Toulouse</p>
                </div>
            </div>

            {/* Onglets jours */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
                {programme.map((d, i) => (
                    <button
                        key={i}
                        onClick={() => setSelectedDay(i)}
                        className={`flex-shrink-0 flex flex-col items-center px-5 py-3 rounded-2xl font-semibold text-sm transition-all duration-300 ${
                            selectedDay === i
                                ? 'bg-white text-[#ef6a9f] shadow-lg scale-105'
                                : 'bg-white/15 text-white hover:bg-white/25'
                        }`}
                    >
                        <span className="font-bold text-sm">{d.shortDay}</span>
                        <span className={`text-xs mt-0.5 ${selectedDay === i ? 'text-[#ef6a9f]/60' : 'text-white/70'}`}>{d.date}</span>
                    </button>
                ))}
            </div>

            {/* Carte principale du jour */}
            <div className="rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl animate-fade-in" style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.25)' }}>
                {/* Bandeau titre du jour */}
                <div className="bg-gradient-to-r from-[#ff89b8] to-[#ef6a9f] px-5 sm:px-7 py-4">
                    <h3 className="text-white font-extrabold text-lg sm:text-xl">{day.day}</h3>
                    <p className="text-white/80 text-sm">{activeEvents.length} activité{activeEvents.length > 1 ? 's' : ''} au programme</p>
                </div>

                {/* Liste des événements */}
                <div className="p-4 sm:p-6 flex flex-col gap-3">
                    {day.events.map((event, i) => {
                        /* --- Pause avec contenu (buffet, déjeuner…) --- */
                        if (event.isPause) {
                            if (!event.title && !event.content) return null;
                            return (
                                <div key={i} className="flex items-center gap-4 py-3 px-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}>
                                    <div className="text-center flex-shrink-0 min-w-[44px]">
                                        <p className="text-white/60 text-xs font-bold">{event.startTime}</p>
                                        <div className="w-px h-3 bg-white/20 mx-auto my-1" />
                                        <p className="text-white/60 text-xs font-bold">{getEndTime(event.startTime, event.duration)}</p>
                                    </div>
                                    <div className="w-px self-stretch bg-white/15 rounded-full flex-shrink-0" />
                                    <div>
                                        {event.title && (
                                            <p className="text-white/80 font-semibold text-sm">{event.title}</p>
                                        )}
                                        {event.content && (
                                            <p className="text-white/60 text-xs mt-0.5 leading-relaxed">{renderContent(event.content)}</p>
                                        )}
                                    </div>
                                </div>
                            );
                        }

                        /* --- Événement principal --- */
                        return (
                            <div key={i} className="rounded-xl sm:rounded-2xl p-4 sm:p-5" style={{ background: 'rgba(255,255,255,0.92)', border: '1px solid rgba(239,106,159,0.2)' }}>
                                <div className="flex items-start gap-4">
                                    {/* Colonne horaire */}
                                    <div className="flex-shrink-0 text-center min-w-[52px]">
                                        <p className="text-[#ef6a9f] font-extrabold text-base leading-tight">{event.startTime}</p>
                                        <div className="w-px h-3 bg-[#ff89b8]/40 mx-auto my-1" />
                                        <p className="text-[#ef6a9f]/60 font-semibold text-xs">{getEndTime(event.startTime, event.duration)}</p>
                                    </div>

                                    {/* Séparateur vertical */}
                                    <div className="w-0.5 self-stretch bg-gradient-to-b from-[#ff89b8] to-[#ef6a9f]/30 rounded-full flex-shrink-0" />

                                    {/* Contenu */}
                                    <div className="flex-1 min-w-0">
                                        {event.title && (
                                            <h4 className="text-[#c4527a] font-extrabold text-base sm:text-lg leading-tight mb-1.5">
                                                {event.title}
                                            </h4>
                                        )}
                                        {event.location && (
                                            <div className="flex items-center gap-1.5 mb-2">
                                                <svg className="w-3.5 h-3.5 text-[#ef6a9f] flex-shrink-0" fill="currentColor" viewBox="0 0 10 14">
                                                    <path d="M5 0C2.24 0 0 2.24 0 5C0 8.75 5 14 5 14C5 14 10 8.75 10 5C10 2.24 7.76 0 5 0ZM5 6.8C4.01 6.8 3.2 5.99 3.2 5C3.2 4.01 4.01 3.2 5 3.2C5.99 3.2 6.8 4.01 6.8 5C6.8 5.99 5.99 6.8 5 6.8Z" />
                                                </svg>
                                                <p className="text-[#ef6a9f] text-xs sm:text-sm font-semibold">{event.location}</p>
                                            </div>
                                        )}
                                        {event.content && (
                                            <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                                                {renderContent(event.content)}
                                            </p>
                                        )}
                                    </div>

                                    {/* Badge durée */}
                                    <div className="flex-shrink-0 bg-[#ff89b8]/15 rounded-lg px-2.5 py-1 self-start">
                                        <p className="text-[#ef6a9f] text-xs font-bold">{event.duration % 1 === 0 ? `${event.duration}h` : `${Math.floor(event.duration)}h${(event.duration % 1) * 60}`}</p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Navigation entre jours */}
            <div className="flex justify-between mt-4 gap-3">
                <button
                    onClick={() => setSelectedDay(i => Math.max(0, i - 1))}
                    disabled={selectedDay === 0}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-2xl font-semibold text-sm transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                    style={{ background: 'rgba(255,255,255,0.15)', color: 'white' }}
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Jour précédent
                </button>
                <button
                    onClick={() => setSelectedDay(i => Math.min(programme.length - 1, i + 1))}
                    disabled={selectedDay === programme.length - 1}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-2xl font-semibold text-sm transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                    style={{ background: 'rgba(255,255,255,0.15)', color: 'white' }}
                >
                    Jour suivant
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>
        </div>
    );
}
