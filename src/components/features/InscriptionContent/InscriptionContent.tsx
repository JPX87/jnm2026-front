"use client";

import styles from "./InscriptionContent.module.scss";

/* ── Dashed waving arrow SVG ── */
function DashedArrow({ id = "arrowhead-gala" }: { id?: string }) {
    return (
        <div className={styles.arrowConnector}>
            <svg viewBox="0 0 200 80" fill="none" xmlns="http://www.w3.org/2000/svg">
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
        <div className={styles.page}>
            {/* ── Main heading ── */}
            <h1 className={styles.mainTitle}>Une destination · 2 itinéraires</h1>

            {/* ════════════ PACK JNM ════════════ */}
            <section className={styles.packSection}>
                <h2 className={styles.packTitle}>Pack JNM</h2>

                <div className={styles.flowRow}>
                    

                    {/* Step 1 — Pré-inscription */}
                    <div className={styles.step}>
                        <span className={styles.stepDate}>25 janvier au 15 mars</span>
                        <a
                            href="https://www.helloasso.com/associations/journees-nationales-miage-2026/evenements/pre-inscriptions-jnm-2026"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`${styles.circle} ${styles.circleFilled}`}
                        >
                            Pré-inscription
                        </a>
                        <a
                            href="https://www.helloasso.com/associations/journees-nationales-miage-2026/evenements/pre-inscriptions-jnm-2026"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.ctaLink}
                        >
                            → Me pré-inscrire
                        </a>
                    </div>

                    <DashedArrow />

                    {/* Step 2 — Inscription définitive */}
                    <div className={styles.step}>
                        <span className={styles.stepDate}>À partir du 30 mars</span>
                        <div className={`${styles.circle} ${styles.circleOutline}`}>
                            Inscription définitive
                        </div>
                        <span className={styles.limitNote}>
                            Max 10 étudiants
                            <br />par MIAGE
                        </span>
                    </div>
                </div>
                
                {/* Alert box at the bottom middle */}
                <div className={styles.validationAlert}>
                    Validation des listes par vos directeurs de MIAGE
                </div>
            </section>

            {/* ════════════ PACK GALA ════════════ */}
            <section className={styles.packSection}>
                <h2 className={styles.packTitle}>Pack Gala</h2>

                <div className={styles.flowRow}>
                    {/* Step 1 — Inscription */}
                    <div className={styles.step}>
                        <span className={styles.stepDate}>Du 2 mars au 17 avril</span>
                        <a
                            href="https://www.helloasso.com/associations/journees-nationales-miage-2026/evenements/inscriptions-gala"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`${styles.circle} ${styles.circleFilled}`}
                        >
                            Inscription
                        </a>
                        <a
                            href="https://www.helloasso.com/associations/journees-nationales-miage-2026/evenements/inscriptions-gala"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.ctaLink}
                        >
                            → M&apos;inscrire
                        </a>
                    </div>

                    {/* Arrow */}
                    <DashedArrow />

                    {/* Step 2 — RDV */}
                    <div className={styles.step}>
                        <span className={styles.stepDate}>RDV le 29 mai</span>
                        <div className={`${styles.circle} ${styles.circleSolid}`} />
                    </div>
                </div>
            </section>
        </div>
    );
}