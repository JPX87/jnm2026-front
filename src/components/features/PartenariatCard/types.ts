export interface PartnerInfo {
    type: string;
    name: string;
    nationality: string;
    issueDate: Date;
    address: string;
    birthDate: Date;
    expirationDate: Date;
}

export interface PartnerData {
    number: number;
    // Configuration de base
    partnerType: string; // "Majeur", "Leader", "Acteur", "Associé"

    // Logo
    mainLogo: React.ReactNode;

    // Informations de la carte (format ID card)
    infos: PartnerInfo;

    // Texte du verso
    back: CardBackData;

    // Style personnalisé du bas de la carte
    footerText?: string;
}

export interface CardEndData {
    number: number;
    issueDate: Date;
    expirationDate: Date;
}

export interface CardBackData {
    title: string;
    description: string;
    classNameDescription?: string;
}

export interface PartenairCardProps {
    data: PartnerData;
}
