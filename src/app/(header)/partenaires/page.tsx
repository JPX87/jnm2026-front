import { PartenaitCard } from "@/components/features/PartenariatCard";
import PageTemplate from "@/components/layout/PageTemplate/PageTemplate";
import Section from "@/components/layout/Section/Section";
import { PartnerData } from "@/components/features/PartenariatCard/types";
import { LogoSvg } from "@/components/ui/branding/logo/LogoSvg";
import { Card } from "@/components/features/PartenariatCard/Card";

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
        description: `Aujourd'hui, nous sommes une équipe mondiale, leader du conseil et des services numériques,
     qui possèdent une connaissance fine des différents secteurs d’activité et une expertise technologique 
     qui nous permettent d'anticiper les changements du marché, de fournir des conseils pertinents et des 
     services complets, pour accompagner nos clients dans leur transformation à travers quatre métiers : 
     le conseil, l’intégration de systèmes, les business solutions et les services managés. 
     Perfectionnez vos compétences. Partagez vos perspectives. Libérez votre potentiel.`
    }
};

export default function PartenairesPage() {
    return (
        <PageTemplate title="NOS PARTENAIRES" variant="theme" className="organigramme !bg-(--color-secondary) dark:!bg-(--color-seconde-black)" titleClassName="!text-(--color-primary)">
            <div className="relative flex justify-between items-center h-40 sm:h-64 md:h-72 xl:h-80 mx-3">
                <h2 className="text-xl sm:text-2xl md:text-[150px] lg:text-[180px] font-bold mb-4 text-left text-middle text-(--color-tertiary-light) border-l-4 border-b-4 border-(--color-primary) pl-4 pb-4 w-fit">
                    Majeur
                </h2>
                <div className="flex flex-1 justify-end items-center pr-1 md:pr-4">
                    <PartenaitCard data={majorPartnerData} className="scale-50 sm:scale-75 md:scale-100 lg:scale-[1.2] origin-right" />
                </div>
            </div>
            <div className="relative flex h-40 sm:h-64 md:h-72 xl:h-80 mx-3">
                <div className="flex flex-1 justify-start items-center">
                    <PartenaitCard data={majorPartnerData} className="scale-50 sm:scale-75 md:scale-100 lg:scale-[1.2] origin-left" />
                </div>
                <div className="flex flex-1 justify-start items-center">
                    <PartenaitCard data={majorPartnerData} className="scale-50 sm:scale-75 md:scale-100 lg:scale-[1.2] origin-left" />
                </div>
                <h2 className="text-xl sm:text-2xl md:text-[150px] lg:text-[180px] font-bold mb-4 text-right text-(--color-tertiary-light) border-r-4 border-b-4 border-(--color-primary) pr-4 pb-4 w-fit">
                    Leader
                </h2>
            </div>

            <div className="relative flex h-40 sm:h-64 md:h-72 xl:h-80 mx-3">
                <h2 className="text-xl sm:text-2xl md:text-[150px] lg:text-[180px] font-bold mb-4 text-left text-(--color-tertiary-light) border-l-4 border-b-4 border-(--color-primary) pl-4 pb-4 w-fit">
                    Acteur
                </h2>
                <div className="m-auto mr-30 scale-[1.2] flex gap-10">
                    <Card />
                </div>
            </div>
            <div className="relative flex h-40 sm:h-64 md:h-72 xl:h-80 mx-3">
                <div className="m-auto ml-26 scale-[1.2] flex gap-10">
                    <Card />
                    <Card />
                </div>
                <h2 className="text-xl sm:text-2xl md:text-[150px] lg:text-[180px] font-bold mb-4 text-right text-(--color-tertiary-light) border-r-4 border-b-4 border-(--color-primary) pr-4 pb-4 w-fit">
                    Associé
                </h2>
            </div>
        </PageTemplate>
    );
}
