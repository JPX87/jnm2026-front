"use client";

/* ── Dashed waving arrow SVG ── */
function DashedArrow({ id = "arrowhead-gala" }: { id?: string }) {
    return (
        <div className="flex-1 w-full self-center flex items-center min-w-[45px] max-w-[80px] sm:min-w-[150px] sm:max-w-none relative">
            <svg viewBox="0 0 200 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto overflow-visible">
                <defs>
                    <marker id={id} markerWidth="6" markerHeight="6"
                        refX="4" refY="3" orient="auto" markerUnits="strokeWidth">
                        <path d="M0 0 L6 3 L0 6 Z" fill="var(--color-primary)" />
                    </marker>
                </defs>
                {/* Waving curve perfectly centered at Y=40 for alignment */}
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

                <div className="flex flex-wrap sm:flex-nowrap items-start justify-center sm:justify-between gap-2 sm:gap-4 relative">
                    
                    {/* Step 1 — Pré-inscription */}
                    <div className="flex flex-col items-center gap-[0.6rem] flex-none relative z-10">
                        <span className="text-[0.95rem] sm:text-[clamp(0.65rem,1.8vw,0.85rem)] font-bold uppercase text-(--color-primary) dark:text-(--color-primary-light) tracking-[0.04em] text-center whitespace-nowrap mb-1.5 sm:mb-0">
                            25 janvier au 15 mars
                        </span>
                        <a
                            href="https://www.helloasso.com/associations/journees-nationales-miage-2026/evenements/pre-inscriptions-jnm-2026"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-[120px] h-[120px] sm:w-[clamp(90px,18vw,150px)] sm:h-[clamp(90px,18vw,150px)] rounded-full flex items-center justify-center text-center p-2 sm:p-4 text-[0.9rem] sm:text-[clamp(0.55rem,1.5vw,0.8rem)] font-extrabold uppercase tracking-[0.04em] leading-[1.3] transition-all duration-200 hover:scale-105 bg-(--color-primary) text-(--color-secondary) shadow-[0_4px_20px_rgba(239,106,159,0.35)] dark:shadow-[0_4px_24px_rgba(239,106,159,0.25)] cursor-pointer no-underline"
                        >
                            Pré-inscription
                        </a>
                        <a
                            href="https://www.helloasso.com/associations/journees-nationales-miage-2026/evenements/pre-inscriptions-jnm-2026"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-[0.3rem] text-[0.95rem] sm:text-[clamp(0.6rem,1.6vw,0.8rem)] font-bold text-(--color-seconde-black) dark:text-(--color-secondary) uppercase tracking-[0.02em] transition-colors duration-200 mt-1.5 sm:mt-0 whitespace-nowrap hover:text-(--color-primary) dark:hover:text-(--color-primary-light)"
                        >
                            → Me pré-inscrire
                        </a>
                    </div>

                    <DashedArrow />

                    {/* Step 2 — Inscription définitive */}
                    <div className="flex flex-col items-center gap-[0.6rem] flex-none relative z-10">
                        <span className="text-[0.95rem] sm:text-[clamp(0.65rem,1.8vw,0.85rem)] font-bold uppercase text-(--color-primary) dark:text-(--color-primary-light) tracking-[0.04em] text-center whitespace-nowrap mb-1.5 sm:mb-0">
                            À partir du 30 mars
                        </span>
                        <div className="w-[120px] h-[120px] sm:w-[clamp(90px,18vw,150px)] sm:h-[clamp(90px,18vw,150px)] rounded-full flex items-center justify-center text-center p-2 sm:p-4 text-[0.9rem] sm:text-[clamp(0.55rem,1.5vw,0.8rem)] font-extrabold uppercase tracking-[0.04em] leading-[1.3] transition-all duration-200 hover:scale-105 bg-transparent border-[3px] border-dashed border-(--color-primary) dark:border-(--color-primary-light) text-(--color-seconde-black) dark:text-(--color-secondary)">
                            Inscription définitive
                        </div>
                        <span className="text-[0.85rem] sm:text-[clamp(0.55rem,1.4vw,0.75rem)] font-bold uppercase text-center text-(--color-seconde-black) dark:text-(--color-secondary) tracking-[0.03em] leading-[1.3]">
                            Max 10 étudiants
                            <br />par MIAGE
                        </span>
                    </div>
                </div>
                
                {/* Alert box at the bottom middle */}
                <div className="bg-(--color-gray-100) dark:bg-white/10 rounded-lg py-3 px-4 sm:py-1.5 sm:px-3 mt-2 sm:mt-8 mx-auto text-[0.95rem] sm:text-[clamp(0.5rem,1.2vw,0.65rem)] font-extrabold uppercase text-center text-(--color-seconde-black) dark:text-(--color-secondary) tracking-[0.03em] leading-[1.4] w-full max-w-[320px] sm:w-fit sm:max-w-[280px] shadow-[0_4px_15px_rgba(0,0,0,0.05)] flex justify-center items-center">
                    Validation des listes par vos directeurs de MIAGE
                </div>
            </section>

            {/* ════════════ PACK GALA ════════════ */}
            <section className="w-full max-w-4xl py-8 border-t-2 border-(--color-gray-200) dark:border-white/15">
                <h2 className="text-[clamp(1.3rem,3.5vw,2rem)] font-black uppercase text-(--color-seconde-black) dark:text-(--color-secondary) mb-8">
                    Pack Gala
                </h2>

                <div className="flex flex-wrap sm:flex-nowrap items-start justify-center sm:justify-between gap-2 sm:gap-4 relative">
                    {/* Step 1 — Inscription */}
                    <div className="flex flex-col items-center gap-[0.6rem] flex-none relative z-10">
                        <span className="text-[0.95rem] sm:text-[clamp(0.65rem,1.8vw,0.85rem)] font-bold uppercase text-(--color-primary) dark:text-(--color-primary-light) tracking-[0.04em] text-center whitespace-nowrap mb-1.5 sm:mb-0">
                            Du 2 mars au 17 avril
                        </span>
                        <a
                            href="https://www.helloasso.com/associations/journees-nationales-miage-2026/evenements/inscriptions-gala"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-[120px] h-[120px] sm:w-[clamp(90px,18vw,150px)] sm:h-[clamp(90px,18vw,150px)] rounded-full flex items-center justify-center text-center p-2 sm:p-4 text-[0.9rem] sm:text-[clamp(0.55rem,1.5vw,0.8rem)] font-extrabold uppercase tracking-[0.04em] leading-[1.3] transition-all duration-200 hover:scale-105 bg-(--color-primary) text-(--color-secondary) shadow-[0_4px_20px_rgba(239,106,159,0.35)] dark:shadow-[0_4px_24px_rgba(239,106,159,0.25)] cursor-pointer no-underline"
                        >
                            Inscription
                        </a>
                        <a
                            href="https://www.helloasso.com/associations/journees-nationales-miage-2026/evenements/inscriptions-gala"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-[0.3rem] text-[0.95rem] sm:text-[clamp(0.6rem,1.6vw,0.8rem)] font-bold text-(--color-seconde-black) dark:text-(--color-secondary) uppercase tracking-[0.02em] transition-colors duration-200 mt-1.5 sm:mt-0 whitespace-nowrap hover:text-(--color-primary) dark:hover:text-(--color-primary-light)"
                        >
                            → M&apos;inscrire
                        </a>
                    </div>

                    {/* Arrow */}
                    <DashedArrow />

                    {/* Step 2 — RDV */}
                    <div className="flex flex-col items-center gap-[0.6rem] flex-none relative z-10">
                        <span className="text-[0.95rem] sm:text-[clamp(0.65rem,1.8vw,0.85rem)] font-bold uppercase text-(--color-primary) dark:text-(--color-primary-light) tracking-[0.04em] text-center whitespace-nowrap mb-1.5 sm:mb-0">
                            RDV le 29 mai
                        </span>
                        <div className="w-[120px] h-[120px] sm:w-[clamp(90px,18vw,150px)] sm:h-[clamp(90px,18vw,150px)] rounded-full flex items-center justify-center text-center p-2 sm:p-4 text-[0.9rem] sm:text-[clamp(0.55rem,1.5vw,0.8rem)] font-extrabold uppercase tracking-[0.04em] leading-[1.3] transition-all duration-200 hover:scale-105 bg-(--color-primary) text-(--color-primary) shadow-[0_4px_24px_rgba(239,106,159,0.4)] dark:shadow-[0_4px_28px_rgba(239,106,159,0.3)]" />
                    </div>
                </div>
            </section>
        </div>
    );
}