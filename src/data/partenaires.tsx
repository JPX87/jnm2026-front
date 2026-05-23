import { PartnerData } from "@/components/features/PartenariatCard/types";
import Image from "next/image";


// Partenaire majeur
export const majorPartnerData: PartnerData = {
    number: 1,
    partnerType: "Majeur",
    mainLogo: <Image src="/img/partenaires/soprasteria.png" loading="eager" alt="Sopra Steria Logo" className="w-max p-1 !h-auto m-auto" width={300} height={180} />,
    infos: {
        type: "GE",
        name: "SOPRA STERIA",
        nationality: "France",
        issueDate: new Date(2026, 4, 26),
        address: "1 Av. André-Marieㅤㅤㅤ Ampère 31770 Colomiers",
        birthDate: "2014",
        expirationDate: new Date(2026, 4, 29)
    },
    back: {
        title: "Sopra Steria, acteur du numérique responsable",
        classNameDescription: "tracking-[0.067em]",
        description: `Sopra Steria est un acteur majeur du conseil, des services numériques et de l'édition de logiciels en Europe. Présent dans plus de 30 pays, le groupe accompagne les entreprises et organisations dans leur transformation digitale, en plaçant l'innovation, I'IA et le numérique responsable au cœur de ses engagements. Sopra Steria recrute chaque année de nombreux profils IT et métiers, et propose des opportunités de stages, alternances et premiers emplois à forte valeur ajoutée.`
    }
};

// Partenaires leaders
export const ledaPartnerData: PartnerData[] = [
    {
        number: 2,
        partnerType: "Leader",
        mainLogo: <Image src="/img/partenaires/atos.jpg" loading="eager" alt="Atos Logo" className="w-max p-1 !h-auto m-auto" width={300} height={180} />,
        infos: {
            type: "GE",
            name: "ATOS",
            nationality: "France",
            issueDate: new Date(2026, 4, 26),
            address: "6 Imp. Alice Guy,ㅤㅤㅤ 31300 Toulouse",
            birthDate: "1997",
            expirationDate: new Date(2026, 4, 29)
        },
        back: {
            title: "Impossible n'est pas Atos",
            classNameDescription: "tracking-[0.067em]",
            description: `Le Groupe Atos est un leader mondial de la transformation digitale, au service des organisations les plus exigeantes depuis plus de 25 ans. Présent dans 61 pays avec près de 59 000 collaborateurs, Atos accompagne ses clients sur leurs enjeux stratégiques en cloud, cybersécurité, data, IA et infrastructures critiques. L'agence de Toulouse rassemble 700 collaborateurs(trices) passionné(e)s qui interviennent dans les domaines des Télécom, du Secteur Public et du Transport, de l'ingénierie spatiale et aéronautique, du digital et cloud.`
        }
    },
    {
        number: 3,
        partnerType: "Leader",
        mainLogo: <Image src="/img/partenaires/capgemini.png" loading="eager" alt="Capgemini Logo" className="w-max p-1 !h-auto m-auto" width={300} height={180} />,
        infos: {
            type: "GE",
            name: "CAPGEMINI",
            nationality: "France",
            issueDate: new Date(2026, 4, 26),
            address: "Paris",
            birthDate: new Date(1967, 9, 1),
            expirationDate: new Date(2026, 4, 29)
        },
        back: {
            title: "Rendre possible, de l'idée à la réalisation",
            classNameDescription: "tracking-[0.067em]",
            description: `Partenaire mondial de la transformation business et technologique, Capgemini intègre la puissance de l'IA pour créer de la valeur pour ses clients. Nous imaginons le futur des organisations et le rendons réel grâce à l'IA, à la technologie et à nos talents. Depuis 60 ans, nous sommes un groupe responsable et multiculturel, qui proposons des services et des solutions de bout en bout, en mobilisant notre expertise sectorielle, notre écosystème de partenaires et nos compétences de pointe.`
        }
    }, {
        number: 4,
        partnerType: "Leader",
        mainLogo: <Image src="/img/partenaires/cgi.jpg" loading="eager" alt="CGI Logo" className="w-max p-2 !h-auto m-auto" width={300} height={180} />,
        infos: {
            type: "ETR",
            name: "CGI",
            nationality: "Canada",
            issueDate: new Date(2026, 4, 26),
            address: "15 Av. du Dr Mauriceㅤㅤㅤ Grynfogel, 31100 Toulouse",
            birthDate: "1976",
            expirationDate: new Date(2026, 4, 29)
        },
        back: {
            title: "Avec nous, libérez votre potentiel...",
            classNameDescription: "tracking-[0.067em]",
            description: `Chez CGI, nous sommes plus que des employés, nous sommes aussi des associés. Être une entreprise d'associés, c'est un engagement. 
L'engagement d'être toujours impliqués auprès de nos clients dans la réussite de leurs projets, l'engagement de créer une société meilleure grâce à la technologie, à l'innovation et à nos savoir-faire, et surtout, l'engagement de continuer à construire une entreprise qui nous ressemble et dont nous pouvons toutes et tous être fiers.`
        }
    }, {
        number: 5,
        partnerType: "Leader",
        mainLogo: <Image src="/img/partenaires/extia.png" loading="eager" alt="Extia Logo" className="w-max p-1 !h-auto m-auto" width={300} height={180} />,
        infos: {
            type: "ETI",
            name: "EXTIA",
            nationality: "France",
            issueDate: new Date(2026, 4, 26),
            address: "8 Rue de Vidailhanㅤㅤㅤ 31130 Balma",
            birthDate: "2007",
            expirationDate: new Date(2026, 4, 29)
        },
        back: {
            title: "Extia, du conseil IT qui cultive le bien-être",
            classNameDescription: "tracking-[0.067em]",
            description: `Chez Extia, cabinet de conseil en IT et digital, nous croyons qu'en mettant « d'abord qui, ensuite quoi », on libère les talents. Notre communauté de passionnés accompagne les entreprises dans leur transformation technologique tout en cultivant un état d'esprit unique, certifié Great Place To Work. Envie de booster votre carrière dans un environnement stimulant et bienveillant ? Rejoignez le mouvement et venez échanger avec nous sur nos opportunités !`
        }
    }, {
        number: 6,
        partnerType: "Leader",
        mainLogo: <Image src="/img/partenaires/orange.jpg" loading="eager" alt="Orange Logo" className="w-20 p-1 !h-auto m-auto" width={300} height={180} />,
        infos: {
            type: "GE",
            name: "ORANGE",
            nationality: "France",
            issueDate: new Date(2026, 4, 26),
            address: "60 rue Saint-Jeanㅤㅤㅤ 31130 Balma",
            birthDate: "1994",
            expirationDate: new Date(2026, 4, 29)
        },
        back: {
            title: "Orange : innovation et connectivité mondiale",
            classNameDescription: "tracking-[0.067em]",
            description: `Orange est un leader mondial des télécommunications, offrant des services de téléphonie, internet, et solutions numériques. Présent dans 26 pays, il connecte des millions de clients avec des innovations technologiques, tout en s'engageant pour la durabilité et l'inclusion numérique. Orange s'efforce de créer un avenir connecté, sécurisé et accessible à tous. Orange investit dans la 5G, la cybersécurité et les services pour les entreprises, pour accompagner la transformation digitale globale.`
        }
    }];


