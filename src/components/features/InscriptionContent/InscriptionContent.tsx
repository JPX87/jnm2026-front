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
                        <span className="absolute text-[0.95rem] sm:text-[clamp(0.55rem,1.4vw,1.3rem)]  font-bold uppercase text-(--color-primary) dark:text-(--color-primary-light) tracking-[0.04em] text-center whitespace-nowrap mb-1.5 sm:mb-0">
                            Jusqu&apos;au 13 avril
                        </span>
                        <div className="mt-9 p-3 border-[3px] rounded-[50%] border-(--color-primary)">
                            <a
                                href="https://www.helloasso.com/associations/journees-nationales-miage-2026/evenements/pre-inscriptions-jnm-2026"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-[100px] h-[100px] sm:w-[clamp(90px,18vw,150px)] sm:h-[clamp(90px,18vw,150px)] rounded-full flex items-center justify-center text-center p-2 sm:p-4 text-[1rem] sm:text-[clamp(0.55rem,1.5vw,1.1rem)] font-extrabold uppercase tracking-[0.04em] leading-[1.3] transition-all duration-200 hover:scale-105 bg-(--color-primary) text-(--color-secondary) shadow-[0_4px_20px_rgba(239,106,159,0.35)] dark:shadow-[0_4px_24px_rgba(239,106,159,0.25)] cursor-pointer no-underline"
                            >
                                Pré-inscription
                            </a>
                        </div>
                        <a
                            href="https://www.helloasso.com/associations/journees-nationales-miage-2026/evenements/pre-inscriptions-jnm-2026"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-[0.3rem] text-[0.95rem] sm:text-[clamp(0.55rem,1.4vw,1rem)] font-bold text-(--color-seconde-black) dark:text-(--color-secondary) uppercase tracking-[0.02em] transition-colors duration-200 mt-1.5 sm:mt-0 whitespace-nowrap hover:text-(--color-primary) dark:hover:text-(--color-primary-light)"
                        >
                            → Me pré-inscrire
                        </a>
                    </div>

                    <DashedArrow />

                    {/* Step 2 — Inscription définitive */}
                    <div className="flex flex-col items-center gap-[0.6rem] flex-none relative z-10">
                        <div className="mt-9 w-[130px] h-[130px] sm:w-[clamp(90px,18vw,170px)] sm:h-[clamp(90px,18vw,170px)] rounded-full flex items-center justify-center text-center p-2 sm:p-4 text-[1rem] sm:text-[clamp(0.55rem,1.5vw,1.1rem)] font-extrabold uppercase tracking-[0.04em] leading-[1.3] transition-all duration-200 hover:scale-105 bg-transparent border-[3px] border-dashed border-(--color-primary) dark:border-(--color-primary-light) text-(--color-seconde-black) dark:text-(--color-secondary)">
                            Inscription définitive
                        </div>
                        <span className="text-[0.85rem] sm:text-[clamp(0.55rem,1.4vw,1rem)] font-bold uppercase text-center text-(--color-seconde-black) dark:text-(--color-secondary) tracking-[0.03em] leading-[1.3]">
                            Max 10 étudiants
                            <br />par MIAGE
                        </span>
                    </div>
                </div>

                {/* Alert box at the bottom middle */}
                <div className="bg-(--color-seconde-black) dark:bg-(--color-secondary) rounded-lg py-3 px-4 sm:py-1.5 sm:px-3 mt-2 mx-auto text-[0.8rem] sm:text-[clamp(0.55rem,1.5vw,1.1rem)] font-extrabold uppercase text-center text-(--color-secondary) dark:text-(--color-seconde-black) tracking-[0.03em] leading-[1.4] w-full max-w-[200px] sm:w-fit sm:max-w-[280px] shadow-[0_4px_15px_rgba(0,0,0,0.05)] flex justify-center items-center">
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
                        <span className="absolute text-[0.95rem] sm:text-[clamp(0.55rem,1.4vw,1.3rem)]  font-bold uppercase text-(--color-primary) dark:text-(--color-primary-light) tracking-[0.04em] text-center whitespace-nowrap mb-1.5 sm:mb-0">
                            Du 2 mars au 13 avril
                        </span>
                        <div className="mt-9 p-3 border-[3px] rounded-[50%] border-(--color-primary)">

                            <a
                                href="https://www.helloasso.com/associations/journees-nationales-miage-2026/evenements/inscriptions-gala"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-[100px] h-[100px] sm:w-[clamp(90px,18vw,150px)] sm:h-[clamp(90px,18vw,150px)] rounded-full flex items-center justify-center text-center p-2 sm:p-4 text-[1rem] sm:text-[clamp(0.55rem,1.5vw,1.1rem)] font-extrabold uppercase tracking-[0.04em] leading-[1.3] transition-all duration-200 hover:scale-105 bg-(--color-primary) text-(--color-secondary) shadow-[0_4px_20px_rgba(239,106,159,0.35)] dark:shadow-[0_4px_24px_rgba(239,106,159,0.25)] cursor-pointer no-underline"
                            >
                                Inscription
                            </a>
                        </div>
                        <a
                            href="https://www.helloasso.com/associations/journees-nationales-miage-2026/evenements/inscriptions-gala"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-[0.3rem] text-[0.95rem] sm:text-[clamp(0.55rem,1.4vw,1rem)] font-bold text-(--color-seconde-black) dark:text-(--color-secondary) uppercase tracking-[0.02em] transition-colors duration-200 mt-1.5 sm:mt-0 whitespace-nowrap hover:text-(--color-primary) dark:hover:text-(--color-primary-light)"
                        >
                            → M&apos;inscrire
                        </a>
                    </div>

                    {/* Arrow */}
                    <DashedArrow />

                    {/* Step 2 — RDV */}
                    <div className="flex flex-col items-center gap-[0.6rem] flex-none relative z-10">
                        <span className="absolute text-[0.95rem] sm:text-[clamp(0.55rem,1.4vw,1.3rem)] font-bold uppercase text-(--color-primary) dark:text-(--color-primary-light) tracking-[0.04em] text-center whitespace-nowrap mb-1.5 sm:mb-0">
                            RDV le 29 mai
                        </span>
                        <div className="mt-9 w-[130px] h-[130px] sm:w-[clamp(90px,18vw,170px)] sm:h-[clamp(90px,18vw,170px)] rounded-full flex items-center justify-center text-center p-2 sm:p-4 text-[1rem] sm:text-[clamp(0.55rem,1.5vw,1.1rem)] font-extrabold uppercase tracking-[0.04em] leading-[1.3] transition-all duration-200 hover:scale-105 bg-(--color-primary) text-(--color-primary) shadow-[0_4px_24px_rgba(239,106,159,0.4)] dark:shadow-[0_4px_28px_rgba(239,106,159,0.3)]">
                            <svg version="1.0" xmlns="http://www.w3.org/2000/svg"
                                width="271.000000pt" height="282.000000pt" viewBox="0 0 271.000000 282.000000"
                                preserveAspectRatio="xMidYMid meet" className="w-[70%] h-auto">
                                <g transform="translate(0.000000,282.000000) scale(0.050000,-0.050000)" >
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

                        </div>
                    </div>
                </div>
                {/* Alert box at the bottom middle */}
                <div className="bg-(--color-seconde-black) dark:bg-(--color-secondary) rounded-lg py-3 px-4 sm:py-1.5 sm:px-3 mt-2 mx-auto text-[0.8rem] sm:text-[clamp(0.55rem,1.5vw,1.1rem)] font-extrabold uppercase text-center text-(--color-secondary) dark:text-(--color-seconde-black) tracking-[0.03em] leading-[1.4] w-full max-w-[200px] sm:w-fit sm:max-w-[280px] shadow-[0_4px_15px_rgba(0,0,0,0.05)] flex justify-center items-center">
                    Validation des listes par vos directeurs de MIAGE
                </div>
            </section>
        </div>
    );
}