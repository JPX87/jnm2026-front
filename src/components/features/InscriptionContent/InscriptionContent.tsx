"use client";

import React from "react";

/* ── Dashed waving arrow SVG (horizontal, desktop only) ── */
function DashedArrow({ id = "arrowhead", large = false }: { id?: string; large?: boolean }) {
    return (
        <div className={`hidden sm:flex self-start items-center mt-[4.5rem] ${large ? "w-[260px]" : "flex-1 min-w-[40px] max-w-[90px]"}`}>
            <svg viewBox="0 0 200 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto overflow-visible">
                <defs>
                    <marker id={id} markerWidth="6" markerHeight="6"
                        refX="4" refY="3" orient="auto" markerUnits="strokeWidth">
                        <path d="M0 0 L6 3 L0 6 Z" fill="var(--color-primary)" />
                    </marker>
                </defs>
                <path
                    d="M 5 40 C 40 10, 60 10, 100 40 C 140 70, 160 70, 195 40"
                    stroke="var(--color-primary)"
                    strokeWidth="2"
                    strokeDasharray="8 6"
                    fill="none"
                    strokeLinecap="round"
                    markerEnd={`url(#${id})`}
                />
            </svg>
        </div>
    );
}

/* ── Vertical dashed connector (mobile only) ── */
function VerticalConnector() {
    return (
        <div className="flex sm:hidden justify-center py-1">
            <svg viewBox="0 0 20 54" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-10 w-auto">
                {/* Dashed line */}
                <line
                    x1="10" y1="2" x2="10" y2="44"
                    stroke="var(--color-primary)"
                    strokeWidth="2"
                    strokeDasharray="6 5"
                    strokeLinecap="round"
                />
                {/* Arrowhead drawn inline */}
                <path
                    d="M 5 44 L 10 52 L 15 44"
                    stroke="var(--color-primary)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                />
            </svg>
        </div>
    );
}

/* ── Step circle component ── */
interface StepProps {
    number?: string;
    title: string;
    description?: string;
    variant: "filled" | "dashed" | "outlined";
    date?: string;
    href?: string;
    ctaLabel?: string;
    icon?: React.ReactNode;
    ring?: boolean;
}

function Step({ number, title, description, variant, date, href, ctaLabel, icon, ring }: StepProps) {
    const circleSize = "w-[110px] h-[110px] sm:w-[clamp(100px,15vw,140px)] sm:h-[clamp(100px,15vw,140px)]";
    const circleBase = `${circleSize} rounded-full flex flex-col items-center justify-center transition-all duration-200`;

    const circleStyle = {
        filled: `bg-(--color-primary) text-(--color-secondary) shadow-[0_4px_20px_rgba(239,106,159,0.35)] dark:shadow-[0_4px_24px_rgba(239,106,159,0.25)] ${href ? "hover:scale-105 cursor-pointer" : ""}`,
        dashed: "bg-transparent border-[3px] border-dashed border-(--color-primary) dark:border-(--color-primary-light) text-(--color-seconde-black) dark:text-(--color-secondary)",
        outlined: `bg-transparent border-[3px] border-(--color-primary) dark:border-(--color-primary-light) text-(--color-seconde-black) dark:text-(--color-secondary) ${href ? "hover:scale-105 cursor-pointer" : ""}`,
    }[variant];

    const circleEl = (
        <div className={`${circleBase} ${circleStyle}`}>
            {icon ?? (
                <span className="text-[2rem] sm:text-[clamp(1.6rem,3vw,2.2rem)] font-black leading-none">
                    {number}
                </span>
            )}
        </div>
    );

    const circle = ring
        ? <div className="p-[10px] border-[3px] rounded-full border-(--color-primary)">{circleEl}</div>
        : circleEl;

    return (
        <div className="flex flex-col items-center gap-2 flex-none w-[160px] sm:w-[clamp(140px,18vw,190px)] text-center">
            {/* Date badge */}
            <span className={`text-[0.8rem] sm:text-[clamp(0.6rem,1.2vw,0.85rem)] font-bold uppercase tracking-[0.04em] text-(--color-primary) dark:text-(--color-primary-light) ${date ? "visible" : "invisible"}`}>
                {date ?? "placeholder"}
            </span>

            {/* Circle */}
            {href ? (
                <a href={href} target="_blank" rel="noopener noreferrer" className="no-underline">
                    {circle}
                </a>
            ) : circle}

            {/* Title */}
            <h3 className="text-[0.9rem] sm:text-[clamp(0.7rem,1.5vw,1rem)] font-extrabold uppercase tracking-[0.05em] text-(--color-seconde-black) dark:text-(--color-secondary) leading-tight mt-1">
                {title}
            </h3>

            {/* Description */}
            <p className="text-[0.78rem] sm:text-[clamp(0.62rem,1.2vw,0.82rem)] font-normal text-(--color-seconde-black) dark:text-(--color-secondary) opacity-65 leading-[1.55]">
                {description}
            </p>

            {/* CTA */}
            {href && ctaLabel && (
                <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[0.8rem] sm:text-[clamp(0.62rem,1.2vw,0.85rem)] font-bold uppercase tracking-[0.02em] text-(--color-seconde-black) dark:text-(--color-secondary) transition-colors duration-200 hover:text-(--color-primary) dark:hover:text-(--color-primary-light) mt-1"
                >
                    → {ctaLabel}
                </a>
            )}
        </div>
    );
}

