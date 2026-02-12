import { Metadata } from "next";
import PageTemplate from "@/components/layout/PageTemplate/PageTemplate";
import Section from "@/components/layout/Section/Section";

export const metadata: Metadata = {
    title: "Mentions Légales",
};

export default function MentionsLegalesPage() {
    return (
        <PageTemplate title="MENTIONS LÉGALES" className="mentions-legales">
            {/* Éditeur du site */}
            <Section variant="tertiary" maxWidth="md" contentClassName="gap-4">
                <h2 className="text-2xl md:text-3xl font-bold">Éditeur du site</h2>
                <p className="text-base md:text-lg leading-relaxed">
                    Le site <strong>jnm2026.fr</strong> est édité par :
                </p>
                <ul className="list-disc list-inside text-base md:text-lg leading-relaxed space-y-1">
                    <li><strong>Nom :</strong> MIAGE de Toulouse</li>
                    <li><strong>Statut :</strong> Association loi 1901</li>
                    <li><strong>Siège social :</strong> 118 Rte de Narbonne, 31400 Toulouse</li>
                    <li><strong>Email :</strong> guillaume.helg@gmail.com (envoyer de l'argent)</li>
                    <li><strong>Directeur de publication :</strong> Guillaume HELG </li>
                </ul>
            </Section>

            {/* Hébergement */}
            <Section variant="primary" maxWidth="md" contentClassName="gap-4">
                <h2 className="text-2xl md:text-3xl font-bold">Hébergement</h2>
                <p className="text-base md:text-lg leading-relaxed">
                    Ce site est hébergé par :
                </p>
                <ul className="list-disc list-inside text-base md:text-lg leading-relaxed space-y-1">
                    <li><strong>Hébergeur :</strong> [À COMPLÉTER — Nom de l&apos;hébergeur]</li>
                    <li><strong>Adresse :</strong> [À COMPLÉTER — Adresse de l&apos;hébergeur]</li>
                    <li><strong>Site web :</strong> [À COMPLÉTER — URL de l&apos;hébergeur]</li>
                </ul>
            </Section>

            {/* Propriété intellectuelle */}
            <Section variant="tertiary" maxWidth="md" contentClassName="gap-4">
                <h2 className="text-2xl md:text-3xl font-bold">Propriété intellectuelle</h2>
                <p className="text-base md:text-lg leading-relaxed">
                    L&apos;ensemble du contenu de ce site (textes, images, vidéos, logos, graphismes, icônes) est la propriété exclusive du comité d&apos;organisation des JNM 2026 ou de ses partenaires, sauf mention contraire.
                </p>
                <p className="text-base md:text-lg leading-relaxed">
                    Toute reproduction, représentation, modification, distribution ou exploitation de tout ou partie du contenu de ce site, par quelque procédé que ce soit, sans l&apos;autorisation préalable et écrite de l&apos;éditeur, est strictement interdite et constitue une contrefaçon sanctionnée par les articles L.335-2 et suivants du Code de la propriété intellectuelle.
                </p>
            </Section>

            {/* Protection des données */}
            <Section variant="primary" maxWidth="md" contentClassName="gap-4">
                <h2 className="text-2xl md:text-3xl font-bold">Protection des données personnelles</h2>
                <p className="text-base md:text-lg leading-relaxed">
                    Conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi Informatique et Libertés du 6 janvier 1978 modifiée, vous disposez d&apos;un droit d&apos;accès, de rectification, de suppression et d&apos;opposition aux données personnelles vous concernant.
                </p>
                <p className="text-base md:text-lg leading-relaxed">
                    Pour exercer ces droits, vous pouvez nous contacter à l&apos;adresse suivante : <strong>[À COMPLÉTER — email de contact]</strong>.
                </p>
                <p className="text-base md:text-lg leading-relaxed">
                    Les données collectées via ce site ne sont utilisées que dans le cadre de l&apos;organisation des Journées Nationales Miagistes 2026 et ne sont en aucun cas cédées à des tiers.
                </p>
            </Section>

            {/* Cookies */}
            <Section variant="tertiary" maxWidth="md" contentClassName="gap-4">
                <h2 className="text-2xl md:text-3xl font-bold">Cookies</h2>
                <p className="text-base md:text-lg leading-relaxed">
                    Ce site peut utiliser des cookies à des fins de mesure d&apos;audience et d&apos;amélioration de l&apos;expérience utilisateur. Vous pouvez à tout moment modifier les paramètres de votre navigateur pour refuser les cookies.
                </p>
            </Section>
        </PageTemplate>
    );
}
