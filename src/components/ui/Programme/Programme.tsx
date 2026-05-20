import React, { Fragment } from "react";

// Conversion heure -> nombre
const timeToMinutes = (time: string): number => {
    const [hours, minutes] = time.split("h").map(Number);
    return hours * 60 + (minutes || 0);
};

// Format heure à partir de minutes depuis minuit
const minutesToTime = (minutes: number): string => {
    const h = Math.floor(minutes / 60);
    const hAdjusted = h >= 24 ? h - 24 : h; // Ajuster si dépasse 24h
    const m = minutes % 60;
    return m === 0 ? `${hAdjusted}h` : `${hAdjusted}h${m}`;
};

interface EventBlock {
    title?: string;
    location?: string;
    content?: string;
    startTime: string; // Format: "9h", "14h30", etc
    duration: number; // En heures (peut être 2.5, 3, 4, etc)
    size?: number;
    position?: "minimum" | "midium" | "medium";
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
                title: "Arrivée des participants → Université de Toulouse",
                // Midi picnique ou crous
                content: "Pensez à apporter votre repas du midi ou à prévoir une solution de restauration sur place (Crous, restaurants à proximité, etc).",
                startTime: "8h",
                duration: 7.5,
                size: 7.4,
            },
            {
                title: "Ouverture JNM 2026",
                location: "Ampi Concorde, Bât. U4",
                // content: "14h: Étiquetage bagages & jeux d'attente\n15h: Ouverture JNM26 & Discours\n16h - 18h: Activité « Ice Breaker »",
                startTime: "15h30",
                duration: 3,
                size: 2.9
            },
            {
                title: "Cocktail de bienvenue",
                location: "Upsidum",
                // content: "Détails à définir",
                startTime: "18h30",
                duration: 2.5,
                size: 2.4,
            },
            {
                title: "Soirée au délirium",
                location: "Délirium Café",
                // content: "Détails à définir",
                startTime: "21h",
                duration: 3,
            },
            {
                title: "",
                startTime: "24h",
                duration: 2,
                borderDisable: true,
            },
        ],
    },
    {
        day: "Mercredi 27/05",
        events: [
            {
                title: "Petit déjeuner",
                location: "Bât. 2A",
                startTime: "8h",
                duration: 1,
                size: 0.901,
                position: "minimum"
            },
            {
                title: "Rencontres ALUMNI",
                location: "Amphi GRIGNARD & Salles 2A",
                // content: "09h - 10h30: Tables rondes Alumni (Perspectives métiers, carrières, VIE, consulting, influence)\n11h - 12h30: Forum des entreprises (Rencontres MIAGE/Alumni)",
                startTime: "9h",
                duration: 1.5,
                size: 1.4,
                position: "medium"
            },
            {
                title: "Forum des partenaires*",
                location: "Bât. U6",
                // content: "09h - 10h30: Tables rondes Alumni (Perspectives métiers, carrières, VIE, consulting, influence)\n11h - 12h30: Forum des entreprises (Rencontres MIAGE/Alumni)",
                startTime: "11h",
                duration: 1.5,
                position: "medium"
            },
            {
                title: "Repas & Networking",
                location: "Bât. 2A",
                //  content: "Buffet avec les partenaires",
                startTime: "12h30",
                duration: 1.5,
                borderDisable: true,
            },
            {
                title: "Ateliers & Intervenants",
                //   content: "14h - 15h30: Green IT (IA & empreinte carbone / IA conscientisée)\n16h - 18h: E-Sport (Étudiants vs Entreprises avec CGI & EXTIA)",
                location: "Salles 2A",
                startTime: "14h",
                duration: 1.5,
                size: 1.9
            },
            {
                title: "Atelier E-sport",
                //   content: "14h - 15h30: Green IT (IA & empreinte carbone / IA conscientisée)\n16h - 18h: E-Sport (Étudiants vs Entreprises avec CGI & EXTIA)",
                location: "Bât. 2A",
                startTime: "16h",
                duration: 2,
            },
            {
                title: "PAUSE",
                startTime: "18h",
                duration: 2,
                borderDisable: true,
            },
            {
                title: "Soirée étudiante",
                location: "",
                startTime: "20h",
                duration: 4,
            },
            {
                title: "",
                startTime: "24h",
                duration: 2,
                borderDisable: true,
            },
        ],
    },
    {
        day: "Jeudi 28/05",
        events: [
            {
                title: "Petit déjeuner",
                location: "Bât. 2A",
                startTime: "8h",
                duration: 1,
                size: 0.901,
                position: "minimum"
            },
            {

                title: "Jeux de pistes de Toulouse",
                location: "Centre-ville",
                //  content: "Découverte de Toulouse / Jeux de piste\n\nAG CDM en parallèle.",
                startTime: "9h",
                duration: 3,
            },
            {
                title: "Dejeuner sur l'herbe",
                content: "Pique-nique",
                location: "Prairie des filtres",
                startTime: "12h",
                duration: 2,
                size: 2.5,
                borderDisable: true,
            },
            {
                title: "Conférences & Ateliers",
                location: "Amphi CONCORDE",
                //  content: "15h - 16h30: Conférence Table Ronde (Aéronautique / Cyberdéfense)\n16h45 - 18h: Atelier Pitch en ascenseur (Pecha Kucha)",
                startTime: "15h",
                duration: 1.5,
                size: 1.65,
            },
            {
                title: "Atelier pitch ascenseur",
                location: "Bât. U6",
                //  content: "15h - 16h30: Conférence Table Ronde (Aéronautique / Cyberdéfense)\n16h45 - 18h: Atelier Pitch en ascenseur (Pecha Kucha)",
                startTime: "16h45",
                duration: 1.25,
                size: 1.5,
                position: "medium"
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
                // content: "Quizz MIAGE & JNM (Kahoot)",
                startTime: "20h",
                duration: 4,
            },
            {
                title: "",
                startTime: "24h",
                duration: 2,
                borderDisable: true,
            },
        ],
    },
    {
        day: "Vendredi 29/05",
        events: [
            {
                title: "Petit déjeuner",
                location: "Amphi Médecine",
                startTime: "8h",
                duration: 1,
                size: 0.9,
                position: "minimum"
            },
            {
                title: "Concours MIAGE",
                location: "Amphi Médecine (Allées Jules Guesde)",
                //   content: "Présentation des vidéos / ballon de rugby Concours MIAGE",
                startTime: "9h",
                duration: 2,
                size: 1.9,
                position: "medium"
            },
            {
                title: "Activité Vélo Smoothie",
                location: "Amphi Médecine (Allées Jules Guesde)",
                startTime: "11h",
                duration: 1.5,
                size: 1.7,
                position: "medium"
            },
            {
                title: "Pique nique",
                startTime: "12h30",
                location: "Jardin des Plantes",
                duration: 1.5,
                borderDisable: true,
            },
            {
                title: "Clôture des JNM 2026",
                location: "Amphi Médecine",
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
                location: "Matabiau",
                startTime: "20h",
                duration: 6,
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
    column?: number;
    totalColumns?: number;
}

function EventCard({ event, isPositioned = false, minTime = 0, maxTime = 1440, column = 0, totalColumns = 1 }: EventCardProps) {
    let topPercent = 0;
    let heightPercent = 100;

    if (isPositioned && maxTime > minTime) {
        const eventStart = timeToMinutes(event.startTime);
        const eventDuration = (event.size ?? event.duration) * 60;
        const dayDurationMinutes = maxTime - minTime;
        topPercent = ((eventStart - minTime) / dayDurationMinutes) * 100;
        heightPercent = (eventDuration / dayDurationMinutes) * 100;
    }

    const isEmptyBlock = event.borderDisable;
    const isAside = totalColumns > 1;

    const positionedStyle = isPositioned ? {
        top: `${topPercent}%`,
        height: `${heightPercent}%`,
        left: `calc(${(column / totalColumns) * 100}% + 0.5rem)`,
        width: `calc(${(100 / totalColumns)}% - 1rem)`,
    } : {};

    const paddingClass = isAside ? "p-2" : "p-3";
    const gapClass = isAside ? "gap-0.5" : "gap-1";
    const titleClass = isAside ? "text-[0.95rem] leading-tight" : "text-[1.2rem] leading-[1.2]";
    const locationClass = isAside ? "text-xs mt-0.5" : "text-md mt-1";
    const timeClass = isAside ? "text-[0.65rem] mb-0" : "text-xs mb-[0.15rem]";
    const contentClass = isAside ? "text-[0.75rem] leading-tight mt-0.5" : "text-[0.85rem] leading-[1.3] mt-1";
    const iconProps = isAside ? { width: "10", height: "12" } : { width: "15", height: "18" };

    return (
        <div
            className={`${isPositioned ? "absolute" : ""} ${isEmptyBlock ? "border-0" : `bg-(--color-secondary) border-2 border-(--color-seconde-black) rounded-lg ${paddingClass} shadow-md ${event.position === "minimum" ? "lg:flex lg:flex-row" : ""}`
                } ${!isPositioned && !isEmptyBlock ? `border-2 border-(--color-seconde-black) rounded-lg ${paddingClass} text-(--color-seconde-black) flex flex-col ${gapClass} shadow-md` : ""} text-(--color-seconde-black) flex flex-col ${gapClass} overflow-hidden`}
            style={positionedStyle}
        >
            {!isEmptyBlock ? (
                <>
                    <div className={event.position === "medium" || event.position === "minimum" ? "lg:flex" : ""}>
                        <div className={`font-bold ${timeClass} text-(--color-seconde-black) opacity-60 flex items-center gap-1`}>
                            {event.startTime} - {getEndTime(event.startTime, event.duration)}
                        </div>
                        {event.title && (
                            <div className={`text-(--color-primary) font-extrabold ${titleClass} ${event.position === "medium" ? "lg:-mt-0.5 lg:ml-2 md:text-[0.75rem] lg:text-[1rem]" : ""} ${event.position === "minimum" && event.size !== 0.9 ? "md:text-[0.7rem] lg:text-[0.85rem] lg:mt-[-7px]" : ""} ${event.position === "minimum" && event.size === 0.9 ? "lg:text-[0.8rem] lg:mt-[-5px]" : ""} ${event.position === "minimum" && event.size === 0.901 ? "md:text-[1rem] md:mt-[-2px] lg:!mt-0" : ""} ${event.position === "minimum" ? "xl:mx-3.5" : ""}`}>{event.title}</div>
                        )}
                    </div>

                    {event.location && (
                        <div className={`font-bold ${locationClass} ${event.position === "minimum" ? "md:text-[0.85rem]" : ""} ${event.position === "minimum" ? "lg:mt-[-1px]" : ""} text-(--color-seconde-black) flex items-center gap-1`}>
                            <svg width={iconProps.width} height={iconProps.height} viewBox="0 0 10 14" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-none flex-shrink-0">
                                <path d="M5 0C2.24 0 0 2.24 0 5C0 8.75 5 14 5 14C5 14 10 8.75 10 5C10 2.24 7.76 0 5 0ZM5 6.8C4.01 6.8 3.2 5.99 3.2 5C3.2 4.01 4.01 3.2 5 3.2C5.99 3.2 6.8 4.01 6.8 5C6.8 5.99 5.99 6.8 5 6.8Z" fill="#E86A92" />
                            </svg>
                            <span className="overflow-hidden text-ellipsis line-clamp-2">{event.location}</span>
                        </div>
                    )}
                    {event.content && (
                        <div className={`text-(--color-seconde-black) opacity-90 ${contentClass} overflow-hidden text-ellipsis line-clamp-3`}>
                            {renderContent(event.content)}
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
                        <div className="font-bold text-md text-(--color-seconde-black) flex items-center justify-center gap-1 mt-1">
                            <svg width="15" height="18" viewBox="0 0 10 14" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-none flex-shrink-0">
                                <path d="M5 0C2.24 0 0 2.24 0 5C0 8.75 5 14 5 14C5 14 10 8.75 10 5C10 2.24 7.76 0 5 0ZM5 6.8C4.01 6.8 3.2 5.99 3.2 5C3.2 4.01 4.01 3.2 5 3.2C5.99 3.2 6.8 4.01 6.8 5C6.8 5.99 5.99 6.8 5 6.8Z" fill="#E86A92" />
                            </svg>
                            <span className="overflow-hidden text-ellipsis line-clamp-2">{event.location}</span>
                        </div>
                    )}
                    {event.content && (
                        <div className="text-center text-[0.85rem] leading-[1.3] mt-1 overflow-hidden text-ellipsis line-clamp-3">
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

    const renderDayEvents = (day: DaySchedule, minTime: number, maxTime: number) => {
        const groups: Record<string, EventBlock[]> = {};
        day.events.forEach(event => {
            if (!groups[event.startTime]) groups[event.startTime] = [];
            groups[event.startTime].push(event);
        });

        return Object.values(groups).flatMap((group) =>
            group.map((event, index) => (
                <EventCard
                    key={`${event.startTime}-${event.title || index}`}
                    event={event}
                    isPositioned={true}
                    minTime={minTime}
                    maxTime={maxTime}
                    column={index}
                    totalColumns={group.length}
                />
            ))
        );
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

                        // If hour is outside 24h range then - 24
                        const adjustedHour = hour >= 24 ? hour - 24 : hour;
                        return (
                            <div
                                key={i}
                                className="flex flex-col items-center justify-center text-(--color-primary) dark:text-(--color-secondary) font-extrabold text-[0.85rem] relative z-10"
                                style={{ height: `${(60 / (globalMaxTime - globalMinTime)) * 100}%` }}
                            >
                                <span className="bg-(--color-secondary) dark:bg-(--color-seconde-black) transition-all duration-300 px-1 py-[0.1rem]">{adjustedHour}h</span>
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
                                {renderDayEvents(day, timeRange.minTime, timeRange.maxTime)}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* ── Tablet/Mobile: Card view ── */}
            <div className="flex flex-row overflow-x-scroll lg:hidden flex-col gap-6 w-full max-w-2xl mx-auto mt-0 px-4">
                {programme.map((day) => (
                    <div key={day.day} className="min-w-[calc(100vw-35px)] md:min-w-[calc(90vw-200px)] bg-(--color-primary) dark:bg-(--color-secondary) transition-all duration-300 rounded-2xl flex flex-col p-[0.8rem] pb-8 w-full">
                        <div className="text-white dark:text-(--color-seconde-black) font-black text-xl text-center uppercase pb-[0.4rem] mb-3 relative after:content-[''] after:absolute after:bottom-0 after:-left-2 after:-right-2 after:h-[3px] after:bg-white dark:after:bg-(--color-seconde-black) transition-all duration-300">
                            {day.day}
                        </div>
                        <div className="flex flex-col gap-3">
                            {day.events.map((event, index) => (
                                <div key={`${event.startTime}-${index}`} className="flex flex-col gap-1">
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
