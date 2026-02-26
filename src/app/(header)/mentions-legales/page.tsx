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
                    <li><strong>Nom : </strong>JOURNÉES NATIONALES MIAGE 2026</li>
                    <li><strong>Statut : </strong>Association loi 1901</li>
                    <li><strong>Siège social : </strong> 118 route de Narbonne Bureau 112 Bâtiment U3 31400 Toulouse (a remplacer)</li>
                    <li><strong>Email : </strong><a href="mailto:jnm26@miage.fr">jnm26@miage.fr</a></li>
                    <li><strong>Directeur de publication : </strong>Jérémy PATAPY & Mathis Pilon</li>
                </ul>
            </Section>

            {/* Hébergement */}
            <Section variant="primary" maxWidth="md" contentClassName="gap-4">
                <h2 className="text-2xl md:text-3xl font-bold">Hébergement</h2>
                <p className="text-base md:text-lg leading-relaxed">
                    Ce site est hébergé par :
                </p>
                <ul className="list-disc list-inside text-base md:text-lg leading-relaxed space-y-1">
                    <li><strong>Hébergeur : </strong>OVH SAS</li>
                    <li><strong>Adresse : </strong> 2 rue Kellermann, 59100 Roubaix - France</li>
                    <li><strong>Site web : </strong><a href="https://www.ovhcloud.com" target="_blank" rel="noopener noreferrer">www.ovhcloud.com</a></li>
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
                    Pour exercer ces droits, vous pouvez nous contacter à l&apos;adresse suivante : <strong><a href="mailto:jnm26@miage.fr">jnm26@miage.fr</a></strong>.
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
