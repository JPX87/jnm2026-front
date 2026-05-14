import { PartnerData } from "@/components/features/PartenariatCard/types";
import Image from "next/image";


// Partenaire majeur
export const majorPartnerData: PartnerData = {
    number: 1,
    partnerType: "Majeur",
    mainLogo: <Image src="/img/partenaires/soprasteria.png" alt="Sopra Steria Logo" className="w-max p-1 !h-auto m-auto" width={300} height={180} />,
    infos: {
        type: "ESN",
        name: "Sopra Steria",
        nationality: "Française",
        issueDate: new Date(2026, 4, 26),
        address: "Paris",
        birthDate: new Date(1968, 0, 1),
        expirationDate: new Date(2026, 4, 29)
    },
    back: {
        title: "The world is how we shape it.",
        classNameDescription: "tracking-[0.079em]",
        description: `Sopra Steria, acteur majeur de la Tech en Europe avec 56 000 collaborateurs dans près de 30 pays, est reconnu pour ses activités de conseil, de services numériques et d'édition de logiciels. Le groupe aide ses clients à mener leur transformation digitale et à obtenir des bénéfices tangibles et durables.`
    }
};

// Partenaires leaders
export const ledaPartnerData: PartnerData[] = [{
    number: 2,
    partnerType: "Leader",
    mainLogo: <Image src="/img/partenaires/atos.jpg" alt="Atos Logo" className="w-max p-1 !h-auto m-auto" width={300} height={180} />,
    infos: {
        type: "ESN",
        name: "Atos",
        nationality: "Française",
        issueDate: new Date(2026, 4, 26),
        address: "Bezons",
        birthDate: new Date(1997, 0, 1),
        expirationDate: new Date(2026, 4, 29)
    },
    back: {
        title: "Leader de la transformation numérique.",
        classNameDescription: "tracking-[0.079em]",
        description: `Atos est un leader international de la transformation digitale avec plus de 95 000 collaborateurs. Numéro un européen du cloud, de la cybersécurité et des supercalculateurs, le groupe fournit des solutions technologiques intégrées pour tous les secteurs, dans près de 69 pays à travers le monde.`
    }
},
{
    number: 3,
    partnerType: "Leader",
    mainLogo: <Image src="/img/partenaires/capgemini.png" alt="Capgemini Logo" className="w-max p-1 !h-auto m-auto" width={300} height={180} />,
    infos: {
        type: "ESN",
        name: "Capgemini",
        nationality: "Française",
        issueDate: new Date(2026, 4, 26),
        address: "Paris",
        birthDate: new Date(1967, 9, 1),
        expirationDate: new Date(2026, 4, 29)
    },
    back: {
        title: "Get the future you want.",
        classNameDescription: "tracking-[0.079em]",
        description: `Capgemini est un leader mondial, responsable et multiculturel, regroupant 340 000 personnes dans plus de 50 pays. Partenaire stratégique de premier plan, le groupe accompagne les entreprises dans leur transformation en s'appuyant sur toute la puissance de la technologie et de l'innovation.`
    }
}, {
    number: 4,
    partnerType: "Leader",
    mainLogo: <Image src="/img/partenaires/cgi.jpg" alt="CGI Logo" className="w-max p-2 !h-auto m-auto" width={300} height={180} />,
    infos: {
        type: "ESN",
        name: "CGI",
        nationality: "Canadienne",
        issueDate: new Date(2026, 4, 26),
        address: "Montréal",
        birthDate: new Date(1976, 5, 15),
        expirationDate: new Date(2026, 4, 29)
    },
    back: {
        title: "Insights you can act on.",
        classNameDescription: "tracking-[0.079em]",
        description: `Fondée en 1976, CGI figure parmi les plus importantes entreprises indépendantes de services-conseils en technologie de l'information (TI) et en management au monde. CGI compte 90 000 conseillers à l'échelle mondiale et offre un portefeuille complet de services.`
    }
}, {
    number: 5,
    partnerType: "Leader",
    mainLogo: <Image src="/img/partenaires/extia.png" alt="Extia Logo" className="w-max p-1 !h-auto m-auto" width={300} height={180} />,
    infos: {
        type: "Conseil",
        name: "Extia",
        nationality: "Française",
        issueDate: new Date(2026, 4, 26),
        address: "Sèvres",
        birthDate: new Date(2007, 0, 1),
        expirationDate: new Date(2026, 4, 29)
    },
    back: {
        title: "D'abord qui, ensuite quoi !",
        classNameDescription: "tracking-[0.079em]",
        description: `Extia est une société de conseil en ingénierie qui propose une approche innovante alliant performance et bien-être au travail. Créée en 2007, elle compte aujourd'hui plusieurs milliers d'Extiens et est reconnue depuis de nombreuses années par le célèbre label "Great Place to Work".`
    }
}, {
    number: 6,
    partnerType: "Leader",
    mainLogo: <Image src="/img/partenaires/orange.jpg" alt="Orange Logo" className="w-20 p-1 !h-auto m-auto" width={300} height={180} />,
    infos: {
        type: "Télécom",
        name: "Orange",
        nationality: "Française",
        issueDate: new Date(2026, 4, 26),
        address: "Issy-les-Moul.",
        birthDate: new Date(1994, 0, 1),
        expirationDate: new Date(2026, 4, 29)
    },
    back: {
        title: "Orange est là.",
        classNameDescription: "tracking-[0.079em]",
        description: `Orange est l'un des principaux opérateurs de télécommunications dans le monde, avec un chiffre d'affaires majeur dans son secteur. Le groupe compte 137 000 salariés et fournit des services essentiels pour faciliter la vie numérique de millions de clients et entreprises mondialement.`
    }
}];