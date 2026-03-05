"use client";

import React, { useState } from "react";

type SlotType = "Matin" | "Déjeuner" | "Après-midi" | "Soirée";

interface Event {
    time: string;
    activity: string;
    details?: string;
    location?: string;
    slot: SlotType;
    type?: "dejeuner" | "soiree" | "soiree-highlight";
}

interface DaySchedule {
    day: string;
    date: string;
    events: Event[];
}

const SLOTS: SlotType[] = ["Matin", "Déjeuner", "Après-midi", "Soirée"];

const programme: DaySchedule[] = [
    {
        day: "Mardi",
        date: "26/05",
        events: [
            {
                time: "15h30",
                slot: "Après-midi",
                activity: "Ouverture des JNM26",
                location: "U4-Amphi Concorde",
                details: "Discours de la présidence et mise en valeur des entreprises-partenaires. « 1 minute entreprise ».",
            },
            {
                time: "16h30-18h",
                slot: "Après-midi",
                activity: "Activité « Ice Breaker »",
                location: "Central + Bât. 2A",
                details: "Safari photos, Pictionnary, Anecdotes... Découverte du campus.",
            },
            {
                time: "A partir de 19h",
                slot: "Soirée",
                activity: "Soirée d'Accueil",
                location: "Cafétéria UPSIDUM",
                details: "Buffet dinatoire + Soirée ATEM.",
                type: "soiree",
            },
        ],
    },
    {
        day: "Mercredi",
        date: "27/05",
        events: [
            {
                time: "08h00-9h00",
                slot: "Matin",
                activity: "Petit-déjeuner à l'Université",
                location: "Université de Toulouse",
                details: "Manger miaaaaaaaam miaaaaaam miaaaaam",
            },
            {
                time: "09h00-10h30",
                slot: "Matin",
                activity: "Rencontres ALUMNI",
                location: "Bâtiment 2A",
                details: "Tables rondes métiers & carrières : perspectives, entreprenariat, V.I.E.",
            },
            {
                time: "11h00-12h30",
                slot: "Matin",
                activity: "Forum entreprises",
                location: "2A ou BU",
                details: "Rencontres avec CGI, CAPGEMINI, LBP, BPCE, SKYINCAP...",
            },
            {
                time: "Déjeuner",
                slot: "Déjeuner",
                activity: "Buffet-FORUM",
                location: "Devant le 2A",
                details: "Déjeuner réseau interactif.",
                type: "dejeuner",
            },
            {
                time: "14h00-15h30",
                slot: "Après-midi",
                activity: "Ateliers IA",
                location: "Bâtiment 2A",
                details: "Challenges IA « conscientisée » avec CAPGEMINI.",
            },
            {
                time: "16h00-18h00",
                slot: "Après-midi",
                activity: "Atelier E-sport",
                location: "Bâtiment 2A",
                details: "Étudiants vs Entreprises avec CGI et EXTIA.",
            },
            {
                time: "A partir de 19h",
                slot: "Soirée",
                activity: "Soirée centre ville",
                location: "Central / Bowling",
                details: "Bowling ou Soirée conviviale / Quizz MIAGE & Kahoot.",
                type: "soiree",
            },
        ],
    },
    {
        day: "Jeudi",
        date: "28/05",
        events: [
            {
                time: "Matinée",
                slot: "Matin",
                activity: "Découverte Toulouse",
                location: "Centre Ville",
                details: "Jeu de piste ou Course découverte en ville.",
            },
            {
                time: "Matinée",
                slot: "Matin",
                activity: "Assemblée générale du commité des directeurs des MIAGE (CDM)",
                location: "Salle Conseil",
                details: "Assemblée Générale du CDM en parallèle.",
            },
            {
                time: "Déjeuner",
                slot: "Déjeuner",
                activity: "Déjeuner sur l'herbe",
                location: "Prairie des Filtres",
                details: "Pique-nique convivial (Plan B à la fac si pluie).",
                type: "dejeuner",
            },
            {
                time: "15h30-16h30",
                slot: "Après-midi",
                activity: "Conférence Cyber",
                location: "U4-Amphi Concorde",
                details: "Aéronautique & Cybersécurité avec Airbus, CGI.",
            },
            {
                time: "16h45-18h00",
                slot: "Après-midi",
                activity: "Pitch en ascenseur",
                location: "Salles U6",
                details: "Atelier com' pro (Pecha Kucha) avec Marc BOYER.",
            },
            {
                time: "A partir de 19h",
                slot: "Soirée",
                activity: "Soirée centre ville",
                location: "Place St Pierre",
                details: "Bar à jeux ou ambiance Place St Pierre.",
                type: "soiree-highlight",
            },
        ],
    },
    {
        day: "Vendredi",
        date: "29/05",
        events: [
            {
                time: "09h00-12h00",
                slot: "Matin",
                activity: "Concours Vidéo",
                location: "Amphi Médecine",
                details: "Présentation des vidéos Concours MIAGE & AG CDM 2.",
            },
            {
                time: "Déjeuner",
                slot: "Déjeuner",
                activity: "Pique-nique",
                location: "Jardin des Plantes",
                details: "Détente au Jardin des Plantes.",
                type: "dejeuner",
            },
            {
                time: "14h00-16h00",
                slot: "Après-midi",
                activity: "Clôture & Résultats",
                location: "Amphi Médecine",
                details: "Annonce des gagnants et clôture officielle.",
            },
            {
                time: "A partir de 19h",
                slot: "Soirée",
                activity: "GALA",
                location: "Lieu à venir",
                details: "Grande soirée de gala de fin de JNM.",
                type: "soiree-highlight",
            },
        ],
    },
    {
        day: "Samedi",
        date: "30/05",
        events: [
            {
                time: "Matinée",
                slot: "Matin",
                activity: "Activité sportive",
                location: "À définir",
                details: "Paintball ou course d'orientation (Optionnel).",
            },
        ],
    },
];