// Partenaires acteurs
export const actorPartnerData: PartnerData[] = [{
    number: 7,
    partnerType: "Acteur",
    mainLogo: <Image src="/img/partenaires/pap.png" loading="eager" alt="Pro à Pro Logo" className="w-max p-1 !h-auto m-auto" width={300} height={180} />,
    infos: {
        type: "ETI",
        name: "PRO À PRO",
        nationality: "France",
        issueDate: new Date(2026, 4, 26),
        address: "10-12 Cr Michelet,ㅤㅤㅤ 92800 Puteaux",
        birthDate: "1996",
        expirationDate: new Date(2026, 4, 29)
    },
    back: {
        title: "Le goût de l'engagement, pour la restauration !",
        classNameDescription: "tracking-[0.067em]",
        description: `Fondé en 2001, filiale du groupe METRO, Pro à Pro est un acteur clé de la distribution alimentaire. Chaque jour, l'entreprise livre des milliers de cuisiniers dans des écoles, des entreprises, des maisons de retraite, des établissements de santé et des restaurants traditionnels partout en France et dans les départements d'outre-mer. Ce sont plus de 2700 collaborateurs qui partagent ce "goût de l'engagement" pour offrir à leurs clients un service de proximité et la passion de la culinarité.`
    }
},
{
    number: 8,
    partnerType: "Acteur",
    mainLogo: <Image src="/img/partenaires/pwc.png" loading="eager" alt="PwC Logo" className="w-max p-1 !h-auto m-auto" width={300} height={180} />,
    infos: {
        type: "GE",
        name: "PwC",
        nationality: "France",
        issueDate: new Date(2026, 4, 26),
        address: "8 rue des Trente Six Ponts 31400 Toulouse",
        birthDate: "1967",
        expirationDate: new Date(2026, 4, 29)
    },
    back: {
        title: "Grow here. Go further.",
        classNameDescription: "tracking-[0.067em]",
        description: `PwC aide les organisations de toutes tailles et de tous secteurs d'activité à créer de la confiance, se réinventer et se démarquer dans un monde complexe. Ses services de conseil, d'audit et d'expertise juridique et fiscale conjuguent avancées technologiques et savoir-faire pluridisciplinaires pour accompagner et accélérer la transformation durable des entreprises. PwC compte 7 000 collaborateurs en France et au Maghreb, au sein d'un réseau de plus de 364 000 personnes dans 136 pays.`
    }
}];


export interface PartnerLogo {
    name: string;
    url: string;
}

export const partnersList: PartnerLogo[] = [
    { name: "Absys Cyborg", url: "/img/partenaires/AbsysCyborg.png" },
    { name: "Agirc-Arrco", url: "/img/partenaires/agirc-arrco.jpg" },
    { name: "Atos", url: "/img/partenaires/atos.jpg" },
    { name: "Capgemini", url: "/img/partenaires/capgemini.png" },
    { name: "CGI", url: "/img/partenaires/cgi.jpg" },
    { name: "Extia", url: "/img/partenaires/extia.png" },
    { name: "FSI", url: "/img/partenaires/FSI.jpg" },
    { name: "Orange", url: "/img/partenaires/orange.jpg" },
    { name: "Pro à Pro", url: "/img/partenaires/pap.png" },
    { name: "PwC", url: "/img/partenaires/pwc.png" },
    { name: "Sopra Steria", url: "/img/partenaires/soprasteria.png" },
    { name: "Université de Toulouse", url: "/img/partenaires/UT.png" },
];