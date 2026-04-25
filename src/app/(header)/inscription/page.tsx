import { Metadata } from 'next';
import InscriptionContent from "@/components/features/InscriptionContent/InscriptionContent";
import { generateSeoMetadata, SITE_CONFIG } from '@/lib/seo';

export const metadata: Metadata = generateSeoMetadata({
    title: 'Inscription aux JNM 2026',
    description: 'Inscrivez-vous aux JNM 2026 à Toulouse.',
    keywords: ['Inscription JNM 2026', 'Formulaire d\'inscription', 'S\'inscrire aux JNM'],
    alternates: {
        canonical: `${SITE_CONFIG.url}/inscription`,
    },
});

export default function InscriptionPage() {
    return <InscriptionContent />;
}
