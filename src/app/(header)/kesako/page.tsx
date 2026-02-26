import PageTemplate from "@/components/layout/PageTemplate/PageTemplate";
import Section from "@/components/layout/Section/Section";
import StatCard from "@/components/ui/StatCard/StatCard";

export default function KesakoPage() {
    return (
        <PageTemplate title="LES JOURNÉES NATIONALES MIAGISTES" className="kesako">
            {/* Description Section */}
            <Section variant="tertiary" maxWidth="md" contentClassName="gap-4">
                <p className="text-lg md:text-xl lg:text-2xl leading-relaxed">
                    Un rendez-vous annuel qui rassemble l&apos;ensemble du réseau international MIAGE.
                </p>

                <p className="text-lg md:text-xl lg:text-2xl leading-relaxed">
                    Un temps fort pour le réseau de la MIAGE permettant de se regrouper, de développer son réseau et se cultiver grâce aux diverses activités.
                </p>

                <p className="text-lg md:text-xl lg:text-2xl leading-relaxed">
                    Lors de ces quatre journées de rencontre entre étudiants, diplômés, équipes pédagogiques et directeurs, les participants suivent des conférences et/ou des ateliers animés par des entreprises, se challengent entre MIAGE et participent à des jeux de cohésions.
                </p>

                <p className="text-lg md:text-xl lg:text-2xl leading-relaxed font-semibold">
                    Cet évènement se clôture chaque année avec un gala fabuleux.
                </p>
            </Section>

            {/* Statistics Section */}
            <Section title="EN QUELQUES CHIFFRES" variant="primary" maxWidth="lg">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    <StatCard value={21} title="MIAGE" subtitle="En France" variant="tertiary" />
                    <StatCard value="+1200" title="Diplômés MIAGE par an" variant="secondary" />
                    <StatCard value={1970} title="Création de la MIAGE" variant="tertiary" />
                    <StatCard value={42} title="Journées Nationales Miagistes" variant="secondary" />
                    <StatCard value={4} title="Jours" variant="tertiary" />
                    <StatCard value="+300" title="Participants" variant="secondary" />
                </div>
            </Section>
        </PageTemplate>
    );
}
