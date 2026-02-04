import PageTemplate from "@/components/layout/PageTemplate/PageTemplate";
import Section from "@/components/layout/Section/Section";
import StatCard from "@/components/ui/StatCard/StatCard";

export default function KesakoPage() {
    return (
        <PageTemplate title="LES JOURNÉES NATIONALES MIAGISTES" className="kesako">
            {/* Description Section */}
            <Section variant="tertiary" maxWidth="md" contentClassName="gap-4">
                <p className="text-lg md:text-xl lg:text-2xl leading-relaxed">
                    Un rendez-vous annuel qui rassemble l'ensemble du réseau international MIAGE.
                </p>

                <p className="text-lg md:text-xl lg:text-2xl leading-relaxed">
                    Un temps fort pour le réseau de la MIAGE permettant de se regrouper, se développer et améliorer les connaissances des divers participants.
                </p>

                <p className="text-lg md:text-xl lg:text-2xl leading-relaxed">
                    Lors de ces trois journées de rencontre entre étudiants, diplômés, équipes pédagogiques et directeurs, les participants suivent des conférences et/ou des ateliers animés par des entreprises, se challengent entre MIAGE et participent à des jeux de cohésions.
                </p>

                <p className="text-lg md:text-xl lg:text-2xl leading-relaxed font-semibold">
                    Cet évènement se clôture chaque année avec un gala fabuleux.
                </p>
            </Section>

            {/* Statistics Section */}
            <Section title="EN QUELQUES CHIFFRES" titleClassName="text-start" variant="primary" maxWidth="lg">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 md:gap-6">
                    <StatCard value={1970} title="Création de la MIAGE" customClassName="lg:col-span-2 bg-[#0097b2] text-white"/>
                    <StatCard value={"21 MIAGE"} title="En France" customClassName="lg:col-span-2 bg-[#000000] text-white"/>
                    <StatCard value={"+1200"} title="Diplômés par an" customClassName="lg:col-span-2 bg-[#ffbd59] text-white"/>
                    <StatCard value={42} title="Journées Nationales Miagistes" customClassName="lg:col-span-3 bg-[#00bf63] text-white"/>
                    <StatCard value={"10"} title="Partenaires sur cet évènement" customClassName="lg:col-span-3 bg-[#5e17eb] text-white" />
                </div>
            </Section>
        </PageTemplate>
    );
}
