import { PartenaitCard } from "@/components/features/PartenariatCard";
import PageTemplate from "@/components/layout/PageTemplate/PageTemplate";
import Section from "@/components/layout/Section/Section";
import { PartnerData } from "@/components/features/PartenariatCard/types";
import { LogoSvg } from "@/components/ui/branding/logo/LogoSvg";

// Exemple de données pour un partenaire majeur
const majorPartnerData: PartnerData = {
    number: 1,
    partnerType: "Majeur",
    mainLogo: <LogoSvg fill="#d75d91" className="absolute inset-0 w-26 h-18 m-auto bg-white dark:bg-(--color-seconde-black) px-1 rounded-lg" />,
    infos: {
        type: "Asso",
        name: "JNM 2026",
        nationality: "Française",
        issueDate: new Date(2026, 4, 26),
        address: "Toulouse",
        birthDate: new Date(2026, 4, 26),
        expirationDate: new Date(2026, 4, 29)
    },
    back: {
        title: "Plus qu’un emploi, choisissez une carrière.",
        classNameDescription: "tracking-[0.079em]",
        description: `Aujourd&aposhui, nous sommes une équipe mondiale, leader du conseil et des services numériques,
     qui possèdent une connaissance fine des différents secteurs d’activité et une expertise technologique 
     qui nous permettent d&aposanticiper les changements du marché, de fournir des conseils pertinents et des 
     services complets, pour accompagner nos clients dans leur transformation à travers quatre métiers : 
     le conseil, l’intégration de systèmes, les business solutions et les services managés. 
     Perfectionnez vos compétences. Partagez vos perspectives. Libérez votre potentiel.`
    }
};

export default function PartenairesPage() {
    return (
        <PageTemplate title="Nos partenaires :" variant="theme" className="kesako">
            <Section variant="none" maxWidth="md" contentClassName="gap-4 border-r-4 border-b-4 border-(--color-primary) p-4 w-fit rounded-bl-[20px]">
                <h2 className="text-xl md:text-2xl lg:text-4xl font-bold mb-4 text-left border-l-4 border-b-4 border-(--color-primary) pl-4 pb-4 w-fit">
                    Majeur :
                </h2>
                <PartenaitCard data={majorPartnerData} />
            </Section>
            <Section variant="none" maxWidth="md" contentClassName="gap-4 border-l-4 border-b-4 border-(--color-primary) p-0 w-fit">
                <h2 className="text-xl md:text-2xl lg:text-4xl font-bold mb-4 text-left border-l-4 border-b-4 border-(--color-primary) pl-4 pb-4 w-fit">
                    Leader :
                </h2>
                <p className="text-lg md:text-xl lg:text-2xl leading-relaxed">
                    Un rendez-vous annuel qui rassemble l&aposensemble du réseau international MIAGE.
                </p>
            </Section>
            <Section variant="none" maxWidth="md" contentClassName="gap-4 border-r-4 border-b-4 border-(--color-primary) p-4 w-fit">
                <h2 className="text-xl md:text-2xl lg:text-4xl font-bold mb-4 text-left border-l-4 border-b-4 border-(--color-primary) pl-4 pb-4 w-fit">
                    Acteur :
                </h2>
                <p className="text-lg md:text-xl lg:text-2xl leading-relaxed">
                    Un rendez-vous annuel qui rassemble l&aposensemble du réseau international MIAGE.
                </p>
            </Section>
            <Section variant="none" maxWidth="md" contentClassName="gap-4 border-l-4 border-b-4 border-(--color-primary) p-4 w-fit">
                <h2 className="text-xl md:text-2xl lg:text-4xl font-bold mb-4 text-left border-l-4 border-b-4 border-(--color-primary) pl-4 pb-4 w-fit">
                    Associé :
                </h2>
                <p className="text-lg md:text-xl lg:text-2xl leading-relaxed">
                    Un rendez-vous annuel qui rassemble l&aposensemble du réseau international MIAGE.
                </p>
            </Section>
        </PageTemplate>
    );
}
