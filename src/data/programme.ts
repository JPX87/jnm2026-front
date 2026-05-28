export interface EventBlock {
    title?: string;
    location?: string;
    content?: string;
    startTime: string;
    duration: number;
    size?: number;
    position?: 'minimum' | 'midium' | 'medium';
    borderDisable?: boolean;
}

export interface DaySchedule {
    day: string;
    shortDay: string;
    date: string;
    events: EventBlock[];
}

export const programme: DaySchedule[] = [
    {
        day: 'Mardi 26/05',
        shortDay: 'Mardi',
        date: '26 mai',
        events: [
            {
                title: 'Arrivée des participants → Université de Toulouse',
                content: "Pensez à apporter votre repas du midi ou à prévoir une solution de restauration sur place (Crous, restaurants à proximité, etc).",
                startTime: '8h',
                duration: 7.5,
                size: 7.4,
            },
            {
                title: 'Ouverture JNM 2026',
                location: 'Ampi Concorde, Bât. U4',
                startTime: '15h30',
                duration: 1,
                size: 0.9,
                position: 'minimum',
            },
            {
                title: 'Jeu de cohésion',
                startTime: '16h30',
                duration: 2,
                size: 1.9,
            },
            {
                title: 'Cocktail de bienvenue',
                location: 'Upsidum',
                startTime: '18h30',
                duration: 2.5,
                size: 2.4,
            },
            {
                title: 'Soirée au délirium',
                location: 'Délirium Café',
                startTime: '21h',
                duration: 3,
            },
            {
                title: '',
                startTime: '24h',
                duration: 2,
                borderDisable: true,
            },
        ],
    },
    {
        day: 'Mercredi 27/05',
        shortDay: 'Mercredi',
        date: '27 mai',
        events: [
            {
                title: 'Petit déjeuner',
                location: 'Bât. 2A',
                startTime: '8h',
                duration: 1,
                size: 0.901,
                position: 'minimum',
            },
            {
                title: 'Rencontres ALUMNI',
                location: 'Amphi GRIGNARD & Salles 2A',
                startTime: '9h',
                duration: 1.5,
                size: 1.4,
                position: 'medium',
            },
            {
                title: 'Forum Entreprises',
                location: 'Bât. U6',
                startTime: '11h',
                duration: 1.5,
                position: 'medium',
            },
            {
                title: 'Repas & Networking',
                location: 'Bât. 2A',
                startTime: '12h30',
                duration: 1.5,
                borderDisable: true,
            },
            {
                title: 'Ateliers & Challenges',
                location: 'Salles 2A',
                startTime: '14h',
                duration: 1.5,
                size: 1.9,
            },
            {
                title: 'Atelier E-sport',
                location: 'Salles 2A',
                startTime: '16h',
                duration: 2,
            },
            {
                title: 'PAUSE',
                startTime: '18h',
                duration: 2,
                borderDisable: true,
            },
            {
                title: 'Soirée étudiante',
                startTime: '20h',
                duration: 4,
            },
            {
                title: '',
                startTime: '24h',
                duration: 2,
                borderDisable: true,
            },
        ],
    },
    {
        day: 'Jeudi 28/05',
        shortDay: 'Jeudi',
        date: '28 mai',
        events: [
            {
                title: 'Petit déjeuner',
                location: 'Bât. 2A',
                startTime: '8h',
                duration: 1,
                size: 0.901,
                position: 'minimum',
            },
            {
                title: 'Team building',
                location: 'Centre-ville',
                startTime: '9h',
                duration: 3,
            },
            {
                title: "Déjeuner sur l'herbe",
                content: 'Pique-nique',
                location: 'Prairie des filtres',
                startTime: '12h',
                duration: 2,
                size: 2.5,
                borderDisable: true,
            },
            {
                title: 'Conférences & Ateliers',
                location: 'Amphi CONCORDE',
                startTime: '15h',
                duration: 1.5,
                size: 1.65,
            },
            {
                title: 'Atelier pitch ascenseur',
                location: 'Bât. U6',
                startTime: '16h45',
                duration: 1.25,
                size: 1.5,
                position: 'medium',
            },
            {
                title: 'PAUSE',
                startTime: '18h',
                duration: 2,
                borderDisable: true,
            },
            {
                title: 'Soirée conviviale',
                location: "Bar dream o'clock",
                startTime: '20h',
                duration: 4,
            },
            {
                title: '',
                startTime: '24h',
                duration: 2,
                borderDisable: true,
            },
        ],
    },
    {
        day: 'Vendredi 29/05',
        shortDay: 'Vendredi',
        date: '29 mai',
        events: [
            {
                title: 'Petit déjeuner',
                location: 'Amphi Médecine',
                startTime: '8h',
                duration: 1,
                size: 0.9,
                position: 'minimum',
            },
            {
                title: 'Concours MIAGE',
                location: 'Amphi Médecine (Allées Jules Guesde)',
                startTime: '9h',
                duration: 2,
                size: 1.9,
                position: 'medium',
            },
            {
                title: 'Activité Vélo Smoothie',
                location: 'Amphi Médecine (Allées Jules Guesde)',
                startTime: '11h',
                duration: 1.5,
                size: 1.7,
                position: 'medium',
            },
            {
                title: 'Pique-nique',
                location: 'Jardin des Plantes',
                startTime: '12h30',
                duration: 1.5,
                borderDisable: true,
            },
            {
                title: 'Clôture des JNM 2026',
                location: 'Amphi Médecine',
                startTime: '14h',
                duration: 2,
            },
            {
                title: 'PAUSE',
                startTime: '16h',
                duration: 4,
                borderDisable: true,
            },
            {
                title: 'GALA',
                location: 'Matabiau',
                startTime: '20h',
                duration: 6,
            },
        ],
    },
];
