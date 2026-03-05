import React from "react";

const timeSlots = [
    { name: "Matin", hours: "9h – 12h" },
    { name: "Déjeuner", hours: "12h – 14h" },
    { name: "Après-midi", hours: "14h – 18h" },
    { name: "Soirée", hours: "20h – …" },
] as const;

type TimeSlot = (typeof timeSlots)[number]["name"];

interface DaySchedule {
    day: string;
    shortDay: string;
    slots: Record<TimeSlot, { content: string; type?: "dejeuner" | "soiree" | "soiree-highlight" }>;
}

const programme: DaySchedule[] = [
    {
        day: "Mardi 26/05",
        shortDay: "Mar. 26",
        slots: {
            Matin: { content: "" },
            Déjeuner: { content: "" },
            "Après-midi": {
                content: "- Ouverture des JNM26\n- Activité « Ice Breaker »",
            },
            Soirée: { content: "Soirée d'Accueil", type: "soiree" },
        },
    },
    {
        day: "Mercredi 27/05",
        shortDay: "Mer. 27",
        slots: {
            Matin: {
                content:
                    "- Atelier « Intelligence Collective »\n- Rencontre avec les ALUMNI",
            },
            Déjeuner: { content: "Buffet déjeuner forum", type: "dejeuner" },
            "Après-midi": {
                content:
                    "- Challenges et ateliers Green IT : « IA et empreinte carbone »\n- Atelier E-Sport\n- Serious Games",
            },
            Soirée: { content: "Soirée conviviale", type: "soiree" },
        },
    },
    {
        day: "Jeudi 28/05",
        shortDay: "Jeu. 28",
        slots: {
            Matin: { content: "Team building : À la découverte de Toulouse" },
            Déjeuner: { content: "Déjeuner sur l'herbe", type: "dejeuner" },
            "Après-midi": {
                content:
                    "- Table ronde Challenge en (cyber)sécurité\n- Atelier du « pitch en ascenseur »",
            },
            Soirée: { content: "Soirée en ville", type: "soiree-highlight" },
        },
    },
    {
        day: "Vendredi 29/05",
        shortDay: "Ven. 29",
        slots: {
            Matin: { content: "Présentation des vidéos concours MIAGE" },
            Déjeuner: { content: "« Pique-nique »", type: "dejeuner" },
            "Après-midi": {
                content: "Résultats « Concours MIAGE » et clôture",
            },
            Soirée: { content: "GALA", type: "soiree-highlight" },
        },
    },
    {
        day: "Samedi 30/05",
        shortDay: "Sam. 30",
        slots: {
            Matin: { content: "Activité sportive" },
            Déjeuner: { content: "" },
            "Après-midi": { content: "" },
            Soirée: { content: "" },
        },
    },
];

function slotCellClass(slot: TimeSlot, type?: string) {
    if (type === "dejeuner") return "!bg-[#f0f7f7] !text-[#3d6b6b] font-semibold text-center";
    if (type === "soiree") return "!bg-[#fdf0f4] !text-[#c76d8a] font-semibold text-center";
    if (type === "soiree-highlight") return "!bg-[#e8a0b4] !text-white font-semibold text-center";
    return "";
}

function slotHeaderClass(slot: TimeSlot) {
    switch (slot) {
        case "Matin":
        case "Après-midi":
            return "!bg-[#5b8e8e] !text-white";
        case "Déjeuner":
            return "!bg-[#3d6b6b] !text-white";
        case "Soirée":
            return "!bg-[#e8a0b4] !text-white";
    }
}

function renderContent(content: string) {
    if (!content) return <span className="text-gray-400 text-sm">—</span>;
    return content.split("\n").map((line, j, arr) => (
        <span key={j}>
            {line}
            {j < arr.length - 1 && <br />}
        </span>
    ));
}

export default function Programme() {
    return (
        <>
            {/* ── Desktop: Table view ── */}
            <div className="hidden md:block w-full rounded-2xl">
                <table className="w-full border-separate border-spacing-0 text-[0.85rem] rounded-2xl overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.08)]">
                    <thead>
                        <tr>
                            <th className="bg-transparent border-r-2 border-white/25"></th>
                            {programme.map((d) => (
                                <th
                                    key={d.day}
                                    className="bg-[#5b8e8e] text-white font-bold text-center py-[0.85rem] px-3 text-[0.8rem] tracking-[0.02em] border-r-2 border-white/25 last:border-r-0"
                                >
                                    {d.day}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {timeSlots.map((slot, rowIndex) => (
                            <tr key={slot.name}>
                                <td className={`font-bold italic text-center whitespace-nowrap min-w-[90px] text-[0.95rem] border-r-2 border-white/25 py-3 px-[0.85rem] align-top bg-white text-[#333] leading-[1.45] ${rowIndex === timeSlots.length - 1 ? "" : "border-b-2 border-[#e8e8e8]"} ${slotHeaderClass(slot.name)}`}>
                                    {slot.name}
                                    <span className="block text-[0.7rem] not-italic font-normal opacity-85 mt-[2px]">{slot.hours}</span>
                                </td>
                                {programme.map((d) => {
                                    const cell = d.slots[slot.name];
                                    return (
                                        <td
                                            key={d.day}
                                            className={`py-3 px-[0.85rem] align-top bg-white text-[#333] leading-[1.45] border-r-2 border-[#e8e8e8] last:border-r-0 ${rowIndex === timeSlots.length - 1 ? "" : "border-b-2 border-[#e8e8e8]"} ${!cell.content ? "!bg-[#f9f9f9]" : ""} ${slotCellClass(slot.name, cell.type)}`}
                                        >
                                            {renderContent(cell.content)}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* ── Mobile: Card view ── */}
            <div className="flex md:hidden flex-col gap-5">
                {programme.map((day) => (
                    <div key={day.day} className="rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
                        <div className="bg-[#5b8e8e] text-white font-bold text-center py-3 px-4 text-[1.05rem] tracking-[0.02em]">
                            {day.day}
                        </div>
                        <div className="flex flex-col">
                            {timeSlots.map((slot) => {
                                const cell = day.slots[slot.name];
                                if (!cell.content) return null;
                                return (
                                    <div key={slot.name} className="flex border-b border-[#e8e8e8] last:border-b-0">
                                        <span className={`shrink-0 w-[100px] py-[0.65rem] px-2 font-bold italic text-[0.82rem] flex flex-col items-center justify-center text-center ${slotHeaderClass(slot.name)}`}>
                                            <span>{slot.name}</span>
                                            <span className="block text-[0.68rem] not-italic font-normal opacity-85 mt-[1px]">{slot.hours}</span>
                                        </span>
                                        <span className={`flex-1 py-[0.65rem] px-3 text-[0.85rem] leading-[1.45] text-[#333] bg-white ${slotCellClass(slot.name, cell.type)}`}>
                                            {renderContent(cell.content)}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}