function eventBgClass(type?: string) {
    if (type === "dejeuner") return "bg-[#f0f7f7] text-[#3d6b6b] border-l-2 border-[#3d6b6b]";
    if (type === "soiree") return "bg-[#fdf0f4] text-[#c76d8a] border-l-2 border-[#c76d8a]";
    if (type === "soiree-highlight") return "bg-[#e8a0b4] text-white border-l-2 border-white";
    return "bg-white text-slate-700 border-l-2 border-[#5b8e8e]";
}

function tagClass(type?: string) {
    if (type === "soiree-highlight") return "bg-white/20 text-white";
    return "bg-black/5 text-slate-500";
}

const InfoIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-60 group-hover:opacity-100 transition-opacity">
        <circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>
    </svg>
);

const PinIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="mr-1 opacity-70">
        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>
    </svg>
);

export default function Programme() {
    const [tooltip, setTooltip] = useState<{ content: string; x: number; y: number } | null>(null);

    return (
        <div className="w-full">
            {/* ── Desktop View (Calendar Week) ── */}
            <div className="hidden lg:block overflow-x-auto rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-slate-100 bg-white p-2">
                <table className="w-full border-collapse table-fixed">
                    <thead>
                        <tr>
                            <th className="w-24 p-4"></th>
                            {programme.map((d) => (
                                <th key={d.day} className="p-4 text-center">
                                    <div className="text-[#5b8e8e] font-black text-xl tracking-tight uppercase">{d.day}</div>
                                    <div className="text-slate-400 font-medium text-sm">{d.date}</div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {SLOTS.map((slot) => (
                            <tr key={slot} className="border-t border-slate-50">
                                <td className="p-4 text-right align-middle">
                                    <div className="text-slate-400 font-bold text-xs uppercase tracking-widest leading-none">{slot}</div>
                                </td>
                                {programme.map((d) => {
                                    const events = d.events.filter(e => e.slot === slot);
                                    return (
                                        <td key={`${d.day}-${slot}`} className="p-2 align-top h-36">
                                            <div className="flex flex-col gap-2 h-full">
                                                {events.map((e, i) => (
                                                    <div 
                                                        key={i}
                                                        className={`group relative p-2.5 rounded-xl text-[0.8rem] leading-tight flex flex-col transition-all hover:scale-[1.02] hover:shadow-md ${eventBgClass(e.type)}`}
                                                        onMouseEnter={(ev) => e.details && setTooltip({ content: e.details, x: ev.clientX, y: ev.clientY })}
                                                        onMouseLeave={() => setTooltip(null)}
                                                    >
                                                        <div className="font-bold mb-1.5 truncate">{e.activity}</div>
                                                        
                                                        {e.location && (
                                                            <div className={`inline-flex items-center self-start px-2 py-0.5 rounded-md text-[0.6rem] font-bold mb-2 ${tagClass(e.type)}`}>
                                                                <PinIcon />
                                                                {e.location}
                                                            </div>
                                                        )}

                                                        <div className="mt-auto flex justify-between items-end">
                                                            <span className="text-[0.65rem] font-black opacity-60 uppercase">{e.time}</span>
                                                            {e.details && <InfoIcon />}
                                                        </div>
                                                    </div>
                                                ))}
                                                {events.length === 0 && (
                                                    <div className="h-full rounded-xl bg-slate-50/50 border border-dashed border-slate-100"></div>
                                                )}
                                            </div>
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* ── Mobile/Tablet View (Stacked Days) ── */}
            <div className="lg:hidden space-y-8">
                {programme.map((day) => (
                    <div key={day.day} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                        <div className="flex items-baseline gap-2 mb-6 border-b border-slate-50 pb-4">
                            <h3 className="text-2xl font-black text-[#5b8e8e] uppercase tracking-tighter">{day.day}</h3>
                            <span className="text-slate-300 font-bold">{day.date}</span>
                        </div>
                        <div className="space-y-4">
                            {day.events.map((event, idx) => (
                                <div key={idx} className={`p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center gap-4 ${eventBgClass(event.type)}`}>
                                    <div className="w-24 shrink-0 text-center border-b sm:border-b-0 sm:border-r border-black/5 pb-2 sm:pb-0 sm:pr-4">
                                        <div className="text-[0.65rem] font-black opacity-50 uppercase leading-none mb-1">{event.slot}</div>
                                        <div className="text-[0.8rem] font-bold tracking-tight">{event.time}</div>
                                    </div>
                                    <div className="flex-1">
                                        <div className="font-bold text-sm mb-1.5 flex items-center justify-between">
                                            {event.activity}
                                            {event.location && (
                                                <span className={`px-2 py-0.5 rounded-md text-[0.6rem] font-bold flex items-center ${tagClass(event.type)}`}>
                                                    <PinIcon />
                                                    {event.location}
                                                </span>
                                            )}
                                        </div>
                                        {event.details && (
                                            <div className="text-[0.75rem] opacity-80 leading-snug">
                                                {event.details}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Tooltip ── */}
            {tooltip && (
                <div 
                    className="fixed z-50 pointer-events-none bg-slate-900 text-white text-[0.75rem] p-3 rounded-xl shadow-2xl max-w-xs animate-in fade-in zoom-in duration-150"
                    style={{ left: tooltip.x + 15, top: tooltip.y + 15 }}
                >
                    {tooltip.content}
                </div>
            )}
        </div>
    );
}
