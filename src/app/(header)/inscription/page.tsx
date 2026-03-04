"use client";

import { useRef, useEffect, useState } from "react";
import PageTemplate from "@/components/layout/PageTemplate/PageTemplate";
import Section from "@/components/layout/Section/Section";

/* ── tiny arrow SVG pointing right ── */
function ArrowRight({ className = "" }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"
            className={`w-6 h-6 shrink-0 ${className}`}>
            <path d="M5 12h14M13 5l7 7-7 7" />
        </svg>
    );
}

/* ── Floating plane that advances along the timeline ── */
function TimelinePlane({ progress }: { progress: number }) {
    const clamped = Math.max(0, Math.min(1, progress));
    return (
        <span
            className="absolute -left-[18px] z-10 drop-shadow-lg text-white transition-all duration-700 ease-in-out pointer-events-none"
            style={{ top: `calc(${clamped * 100}% - 16px)` }}
        >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                className="w-8 h-8 rotate-180">
                <path d="M21 16v-2l-8-5V3.5A1.5 1.5 0 0 0 11.5 2 1.5 1.5 0 0 0 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
            </svg>
            {/* Subtle pulsing glow */}
            <span className="absolute inset-0 rounded-full bg-white/20 blur-md animate-pulse" />
        </span>
    );
}

/* ── Hook: compute the pixel-based progress of the plane along a timeline ── */
function useTimelineProgress(
    containerRef: React.RefObject<HTMLDivElement | null>,
    stepRefs: React.RefObject<(HTMLDivElement | null)[]>,
    steps: { start: Date; end: Date }[],
): number {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const container = containerRef.current;
        const refs = stepRefs.current;
        if (!container || !refs || refs.length === 0) return;

        const now = new Date();
        const containerH = container.getBoundingClientRect().height;
        if (containerH === 0) return;

        // Find the active or last completed step
        let activeIdx = -1;
        for (let i = 0; i < steps.length; i++) {
            if (now >= steps[i].start && now <= steps[i].end) {
                activeIdx = i;
                break;
            }
            if (now > steps[i].end) {
                activeIdx = i; // last completed
            }
        }

        // Before any step → plane at the very top
        if (activeIdx === -1 || now < steps[0].start) {
            setProgress(0);
            return;
        }

        const step = steps[activeIdx];
        const stepEl = refs[activeIdx];
        if (!stepEl) return;

        const containerRect = container.getBoundingClientRect();
        const stepRect = stepEl.getBoundingClientRect();

        // Position within the container
        const stepTop = stepRect.top - containerRect.top;
        const stepBottom = stepRect.bottom - containerRect.top;

        // Time-based progress within the active step
        const elapsed = now.getTime() - step.start.getTime();
        const total = step.end.getTime() - step.start.getTime();
        const timePct = Math.min(1, Math.max(0, elapsed / total));

        const isCompleted = now > step.end;
        const yPos = isCompleted
            ? stepBottom
            : stepTop + (stepBottom - stepTop) * timePct;

        setProgress(yPos / containerH);
    }, [containerRef, stepRefs, steps]);

    return progress;
}

/* ── CTA link block ── */
function FormLink({ href, label }: { href: string; label: string }) {
    return (
        <a href={href} target="_blank" rel="noopener noreferrer"
            className="group flex items-center gap-3 bg-(--color-primary) text-(--color-secondary) dark:text-(--color-seconde-black) rounded-xl px-5 py-4 
                       hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] transition-all duration-200 cursor-pointer">
            <span className="text-xl">📝</span>
            <p className="text-base sm:text-lg font-bold uppercase flex-1">{label}</p>
            <ArrowRight className="w-7 h-7 group-hover:translate-x-1 transition-transform" />
        </a>
    );
}

/* ── Status logic ── */
type Status = "upcoming" | "active" | "closed" | "done";

