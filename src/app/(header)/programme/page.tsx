import PageTemplate from "@/components/layout/PageTemplate/PageTemplate";
import Programme from "@/components/ui/Programme/Programme";
import { Metadata } from "next";
import { generateSeoMetadata, SITE_CONFIG } from '@/lib/seo';

export const metadata: Metadata = generateSeoMetadata({
    title: 'Programme JNM 2026',
    description: 'Découvrez le programme complet des JNM 2026 : conférences, ateliers, compétitions, soirées et activités. Toulouse, 26-29 mai 2026.',
    keywords: ['Programme JNM 2026', 'Horaires JNM', 'Conférences', 'Ateliers', 'Planning'],
    alternates: {
        canonical: `${SITE_CONFIG.url}/programme`,
    },
});

export default function ProgrammePage() {
    return (
        <PageTemplate title="PROGRAMME" className="!bg-(--color-secondary) dark:!bg-(--color-seconde-black) transition-all duration-300" titleClassName="text-(--color-primary)">
            {/* Content Section */}
            <Programme />
        </PageTemplate>
    );
}
