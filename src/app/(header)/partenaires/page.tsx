import { PartenaitCard } from "@/components/features/PartenariatCard";
import PageTemplate from "@/components/layout/PageTemplate/PageTemplate";
import Section from "@/components/layout/Section/Section";

export default function PartenairesPage() {
    return (
        <PageTemplate title="Nos partenaires :" variant="theme" className="kesako">
            <Section variant="none" maxWidth="md" contentClassName="gap-4 border-r-4 border-b-4 border-(--color-primary) p-4 w-fit rounded-bl-[20px]">
                <h2 className="text-xl md:text-2xl lg:text-4xl font-bold mb-4 text-left border-l-4 border-b-4 border-(--color-primary) pl-4 pb-4 w-fit">
                    Majeur :
                </h2>
                <PartenaitCard />
            </Section>
            <Section variant="none" maxWidth="md" contentClassName="gap-4 border-l-4 border-b-4 border-(--color-primary) p-0 w-fit">
                <h2 className="text-xl md:text-2xl lg:text-4xl font-bold mb-4 text-left border-l-4 border-b-4 border-(--color-primary) pl-4 pb-4 w-fit">
                    Leader :
                </h2>
                <p className="text-lg md:text-xl lg:text-2xl leading-relaxed">
                    Un rendez-vous annuel qui rassemble l'ensemble du réseau international MIAGE.
                </p>
            </Section>
            <Section variant="none" maxWidth="md" contentClassName="gap-4 border-r-4 border-b-4 border-(--color-primary) p-4 w-fit">
                <h2 className="text-xl md:text-2xl lg:text-4xl font-bold mb-4 text-left border-l-4 border-b-4 border-(--color-primary) pl-4 pb-4 w-fit">
                    Acteur :
                </h2>
                <p className="text-lg md:text-xl lg:text-2xl leading-relaxed">
                    Un rendez-vous annuel qui rassemble l'ensemble du réseau international MIAGE.
                </p>
            </Section>
            <Section variant="none" maxWidth="md" contentClassName="gap-4 border-l-4 border-b-4 border-(--color-primary) p-4 w-fit">
                <h2 className="text-xl md:text-2xl lg:text-4xl font-bold mb-4 text-left border-l-4 border-b-4 border-(--color-primary) pl-4 pb-4 w-fit">
                    Associé :
                </h2>
                <p className="text-lg md:text-xl lg:text-2xl leading-relaxed">
                    Un rendez-vous annuel qui rassemble l'ensemble du réseau international MIAGE.
                </p>
            </Section>
        </PageTemplate>
    );
}
