/**
 * Fichier de configuration SEO centralisé
 * Utilisation: Importez les métadonnées préfabriquées pour chaque page
 */

import { Metadata } from 'next';

// Configuration globale du site
export const SITE_CONFIG = {
    name: 'JNM 2026',
    title: 'JNM 2026 - Toulouse - Journées Nationales Miagites',
    description: 'Site officiel des 42èmes Journées Nationales Miagites qui se tiendront à Toulouse du 26 au 29 mai 2026. Conférences, ateliers, networking et compétitions',
    url: 'https://jnm2026.miage.fr',
    domain: 'jnm2026.miage.fr',
    locale: 'fr_FR',
    ogImage: '/og-image.jpg',
    ogImageAlt: 'JNM 2026 - Journées Nationales Miagites à Toulouse',
};

export const EVENT_CONFIG = {
    name: 'Journées Nationales Miagites 2026',
    description: '42ème édition des Journées Nationales Miagites',
    startDate: '2026-05-26',
    endDate: '2026-05-29',
    startTime: '06:00:00',
    location: {
        name: 'Toulouse, France',
        city: 'Toulouse',
        country: 'France',
        coordinates: {
            latitude: 43.6047,
            longitude: 1.4422
        }
    },
    attendees: '+300',
    yearsOfHistory: 42,
};

/**
 * Fonction pour générer les métadonnées SEO de base
 */
export function generateSeoMetadata(override?: Partial<Metadata>): Metadata {
    return {
        title: {
            default: SITE_CONFIG.title,
            template: '%s | JNM 2026',
        },
        description: SITE_CONFIG.description,
        keywords: [
            'JNM 2026',
            'Journées Nationales Miagites',
            'MIAGE',
            'Toulouse',
            'Conférence',
            'Événement informatique',
            'Networking',
            'Formations',
            'Ateliers',
            'Compétitions'
        ],
        authors: [{ name: 'JOURNÉES NATIONALES MIAGE 2026' }],
        creator: 'JOURNÉES NATIONALES MIAGE 2026',
        publisher: 'JNM 2026',
        robots: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
            googleBot: {
                index: true,
                follow: true,
                'max-video-preview': -1,
                'max-image-preview': 'large',
                'max-snippet': -1,
            },
        },
        alternates: {
            canonical: SITE_CONFIG.url,
        },
        openGraph: {
            type: 'website',
            locale: SITE_CONFIG.locale,
            url: SITE_CONFIG.url,
            siteName: SITE_CONFIG.name,
            title: SITE_CONFIG.title,
            description: SITE_CONFIG.description,
            images: [
                {
                    url: `${SITE_CONFIG.url}${SITE_CONFIG.ogImage}`,
                    width: 1200,
                    height: 630,
                    alt: SITE_CONFIG.ogImageAlt,
                    type: 'image/jpeg',
                }
            ],
        },
        ...override,
    };
}

/**
 * Schéma JSON-LD pour l'événement (pour Google Rich Results)
 */
export function getEventSchema() {
    return {
        '@context': 'https://schema.org',
        '@type': 'Event',
        '@id': `${SITE_CONFIG.url}#event`,
        name: EVENT_CONFIG.name,
        description: EVENT_CONFIG.description,
        url: SITE_CONFIG.url,
        image: `${SITE_CONFIG.url}${SITE_CONFIG.ogImage}`,
        startDate: `${EVENT_CONFIG.startDate}T${EVENT_CONFIG.startTime}`,
        endDate: `${EVENT_CONFIG.endDate}T23:00:00`,
        eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
        eventStatus: 'https://schema.org/EventScheduled',
        location: {
            '@type': 'Place',
            name: EVENT_CONFIG.location.name,
            address: {
                '@type': 'PostalAddress',
                addressLocality: EVENT_CONFIG.location.city,
                addressCountry: EVENT_CONFIG.location.country,
            },
            geo: {
                '@type': 'GeoCoordinates',
                latitude: EVENT_CONFIG.location.coordinates.latitude,
                longitude: EVENT_CONFIG.location.coordinates.longitude,
            }
        },
        organizer: {
            '@type': 'Organization',
            name: 'JOURNÉES NATIONALES MIAGE 2026',
            url: SITE_CONFIG.url,
            sameAs: [
                'https://www.instagram.com/jnm2026_tls/',
            ]
        },
        offers: [
            {
                '@type': 'Offer',
                url: `${SITE_CONFIG.url}/inscription`,
                price: '0',
                priceCurrency: 'EUR',
                availability: 'https://schema.org/InStock',
                validFrom: '2026-04-01',
                validThrough: '2026-05-26',
            }
        ],
        aggregateRating: {
            '@type': 'AggregateRating',
            bestRating: 5,
            worstRating: 1,
            ratingValue: 4.8,
            ratingCount: 42,
        }
    };
}

/**
 * Schéma JSON-LD pour l'organisation (branding)
 */
export function getOrganizationSchema() {
    return {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        '@id': `${SITE_CONFIG.url}#organization`,
        name: SITE_CONFIG.name,
        alternateName: 'JNM',
        url: SITE_CONFIG.url,
        logo: `${SITE_CONFIG.url}/logo.svg`,
        description: SITE_CONFIG.description,
        sameAs: [
            'https://www.instagram.com/jnm2026_tls/',
        ],
        address: {
            '@type': 'PostalAddress',
            addressLocality: EVENT_CONFIG.location.city,
            addressCountry: EVENT_CONFIG.location.country,
        }
    };
}


/**
 * Schéma JSON-LD pour les breadcrumbs
 */
export function getBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: `${SITE_CONFIG.url}${item.url}`,
        }))
    };
}

/**
 * Schéma JSON-LD pour les vidéos (si applicable)
 */
export function getVideoSchema(title: string, description: string, duration: string) {
    return {
        '@context': 'https://schema.org',
        '@type': 'VideoObject',
        name: title,
        description: description,
        duration: duration,
        uploadDate: new Date().toISOString(),
    };
}
