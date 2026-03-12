import React from "react";

const timeSlots = [
    { name: "Matin", hours: "9h", endTime: "12h" },
    { name: "Déjeuner", hours: "12h", endTime: "14h" },
    { name: "Après-midi", hours: "14h", endTime: "18h" },
    { name: "Soirée", hours: "20h", endTime: "…" },
] as const;

type TimeSlot = (typeof timeSlots)[number]["name"];

interface DaySchedule {
    day: string;
    slots: Record<TimeSlot, { title?: string; location?: string; content?: string; time?: string }>;
}

const programme: DaySchedule[] = [
    {
        day: "Mardi 26/05",
        slots: {
            Matin: {
                title: "Logistique Arrivées",
                content: "Récupération & Dépôt Hôtel\nRéception et orientation",
                time: "Matinée",
            },
            Déjeuner: { 
                title: "PAUSE" 
            },
            "Après-midi": {
                time: "14h - 18h",
                title: "Accueil & Ouverture",
                location: "Amphi CONCORDE, Bât. U4",
                content: "14h: Étiquetage bagages & jeux d'attente\n15h: Ouverture JNM26 & Discours\n16h - 18h: Activité « Ice Breaker »",
            },
            Soirée: { 
                title: "Soirée d'Accueil", 
                location: "Esplanade ou l'Upsidom",
                content: "Détails à définir"
            },
        },
    },
    {
        day: "Mercredi 27/05",
        slots: {
            Matin: {
                time: "09h - 12h30",
                title: "Rencontres ALUMNI & Forum",
                location: "Amphi GRIGNARD & Salles 2A",
                content: "09h - 10h30: Tables rondes Alumni (Perspectives métiers, carrières, VIE, consulting, influence)\n11h - 12h30: Forum des entreprises (Rencontres MIAGE/Alumni)",
            },
            Déjeuner: { 
                title: "PAUSE",
                content: "Buffet avec entreprises\nLieu: Bât. 2A (pergola + pelouse)",
                time: "12h30 - 14h"
            },
            "Après-midi": {
                title: "Ateliers & Challenges",
                time: "14h - 18h",
                content: "14h - 15h30: Green IT (IA & empreinte carbone / IA conscientisée)\n16h - 18h: E-Sport (Étudiants vs Entreprises avec CGI & EXTIA)",
            },
            Soirée: { 
                title: "Bowling", 
            },
        },
    },
    {
        day: "Jeudi 28/05",
        slots: {
            Matin: { 
                time: "Matinée",
                title: "Team building", 
                location: "Centre-ville",
                content: "Découverte de Toulouse / Jeux de piste\n\nAG CDM en parallèle." 
            },
            Déjeuner: { 
                title: "PAUSE",
                content: "Déjeuner sur l'herbe (Prairie des filtres)\nou Pique-nique (Jardin des Plantes)",
                time: "Midi"
            },
            "Après-midi": {
                title: "Conférences & Ateliers",
                time: "15h - 18h",
                location: "Amphi CONCORDE / GRIGNARD",
                content: "15h - 16h30: Conférence Table Ronde (Aéronautique / Cyberdéfense)\n16h45 - 18h: Atelier Pitch en ascenseur (Pecha Kucha)",
            },
            Soirée: { 
                title: "Soirée conviviale", 
                location: "« Central » de la fac",
                content: "Quizz MIAGE & JNM (Kahoot)" 
            },
        },
    },
    {
        day: "Vendredi 29/05",
        slots: {
            Matin: { 
                time: "09h - Midi",
                title: "Concours MIAGE", 
                location: "Amphi Médecine (Allées Jules Guesde)",
                content: "Présentation des vidéos / ballon de rugby Concours MIAGE" 
            },
            Déjeuner: { 
                title: "PAUSE" 
            },
            "Après-midi": {
                time: "14h - 16h",
                title: "Clôture",
                content: "Résultats « Concours MIAGE »\nClôture de l'événement",
            },
            Soirée: { 
                title: "GALA", 
            },
        },
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

export default function Programme() {
    return (
        <div className="w-full flex justify-center">
            <div className="hidden md:flex justify-center gap-6 w-full max-w-[1200px]">
                {/* ── Timeline Axis (Left) ── */}
                <div className="flex flex-col py-[0.8rem] pb-8 relative">
                    <div className="absolute top-[4.5rem] bottom-8 left-1/2 -translate-x-1/2 w-[2px] border-l-[2px] border-dotted border-(--color-primary) dark:border-(--color-secondary) z-0" />
                    <div className="text-xl pb-[0.4rem] mb-3 invisible" aria-hidden="true">
                        &nbsp;
                    </div>
                    <div className="grid grid-rows-4 gap-3 flex-1 relative z-10">
                        {timeSlots.map((slot) => (
                            <div key={slot.name} className="flex flex-col items-center justify-center text-(--color-primary) dark:text-(--color-secondary) font-extrabold text-[0.9rem]">
                                <span className="bg-(--color-secondary) dark:bg-(--color-seconde-black) py-[0.2rem] z-10 select-none">{slot.hours}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── Day Columns ── */}
                {programme.map((day) => (
                    <div key={day.day} className="flex-1 bg-(--color-primary) dark:bg-(--color-secondary) rounded-2xl flex flex-col p-[0.8rem] pb-8 md:min-h-[700px] md:max-w-[260px]">
                        <div className="text-white dark:text-(--color-seconde-black) font-black text-xl text-center uppercase pb-[0.4rem] mb-3 relative after:content-[''] after:absolute after:bottom-0 after:-left-2 after:-right-2 after:h-[3px] after:bg-white dark:after:bg-(--color-seconde-black)">
                            {day.day}
                        </div>
                        
                        <div className="grid grid-rows-4 gap-3 flex-1">
                            {timeSlots.map((slot) => {
                                const cell = day.slots[slot.name];
                                
                                // Render empty space if no content
                                if (!cell.title && !cell.content) {
                                    return <div key={slot.name} className="flex-1" />;
                                }

                                return (
                                    <div key={slot.name} className="flex-1 bg-white border-2 border-(--color-seconde-black) rounded-lg p-3 text-(--color-seconde-black) relative text-[0.85rem] flex flex-col gap-1 shadow-md">
                                        <div className="font-bold text-xs text-(--color-seconde-black) opacity-60 mb-[0.15rem] flex items-center gap-1">
                                            {cell.time || `${slot.hours} - ${slot.endTime}`}
                                        </div>
                                        {cell.title && <div className="text-(--color-primary) font-extrabold text-[0.95rem] leading-[1.2] space-y-1">{cell.title}</div>}
                                        {cell.location && (
                                            <div className="font-bold text-[0.8rem] text-(--color-seconde-black) flex items-center gap-1 mt-1">
                                                <svg width="10" height="12" viewBox="0 0 10 14" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-none">
                                                    <path d="M5 0C2.24 0 0 2.24 0 5C0 8.75 5 14 5 14C5 14 10 8.75 10 5C10 2.24 7.76 0 5 0ZM5 6.8C4.01 6.8 3.2 5.99 3.2 5C3.2 4.01 4.01 3.2 5 3.2C5.99 3.2 6.8 4.01 6.8 5C6.8 5.99 5.99 6.8 5 6.8Z" fill="#E86A92"/>
                                                </svg>
                                                {cell.location}
                                            </div>
                                        )}
                                        {cell.content && <div className="text-(--color-primary) text-[0.8rem] leading-[1.3] mt-1">{renderContent(cell.content)}</div>}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Mobile: Card view ── */}
            <div className="flex md:hidden flex-col gap-6 w-full max-w-lg mx-auto mt-8 px-4 sm:px-0">
                {programme.map((day) => (
                    <div key={day.day} className="flex-1 bg-(--color-primary) dark:bg-(--color-secondary) rounded-2xl flex flex-col p-[0.8rem] pb-8 w-full max-w-none min-h-0">
                        <div className="text-white dark:text-(--color-seconde-black) font-black text-xl text-center uppercase pb-[0.4rem] mb-3 relative after:content-[''] after:absolute after:bottom-0 after:-left-2 after:-right-2 after:h-[3px] after:bg-white dark:after:bg-(--color-seconde-black)">
                            {day.day}
                        </div>
                        <div className="flex flex-col gap-3">
                            {timeSlots.map((slot) => {
                                const cell = day.slots[slot.name];
                                if (!cell.title && !cell.content) return null;

                                return (
                                    <div key={slot.name} className="flex flex-col gap-1">
                                        <div className="text-white dark:text-(--color-seconde-black) font-bold text-sm italic ml-1 drop-shadow-sm">
                                            {slot.name} ({slot.hours})
                                        </div>
                                        <div className="flex-1 bg-white border-2 border-(--color-seconde-black) rounded-lg p-3 text-(--color-seconde-black) relative text-[0.85rem] flex flex-col gap-1 shadow-md">
                                            <div className="font-bold text-xs text-(--color-seconde-black) opacity-60 mb-[0.15rem] flex items-center gap-1">
                                                {cell.time || `${slot.hours} - ${slot.endTime}`}
                                            </div>
                                            {cell.title && <div className="text-(--color-primary) font-extrabold text-[0.95rem] leading-[1.2]">{cell.title}</div>}
                                            {cell.location && (
                                                <div className="font-bold text-[0.8rem] text-(--color-seconde-black) flex items-center gap-1 mt-1">
                                                    <svg width="10" height="12" viewBox="0 0 10 14" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-none">
                                                        <path d="M5 0C2.24 0 0 2.24 0 5C0 8.75 5 14 5 14C5 14 10 8.75 10 5C10 2.24 7.76 0 5 0ZM5 6.8C4.01 6.8 3.2 5.99 3.2 5C3.2 4.01 4.01 3.2 5 3.2C5.99 3.2 6.8 4.01 6.8 5C6.8 5.99 5.99 6.8 5 6.8Z" fill="#E86A92"/>
                                                    </svg>
                                                    {cell.location}
                                                </div>
                                            )}
                                            {cell.content && <div className="text-(--color-primary) text-[0.8rem] leading-[1.3] mt-1">{renderContent(cell.content)}</div>}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
