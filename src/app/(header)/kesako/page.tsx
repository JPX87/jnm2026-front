import { Metadata } from 'next'
import PageTemplate from "@/components/layout/PageTemplate/PageTemplate";
import Section from "@/components/layout/Section/Section";
import StatCard from "@/components/ui/StatCard/StatCard";

export const metadata: Metadata = {
    title: "KESAKO",
}

export default function KesakoPage() {
    return (
        <PageTemplate title="LES JOURNÉES NATIONALES MIAGISTES" className="kesako">
            {/* Description Section */}
            <Section variant="primary" maxWidth="md" contentClassName="gap-4">
                <p className="text-lg md:text-xl lg:text-2xl leading-relaxed">
                    Prochaine escale : <strong>TOULOUSE</strong>.
                    Plus qu&apos;un événement, c&apos;est <strong>LE</strong> moment où tout le réseau ne fait qu&apos;un.
                </p>

                <p className="text-lg md:text-xl lg:text-2xl leading-relaxed">
                    Au programme, <strong>4 jours d&apos;activités, formations, ateliers, conférences animées par des entreprises.</strong>
                    <br />
                    L&apos;occasion de rencontrer les étudiants et alumni de toute la France, à travers des challenges, jeux et soirées.
                </p>

                <p className="text-lg md:text-xl lg:text-2xl leading-relaxed">
                    Pour clôturer cette <strong>46ème édition des JNM</strong>, un gala est prévu sur un des plus beaux rooftop de notre ville !
                </p>

                <p className="text-lg md:text-xl lg:text-2xl leading-relaxed font-semibold">
                    Nous avons hâte de vous accueillir dans notre belle Ville Rose pour écrire la prochaine page de cette histoire !
                </p>
            </Section>

            {/* Statistics Section */}
            <Section title="EN QUELQUES CHIFFRES" variant="primary" maxWidth="lg">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    <StatCard value={1970} title="Création de la MIAGE" variant="tertiary" />
                    <StatCard value={21} title="MIAGE" subtitle="En France" variant="secondary" />
                    <StatCard value="+1200" title="Diplômés MIAGE par an" variant="tertiary" />
                    <StatCard value={46} title="Journées Nationales Miagistes" variant="secondary" />
                    <StatCard value={4} title="Jours" variant="tertiary" />
                    <StatCard value="+300" title="Participants" variant="secondary" />
                </div>
            </Section>
        </PageTemplate>
    );
}
