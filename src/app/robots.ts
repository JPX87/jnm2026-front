/**
 * Générateur de fichier robots.txt pour Next.js
 * Fichier: src/app/robots.ts
 * Route: /robots.txt
 */

import { MetadataRoute } from 'next';
import { SITE_CONFIG } from '@/lib/seo';

export default function robots(): MetadataRoute.Robots {
    const baseUrl = SITE_CONFIG.url;

    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: [
                    '/_next/',
                    '/admin',
                    '/*.json$',
                ],
            },
            {
                userAgent: 'AdsBot-Google',
                allow: '/',
            },
            {
                userAgent: 'Googlebot',
                allow: '/',
                crawlDelay: 0,
            },
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
        host: baseUrl,
    };
}
