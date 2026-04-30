import { CardEndData } from "./types";

export const formatDateToDDMMYYYY = (date: Date): string => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}${month}${year}`;
};

export const formatDateToFrench = (date: Date): string => {
    const months = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
};

export function renderCardEnd(endData: CardEndData): React.ReactNode {
    const formattedIssueDate = formatDateToDDMMYYYY(endData.issueDate);
    const formattedExpirationDate = formatDateToDDMMYYYY(endData.expirationDate);
    return (
        <h1 className="text-[9px] tracking-[0.15em] p-1 text-white dark:text-(--color-seconde-black)">{`
            PARTENAIRE<<JNM<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< `}<br />{`
            ${formattedIssueDate}<${formattedExpirationDate}<JNM2026TOULOUSE<<<<<<<<<<<<<<<<<<<<<<<${endData.number < 10 ? `0${endData.number}` : endData.number}
        `}</h1>
    );
}
