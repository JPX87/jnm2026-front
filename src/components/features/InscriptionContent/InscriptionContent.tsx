"use client";

import PageTemplate from "@/components/layout/PageTemplate/PageTemplate";
import Section from "@/components/layout/Section/Section";
import Timeline from "@/components/ui/Timeline/Timeline";
import FormLink from "@/components/ui/FormLink/FormLink";
import StatusBadge, { getStatus } from "@/components/ui/StatusBadge/StatusBadge";

export default function InscriptionContent() {
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
