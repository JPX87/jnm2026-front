import React, { Fragment } from "react";

// Conversion heure -> nombre
const timeToMinutes = (time: string): number => {
    const [hours, minutes] = time.split("h").map(Number);
    return hours * 60 + (minutes || 0);
};

// Format heure à partir de minutes depuis minuit
const minutesToTime = (minutes: number): string => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return m === 0 ? `${h}h` : `${h}h${m}`;
};

interface EventBlock {
    title?: string;
    location?: string;
    content?: string;
    startTime: string; // Format: "9h", "14h30", etc
    duration: number; // En heures (peut être 2.5, 3, 4, etc)
    borderDisable?: boolean;
}

interface DaySchedule {
    day: string;
    events: EventBlock[];
}

const programme: DaySchedule[] = [
    {
        day: "Mardi 26/05",
        events: [
            {
                title: "Logistique Arrivées",
                content: "Récupération & Dépôt Hôtel\nRéception et orientation",
                startTime: "9h",
                duration: 3,
            },
            {
                title: "PAUSE",
                startTime: "12h",
                duration: 2,
                borderDisable: true,
            },
            {
                title: "Accueil & Ouverture",
                location: "Amphi CONCORDE, Bât. U4",
                content: "14h: Étiquetage bagages & jeux d'attente\n15h: Ouverture JNM26 & Discours\n16h - 18h: Activité « Ice Breaker »",
                startTime: "14h",
                duration: 4,
            },
            {
                title: "PAUSE",
                startTime: "18h",
                duration: 2,
                borderDisable: true,
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
        events: [
            {
                title: "Rencontres ALUMNI & Forum",
                location: "Amphi GRIGNARD & Salles 2A",
                content: "09h - 10h30: Tables rondes Alumni (Perspectives métiers, carrières, VIE, consulting, influence)\n11h - 12h30: Forum des entreprises (Rencontres MIAGE/Alumni)",
                startTime: "9h",
                duration: 3.5,
            },
            {
                title: "PAUSE",
                content: "Buffet avec entreprises\nLieu: Bât. 2A (pergola + pelouse)",
                startTime: "12h30",
                duration: 1.5,
                borderDisable: true,
            },
            {
                title: "Ateliers & Challenges",
                content: "14h - 15h30: Green IT (IA & empreinte carbone / IA conscientisée)\n16h - 18h: E-Sport (Étudiants vs Entreprises avec CGI & EXTIA)",
                startTime: "14h",
                duration: 4,
            },
            {
                title: "PAUSE",
                startTime: "18h",
                duration: 2,
                borderDisable: true,
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
        events: [
            {
                title: "Team building",
                location: "Centre-ville",
                content: "Découverte de Toulouse / Jeux de piste\n\nAG CDM en parallèle.",
                startTime: "9h",
                duration: 3,
            },
            {
                title: "PAUSE",
                content: "Déjeuner sur l'herbe (Prairie des filtres)\nou Pique-nique (Jardin des Plantes)",
                startTime: "12h",
                duration: 3,
                borderDisable: true,
            },
            {
                title: "Conférences & Ateliers",
                location: "Amphi CONCORDE / GRIGNARD",
                content: "15h - 16h30: Conférence Table Ronde (Aéronautique / Cyberdéfense)\n16h45 - 18h: Atelier Pitch en ascenseur (Pecha Kucha)",
                startTime: "15h",
                duration: 3,
            },
            {
                title: "PAUSE",
                startTime: "18h",
                duration: 2,
                borderDisable: true,
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
        events: [
            {
                title: "Concours MIAGE",
                location: "Amphi Médecine (Allées Jules Guesde)",
                content: "Présentation des vidéos / ballon de rugby Concours MIAGE",
                startTime: "9h",
                duration: 3,
            },
            {
                title: "PAUSE",
                startTime: "12h",
                duration: 2,
                borderDisable: true,
            },
            {
                title: "Clôture",
                content: "Résultats « Concours MIAGE »\nClôture de l'événement",
                startTime: "14h",
                duration: 2,
            },
            {
                title: "PAUSE",
                startTime: "16h",
                duration: 4,
                borderDisable: true,
            },
            {
                title: "GALA",
                startTime: "20h",
                duration: 3,
            },
        ],
    },
];

function renderContent(content?: string) {
    if (!content) return null;
    return content.split("\n").map((line, j, arr) => (
        <React.Fragment key={j}>
            {line}
            {j < arr.length - 1 && <br />}
        </React.Fragment>
    ));
}

function getEndTime(startTime: string, duration: number): string {
    const startMin = timeToMinutes(startTime);
    const endMin = startMin + duration * 60;
    return minutesToTime(endMin);
}

function getDayTimeRange(events: EventBlock[]): { minTime: number; maxTime: number } {
    const times = events.map(e => timeToMinutes(e.startTime));
    const endTimes = events.map(e => timeToMinutes(e.startTime) + e.duration * 60);
    return {
        minTime: Math.min(...times),
        maxTime: Math.max(...endTimes),
    };
}

// ── Composant réutilisable pour le rendu d'un événement ──
interface EventCardProps {
    event: EventBlock;
    isPositioned?: boolean; // Si true, utilise le positionnement absolu (desktop)
    minTime?: number;
    maxTime?: number;
}

function EventCard({ event, isPositioned = false, minTime = 0, maxTime = 1440 }: EventCardProps) {
    let topPercent = 0;
    let heightPercent = 100;

    if (isPositioned && maxTime > minTime) {
        const eventStart = timeToMinutes(event.startTime);
        const eventDuration = event.duration * 60;
        const dayDurationMinutes = maxTime - minTime;
        topPercent = ((eventStart - minTime) / dayDurationMinutes) * 100;
        heightPercent = (eventDuration / dayDurationMinutes) * 100;
    }

    const isEmptyBlock = event.borderDisable;

    return (
        <div
            className={`${isPositioned ? "absolute" : ""} ${isEmptyBlock ? "border-0" : "bg-(--color-secondary) border-2 border-(--color-seconde-black) rounded-lg p-3 shadow-md"
                } ${!isPositioned && !isEmptyBlock ? "border-2 border-(--color-seconde-black) rounded-lg p-3 text-(--color-seconde-black) flex flex-col gap-1 shadow-md" : ""} text-(--color-seconde-black) flex flex-col gap-1 overflow-hidden`}
            style={
                isPositioned
                    ? {
                        top: `${topPercent}%`,
                        height: `${heightPercent}%`,
                        left: "0.5rem",
                        right: "0.5rem",
                    }
                    : {}
            }
        >
            {!isEmptyBlock ? (
                <>
                    <div className="font-bold text-xs text-(--color-seconde-black) opacity-60 mb-[0.15rem] flex items-center gap-1">
                        {event.startTime} - {getEndTime(event.startTime, event.duration)}
                    </div>
                    {event.title && (
                        <div className="text-(--color-primary) font-extrabold text-[1.2rem] leading-[1.2]">{event.title}</div>
                    )}
                    {event.location && (
                        <div className="font-bold text-md text-(--color-seconde-black) flex items-center gap-1 mt-1">
                            <svg width="15" height="18" viewBox="0 0 10 14" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-none flex-shrink-0">
                                <path d="M5 0C2.24 0 0 2.24 0 5C0 8.75 5 14 5 14C5 14 10 8.75 10 5C10 2.24 7.76 0 5 0ZM5 6.8C4.01 6.8 3.2 5.99 3.2 5C3.2 4.01 4.01 3.2 5 3.2C5.99 3.2 6.8 4.01 6.8 5C6.8 5.99 5.99 6.8 5 6.8Z" fill="#E86A92" />
                            </svg>
                            <span className="overflow-hidden text-ellipsis line-clamp-2">{event.location}</span>
                        </div>
                    )}
                </>
            ) : (
                <div className="align-center content-center text-(--color-secondary) dark:text-(--color-primary) m-auto">
                    {event.title && (
                        <div className="pt-2 text-center text-xl font-extrabold leading-[1.2]">
                            {event.title}
                        </div>
                    )}
                    {event.location && (
                        <div className="font-bold text-3xl text-(--color-seconde-black) flex items-center gap-1 mt-1">
                            <svg width="10" height="12" viewBox="0 0 10 14" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-none flex-shrink-0">
                                <path d="M5 0C2.24 0 0 2.24 0 5C0 8.75 5 14 5 14C5 14 10 8.75 10 5C10 2.24 7.76 0 5 0ZM5 6.8C4.01 6.8 3.2 5.99 3.2 5C3.2 4.01 4.01 3.2 5 3.2C5.99 3.2 6.8 4.01 6.8 5C6.8 5.99 5.99 6.8 5 6.8Z" fill="#E86A92" />
                            </svg>
                            <span className="overflow-hidden text-ellipsis line-clamp-2">{event.location}</span>
                        </div>
                    )}
                    {event.content && (
                        <div className="text-center text-md leading-[1.3] mt-1 overflow-hidden text-ellipsis line-clamp-3">
                            {renderContent(event.content)}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default function Programme() {
    // Calculer les heures min/max globales
    const allTimes = programme.flatMap(day => {
        const times = day.events.map(e => timeToMinutes(e.startTime));
        const endTimes = day.events.map(e => timeToMinutes(e.startTime) + e.duration * 60);
        return [...times, ...endTimes];
    });

    const globalMinTime = Math.floor(Math.min(...allTimes) / 60) * 60; // Arrondir à l'heure inf
    const globalMaxTime = Math.ceil(Math.max(...allTimes) / 60) * 60; // Arrondir à l'heure sup
    const totalHours = (globalMaxTime - globalMinTime) / 60;

    const renderEventBlock = (event: EventBlock, minTime: number, maxTime: number) => {
        return <EventCard key={event.startTime} event={event} isPositioned={true} minTime={minTime} maxTime={maxTime} />;
    };

    return (
        <div className="w-full flex justify-center">
            {/* ── Desktop: Timeline view ── */}
            <div className="hidden lg:flex justify-center gap-6 w-full max-w-[1400px] px-4">
                {/* ── Timeline Axis (Left) ── */}
                <div className="flex flex-col relative pt-10" style={{ minWidth: "60px" }}>
                    <div className="absolute top-14 bottom-0 left-1/2 -translate-x-1/2 w-[2px] border-l-[2px] border-dotted border-(--color-primary) dark:border-(--color-secondary)" />
                    {Array.from({ length: Math.floor(totalHours) + 1 }).map((_, i) => {
                        const hour = Math.floor(globalMinTime / 60) + i;
                        return (
                            <div
                                key={i}
                                className="flex flex-col items-center justify-center text-(--color-primary) dark:text-(--color-secondary) font-extrabold text-[0.85rem] relative z-10"
                                style={{ height: `${(60 / (globalMaxTime - globalMinTime)) * 100}%` }}
                            >
                                <span className="bg-(--color-secondary) dark:bg-(--color-seconde-black) transition-all duration-300 px-1 py-[0.1rem]">{hour}h</span>
                            </div>
                        );
                    })}
                </div>

                {/* ── Day Columns ── */}
                {programme.map((day) => {
                    const timeRange = getDayTimeRange(day.events);
                    const dayDuration = timeRange.maxTime - timeRange.minTime;
                    const dayHours = dayDuration / 60;

                    return (
                        <div
                            key={day.day}
                            className="flex-1 bg-(--color-primary) dark:bg-(--color-secondary) transition-all duration-300 rounded-2xl flex flex-col p-[0.8rem] pb-8"
                            style={{ minWidth: "240px" }}
                        >
                            <div className="text-white dark:text-(--color-seconde-black) font-black text-xl text-center uppercase pb-[0.4rem] mb-3 relative after:content-[''] after:absolute after:bottom-0 after:-left-2 after:-right-2 after:h-[3px] after:bg-white dark:after:bg-(--color-seconde-black) transition-all duration-300">
                                {day.day}
                            </div>

                            <div
                                className="relative flex-1"
                                style={{
                                    minHeight: `${dayHours * 55}px`,
                                }}
                            >
                                {day.events.map((event) => renderEventBlock(event, timeRange.minTime, timeRange.maxTime))}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* ── Tablet/Mobile: Card view ── */}
            <div className="flex flex-row overflow-x-scroll lg:hidden flex-col gap-6 w-full max-w-2xl mx-auto mt-0 px-4">
                {programme.map((day) => (
                    <div key={day.day} className="min-w-[calc(100vw-35px)] bg-(--color-primary) dark:bg-(--color-secondary) transition-all duration-300 rounded-2xl flex flex-col p-[0.8rem] pb-8 w-full">
                        <div className="text-white dark:text-(--color-seconde-black) font-black text-xl text-center uppercase pb-[0.4rem] mb-3 relative after:content-[''] after:absolute after:bottom-0 after:-left-2 after:-right-2 after:h-[3px] after:bg-white dark:after:bg-(--color-seconde-black) transition-all duration-300">
                            {day.day}
                        </div>
                        <div className="flex flex-col gap-3">
                            {day.events.map((event) => (
                                <div key={event.startTime} className="flex flex-col gap-1">
                                    <EventCard event={event} isPositioned={false} />
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