/* ── Page ── */
export default function InscriptionContent() {
    return (
        <div className="min-h-screen pt-20 pb-12 px-2 sm:pt-28 sm:pb-24 sm:px-8 flex flex-col items-center gap-6 sm:gap-12 bg-(--color-secondary) text-(--color-seconde-black) dark:bg-(--color-seconde-black) dark:text-(--color-secondary)">
            {/* ── Main heading ── */}
            <h1 className="text-[clamp(1.4rem,4vw,2.2rem)] font-black tracking-[0.08em] uppercase text-center text-(--color-seconde-black) dark:text-(--color-secondary)">
                Une destination · 2 itinéraires
            </h1>

            {/* ════════════ PACK JNM ════════════ */}
            <section className="w-full max-w-4xl py-8 border-t-2 border-transparent [&+&]:border-(--color-gray-200) dark:[&+&]:border-white/15">
                <h2 className="text-[clamp(1.3rem,3.5vw,2rem)] font-black uppercase text-(--color-seconde-black) dark:text-(--color-secondary) mb-8">
                    Pack JNM
                </h2>

                <div className="flex flex-col sm:flex-row items-center sm:items-start justify-center sm:justify-between gap-0 sm:gap-2">

                    <Step
                        number="01"
                        title="Pré-inscription"
                        description="Les pré-inscriptions sont toujours ouvertes ! Aucun paiement requis à cette étape."
                        variant="outlined"
                        href="https://www.helloasso.com/associations/journees-nationales-miage-2026/evenements/pre-inscriptions-jnm-2026"
                        ctaLabel="Me pré-inscrire"
                    />

                    <VerticalConnector />
                    <DashedArrow id="arrow-jnm-1" />

                    <Step
                        number="02"
                        title="Validation de la place"
                        description="Si tu tardes à recevoir le mail de confirmation, c'est peut-être que ton directeur de MIAGE n'a pas encore validé ta place, pense à le relancer !"
                        variant="dashed"
                    />

                    <VerticalConnector />
                    <DashedArrow id="arrow-jnm-2" />

                    <Step
                        number="03"
                        title="Inscription définitive"
                        description="Tu recevras un mail avec toutes les informations ainsi que le lien de paiement (si tu es concerné) pour finaliser ton inscription."
                        variant="filled"
                        date="Jusqu'au 13 avril"
                    />
                </div>
            </section>

            {/* ════════════ PACK GALA ════════════ */}
            <section className="w-full max-w-4xl py-8 border-t-2 border-(--color-gray-200) dark:border-white/15">
                <h2 className="text-[clamp(1.3rem,3.5vw,2rem)] font-black uppercase text-(--color-seconde-black) dark:text-(--color-secondary) mb-8">
                    Pack Gala
                </h2>

                <div className="flex flex-col sm:flex-row items-center sm:items-start justify-center gap-0 sm:gap-6">
                    <Step
                        title="Inscription"
                        description="Inscris-toi directement via HelloAsso pour réserver ta place au Gala."
                        variant="filled"
                        date="Du 2 mars au 13 avril"
                        href="https://www.helloasso.com/associations/journees-nationales-miage-2026/evenements/inscriptions-gala"
                        ctaLabel="M'inscrire"
                        ring
                    />

                    <VerticalConnector />
                    <DashedArrow id="arrow-gala" large />

                    <Step
                        title="RDV le 29 mai"
                        variant="filled"
                        icon={
                            <svg version="1.0" xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 271 282"
                                preserveAspectRatio="xMidYMid meet" className="w-[65%] h-auto">
                                <g transform="translate(0,282) scale(0.05,-0.05)">
                                    <path className="fill-(--color-secondary)"
                                        d={`M3286 5118 c-274 -79 -696 -907 -814 -1599 -10 -57 -35 -87 -135
                                            -159 -125 -92 -315 -287 -373 -385 -23 -39 -53 -58 -103 -65 -346 -48 -782
                                            -202 -1073 -377 -568 -344 -629 -457 -427 -790 462 -761 1331 -1442 1614
                                            -1264 270 169 742 1154 745 1554 0 54 20 79 128 166 139 110 292 270 372 387
                                            40 59 63 74 114 74 307 1 947 259 1334 538 234 170 258 200 267 337 24 345
                                            -832 1282 -1421 1556 -113 53 -131 55 -228 27z m289 -195 c601 -361 1336
                                            -1203 1244 -1425 -60 -145 -621 -484 -1019 -615 -369 -121 -538 -137 -540 -51
                                            0 12 -27 60 -61 106 -33 46 -55 92 -48 103 37 60 770 379 870 379 45 0 86 52
                                            72 90 -32 84 -573 -106 -934 -329 l-95 -58 -51 54 -51 53 63 100 c141 226 256
                                            557 209 604 -33 34 -94 9 -94 -39 0 -37 -144 -384 -203 -489 l-59 -104 -122
                                            79 c-67 43 -134 79 -149 79 -33 0 -33 -4 3 187 107 561 563 1373 770 1373 18
                                            0 106 -44 195 -97z m-902 -1624 c202 -117 507 -456 507 -567 0 -57 -28 -35
                                            -148 118 -121 154 -149 172 -192 120 -28 -34 -31 -30 138 -226 119 -138 120
                                            -163 7 -268 l-49 -46 -95 105 c-59 65 -111 105 -138 105 -74 0 -53 -82 47
                                            -180 50 -49 89 -98 89 -109 -2 -30 -173 -151 -214 -151 -85 0 -352 222 -494
                                            410 -141 187 -145 204 -68 308 l63 85 152 -151 c99 -98 169 -152 197 -152 82
                                            0 49 65 -116 231 l-161 161 105 89 c237 202 228 199 370 118z m-773 -527 c0
                                            -16 39 -88 88 -160 l88 -131 -104 -79 c-56 -44 -164 -109 -239 -144 -139 -64
                                            -176 -103 -136 -143 30 -30 153 9 265 84 145 99 130 71 -68 -124 -247 -243
                                            -381 -424 -353 -477 34 -63 73 -44 149 70 39 59 196 236 349 393 l277 286 107
                                            -94 c59 -52 149 -114 200 -139 107 -51 106 -34 25 -359 -133 -535 -530 -1195
                                            -719 -1195 -369 0 -1567 1251 -1444 1508 109 230 892 626 1415 718 91 16 100
                                            14 100 -14z`} />
                                </g>
                            </svg>
                        }
                    />
                </div>
            </section>
        </div>
    );
}
