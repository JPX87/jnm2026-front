import { Metadata } from "next";
import PageTemplate from "@/components/layout/PageTemplate/PageTemplate";
import Section from "@/components/layout/Section/Section";
import PartnerCard from "@/components/features/PartnerCard/PartnerCard";

export const metadata: Metadata = {
    title: "Nos Partenaires",
};

const premiumPartners = [
    {
        name: "CGI",
        description: "Leader mondial du conseil et des services en technologies de l'information.",
        logo: "/logos/cgi.svg",
        category: "PARTENAIRE PREMIUM",
        website: "https://www.cgi.com/fr",
    },
    {
        name: "Airbus",
        description: "Leader européen de l'aéronautique, de l'espace et de la défense.",
        logo: "/logos/airbus.svg",
        category: "PARTENAIRE PREMIUM",
        website: "https://www.airbus.com",
    },
];

const goldPartners = [
    {
        name: "Capgemini",
        description: "Transformation numérique, conseil et services technologiques.",
        logo: "/logos/capgemini.svg",
        category: "PARTENAIRE OR",
        website: "https://www.capgemini.com/fr-fr/",
    },
    {
        name: "Sopra Steria",
        description: "Acteur majeur du conseil, des services numériques et de l'édition de logiciels.",
        logo: "/logos/sopra-steria.svg",
        category: "PARTENAIRE OR",
        website: "https://www.soprasteria.com/fr",
    },
];

const silverPartners = [
    {
        name: "Accenture",
        description: "Services de stratégie, de conseil, de digital et de technologie.",
        logo: "/logos/accenture.svg",
        category: "PARTENAIRE ARGENT",
        website: "https://www.accenture.com/fr-fr",
    },
    {
        name: "Thales",
        description: "Haute technologie pour les marchés de la défense, de l'aérospatiale et du transport.",
        logo: "/logos/thales.svg",
        category: "PARTENAIRE ARGENT",
        website: "https://www.thalesgroup.com/fr",
    },
];

export default function PartenairesPage() {
    return (
        <PageTemplate title="NOS PARTENAIRES" className="partenaires">
            {/* Premium Partners */}
            <Section title="PREMIUM" variant="tertiary" maxWidth="xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 justify-items-center">
                    {premiumPartners.map((partner) => (
                        <PartnerCard
                            key={partner.name}
                            {...partner}
                            categoryColor="bg-(--color-primary)"
                        />
                    ))}
                </div>
            </Section>

            {/* Gold Partners */}
            <Section title="OR" variant="primary" maxWidth="xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 justify-items-center">
                    {goldPartners.map((partner) => (
                        <PartnerCard
                            key={partner.name}
                            {...partner}
                            categoryColor="bg-(--color-warning)"
                        />
                    ))}
                </div>
            </Section>

            {/* Silver Partners */}
            <Section title="ARGENT" variant="tertiary" maxWidth="xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 justify-items-center">
                    {silverPartners.map((partner) => (
                        <PartnerCard
                            key={partner.name}
                            {...partner}
                            categoryColor="bg-(--color-gray-400)"
                        />
                    ))}
                </div>
            </Section>
        </PageTemplate>
    );
}
