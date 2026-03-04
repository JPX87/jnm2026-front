import PageTemplate from "@/components/layout/PageTemplate/PageTemplate";
import Section from "@/components/layout/Section/Section";
import "./programme.css";

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
    if (type === "dejeuner") return "cell-dejeuner";
    if (type === "soiree") return "cell-soiree";
    if (type === "soiree-highlight") return "cell-soiree-highlight";
    return "";
}

function slotHeaderClass(slot: TimeSlot) {
    switch (slot) {
        case "Matin":
        case "Après-midi":
            return "slot-teal";
        case "Déjeuner":
            return "slot-teal-dark";
        case "Soirée":
            return "slot-pink";
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

export default function ProgrammePage() {
    return (
        <PageTemplate title="PROGRAMME" className="programme">
            <Section variant="tertiary" maxWidth="xl">
                {/* ── Desktop: Table view ── */}
                <div className="programme-table-wrapper">
                    <table className="programme-table">
                        <thead>
                            <tr>
                                <th></th>
                                {programme.map((d) => (
                                    <th key={d.day}>{d.day}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {timeSlots.map((slot) => (
                                <tr key={slot.name}>
                                    <td className={`timeslot ${slotHeaderClass(slot.name)}`}>
                                        {slot.name}
                                        <span className="timeslot-hours">{slot.hours}</span>
                                    </td>
                                    {programme.map((d) => {
                                        const cell = d.slots[slot.name];
                                        return (
                                            <td
                                                key={d.day}
                                                className={`${!cell.content ? "empty-cell" : ""} ${slotCellClass(slot.name, cell.type)}`}
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
                <div className="programme-cards">
                    {programme.map((day) => (
                        <div key={day.day} className="day-card">
                            <div className="day-card-header">{day.day}</div>
                            <div className="day-card-body">
                                {timeSlots.map((slot) => {
                                    const cell = day.slots[slot.name];
                                    if (!cell.content) return null;
                                    return (
                                        <div key={slot.name} className="day-card-row">
                                            <span className={`day-card-slot ${slotHeaderClass(slot.name)}`}>
                                                {slot.name}
                                                <span className="slot-hours">{slot.hours}</span>
                                            </span>
                                            <span className={`day-card-content ${slotCellClass(slot.name, cell.type)}`}>
                                                {renderContent(cell.content)}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </Section>
        </PageTemplate>
    );
}