function getStatus(start: Date, end: Date): Status {
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

function StatusBadge({ status }: { status: Status }) {
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

/* ── Timeline wrapper with floating plane ── */
function Timeline({
    steps,
    children,
}: {
    steps: { start: Date; end: Date }[];
    children: (setStepRef: (index: number, el: HTMLDivElement | null) => void) => React.ReactNode;
}) {
    const containerRef = useRef<HTMLDivElement>(null);
    const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

    const setStepRef = (index: number, el: HTMLDivElement | null) => {
        stepRefs.current[index] = el;
    };

    const progress = useTimelineProgress(containerRef, stepRefs, steps);

    return (
        <div
            ref={containerRef}
            className="relative ml-2 pl-8 border-l-4 border-(--color-secondary) dark:border-(--color-seconde-black) flex flex-col gap-10 pb-4"
        >
            <TimelinePlane progress={progress} />
            {children(setStepRef)}
        </div>
    );
}

export default function InscriptionPage() {
    /* ── date ranges ── */
    const preInscStart = new Date("2026-02-25");
    const preInscEnd = new Date("2026-03-15T23:59:59");
    const defInscStart = new Date("2026-03-30");
    const defInscEnd = new Date("2026-05-25T23:59:59");
    const galaStart = new Date("2026-03-02");
    const galaEnd = new Date("2026-04-17T23:59:59");

    const preInscStatus = getStatus(preInscStart, preInscEnd);
    const defInscStatus = getStatus(defInscStart, defInscEnd);
    const galaStatus = getStatus(galaStart, galaEnd);

    /* Itinéraire 1 steps */
    const itin1Steps = [
        { start: preInscStart, end: preInscEnd },
        { start: defInscStart, end: defInscEnd },
    ];

    /* Itinéraire 2 steps */
    const itin2Steps = [
        { start: galaStart, end: galaEnd },
    ];

    return (
        <PageTemplate title="INSCRIPTIONS JNM 2026" className="inscription">
            {/* Hero subtitle */}
            <div className="w-full flex flex-col items-center gap-4 -mt-4 mb-4">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold opacity-80 tracking-wide">
                    PLAN DE VOL
                </h2>
            </div>

            {/* ═══════ ITINÉRAIRE 1 — Pack JNM 4 jours ═══════ */}
            <Section title="Itinéraire 1" variant="tertiary" maxWidth="lg"
                titleClassName="!text-left"
                contentClassName="gap-2"
            >
                <p className="text-2xl sm:text-3xl md:text-4xl font-semibold -mt-4 mb-6">
                    Pack JNM 4 jours ✈️
                </p>

                <Timeline steps={itin1Steps}>
                    {(setStepRef) => (
                        <>
                            {/* ── Étape 1 ── */}
                            <div className="relative" ref={(el) => setStepRef(0, el)}>
                                <span className="inline-block w-max bg-(--color-primary) text-(--color-secondary) dark:text-(--color-seconde-black) text-base sm:text-lg font-bold px-5 py-2 rounded-full mb-4">
                                    Du 25 février au 15 mars
                                </span>

                                <div className="flex flex-col gap-4">
                                    <FormLink
                                        href="https://www.helloasso.com/associations/journees-nationales-miage-2026/evenements/pre-inscriptions-jnm-2026"
                                        label="Remplir le formulaire de pré-inscription"
                                    />

                                    <div className="flex flex-wrap items-center gap-3 sm:gap-6">
                                        <p className="text-lg sm:text-xl md:text-2xl font-bold uppercase">
                                            Places limitées
                                        </p>
                                        <span className="bg-(--color-primary) text-(--color-secondary) dark:text-(--color-seconde-black) text-sm sm:text-base font-bold px-4 py-2 rounded-lg uppercase">
                                            10 étudiants par MIAGE
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-3 border-2 border-(--color-secondary)/40 dark:border-(--color-seconde-black)/40 rounded-xl px-5 py-4">
                                        <span className="text-2xl">📨</span>
                                        <p className="text-base sm:text-lg font-bold uppercase">
                                            Envoi des listes étudiantes à vos directeurs de MIAGE
                                        </p>
                                    </div>

                                    <StatusBadge status={preInscStatus} />
                                </div>
                            </div>

                            {/* ── Étape 2 ── */}
                            <div className="relative" ref={(el) => setStepRef(1, el)}>
                                <span className="inline-block w-max bg-(--color-primary) text-(--color-secondary) dark:text-(--color-seconde-black) text-base sm:text-lg font-bold px-5 py-2 rounded-full mb-4">
                                    À partir du 30 mars
                                </span>

                                <div className="flex flex-col gap-4">
                                    <div className="flex items-center gap-3 border-2 border-(--color-secondary)/40 dark:border-(--color-seconde-black)/40 rounded-xl px-5 py-4">
                                        <span className="text-2xl">✅</span>
                                        <p className="text-base sm:text-lg font-bold uppercase">
                                            Pré-inscription validée
                                        </p>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-3 sm:gap-6">
                                        <p className="text-lg sm:text-xl md:text-2xl font-bold uppercase">
                                            Vous recevrez
                                        </p>
                                        <span className="bg-(--color-primary) text-(--color-secondary) dark:text-(--color-seconde-black) text-sm sm:text-base font-bold px-4 py-2 rounded-lg uppercase">
                                            Lien d&apos;inscription définitive
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-3 border-2 border-(--color-secondary)/40 dark:border-(--color-seconde-black)/40 rounded-xl px-5 py-4">
                                        <span className="text-2xl">📝</span>
                                        <p className="text-base sm:text-lg font-bold uppercase">
                                            Remplir le formulaire d&apos;inscription définitive
                                        </p>
                                    </div>

                                    <StatusBadge status={defInscStatus} />
                                </div>
                            </div>
                        </>
                    )}
                </Timeline>
            </Section>

            {/* ═══════ ITINÉRAIRE 2 — Pack Gala uniquement ═══════ */}
            <Section title="Itinéraire 2" variant="tertiary" maxWidth="lg"
                titleClassName="!text-left"
                contentClassName="gap-2"
            >
                <p className="text-2xl sm:text-3xl md:text-4xl font-semibold -mt-4 mb-6">
                    Pack Gala uniquement 🎉
                </p>

                <Timeline steps={itin2Steps}>
                    {(setStepRef) => (
                        <div className="relative" ref={(el) => setStepRef(0, el)}>
                            <span className="inline-block w-max bg-(--color-primary) text-(--color-secondary) dark:text-(--color-seconde-black) text-base sm:text-lg font-bold px-5 py-2 rounded-full mb-4">
                                Du 2 mars au 17 avril
                            </span>

                            <div className="flex flex-col gap-4">
                                <FormLink
                                    href="https://www.helloasso.com/associations/journees-nationales-miage-2026/evenements/inscriptions-gala"
                                    label="Remplir le formulaire d'inscription"
                                />

                                <StatusBadge status={galaStatus} />

                                <div className="flex items-center gap-3 border-2 border-(--color-secondary)/40 dark:border-(--color-seconde-black)/40 rounded-xl px-5 py-4">
                                    <span className="text-2xl">🎀</span>
                                    <p className="text-base sm:text-lg font-bold uppercase">
                                        Rendez-vous le 29 mai
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </Timeline>
            </Section>

            {/* ═══════ Important note ═══════ */}
            <Section variant="primary" maxWidth="md" contentClassName="gap-4 text-center">
                <p className="text-lg md:text-xl lg:text-2xl leading-relaxed">
                    🚨 <strong>Phase de pré-inscription étendue jusqu&apos;au 15 mars</strong>
                </p>
                <p className="text-lg md:text-xl lg:text-2xl leading-relaxed">
                    Deux itinéraires, une destination : <strong>JNM 2026 du 26 au 29 mai</strong> 🛫
                </p>
                <p className="text-base md:text-lg lg:text-xl leading-relaxed opacity-80">
                    N&apos;hésitez pas à nous poser vos questions si besoin !
                </p>
            </Section>
        </PageTemplate>
    );
}