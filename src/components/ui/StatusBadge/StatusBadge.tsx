export type Status = "upcoming" | "active" | "closed" | "done";

export function getStatus(start: Date, end: Date): Status {
    const now = new Date();
    if (now < start) return "upcoming";
    if (now > end) return "closed";
    return "active";
}

const statusConfig: Record<Status, { label: string; bg: string; text: string }> = {
    upcoming: { label: "À venir", bg: "bg-(--color-gray-300)", text: "text-(--color-gray-600)" },
    active: { label: "En cours . . .", bg: "bg-(--color-warning)", text: "text-(--color-secondary)" },
    closed: { label: "Terminé", bg: "bg-(--color-gray-400)", text: "text-(--color-secondary)" },
    done: { label: "Validée", bg: "bg-(--color-success)", text: "text-(--color-secondary)" },
};

export default function StatusBadge({ status }: { status: Status }) {
    const cfg = statusConfig[status];
    return (
        <div className="flex flex-wrap items-center gap-3 sm:gap-6">
            <p className={`text-lg sm:text-xl md:text-2xl font-bold uppercase ${status === "done" ? "text-(--color-success)" : ""}`}>
                État inscription
            </p>
            <span className={`${cfg.bg} ${cfg.text} text-sm sm:text-base font-bold px-5 py-2 rounded-lg uppercase tracking-wider`}>
                {cfg.label}
            </span>
        </div>
    );
}
