import { Metadata } from 'next';
import Countdown from "@/components/features/Countdown/Countdown";
import PartenairesCarouselSuitCase from "@/components/ui/PartenairesCarouselSuitCase/PartenairesCarouselSuitCase";
import { Slice } from "@/components/layout/Slice/Slice";
import { Avionn } from "@/components/ui/shapes/Avionn/Avionn";
import MessageBubble from "@/components/ui/shapes/MessageBubble/MessageBubble";
import JsonLdSchema from '@/components/ui/seo/JsonLdSchema';
import {
  generateSeoMetadata,
  getEventSchema,
  getOrganizationSchema,
  SITE_CONFIG
} from '@/lib/seo';
import Link from "next/link";

const dateJNM = "2026-05-26T06:00:00";

// SEO Metadata pour la page d'accueil
export const metadata: Metadata = generateSeoMetadata({
  title: 'JNM 2026 - Toulouse',
  description: 'Découvrez les 42èmes Journées Nationales Miagites à Toulouse (26-29 mai 2026). Conférences, ateliers, networking, compétitions et plus.',
  keywords: [
    'JNM 2026',
    'Journées Nationales Miagites 2026',
    'Toulouse',
    'MIAGE',
    'Conférence informatique',
    'Événement',
    'Networking',
  ],
  alternates: {
    canonical: SITE_CONFIG.url,
  },
  // Rich snippets pour la page d'accueil
  openGraph: {
    type: 'website',
    locale: SITE_CONFIG.locale,
    url: SITE_CONFIG.url,
    title: 'JNM 2026 - Journées Nationales Miagites à Toulouse',
    description: 'Découvrez le plus grand événement annuel du réseau MIAGE. 4 jours de conférences, ateliers et networking à Toulouse.',
    images: [
      {
        url: `${SITE_CONFIG.url}${SITE_CONFIG.ogImage}`,
        width: 1200,
        height: 630,
        alt: 'JNM 2026 - Journées Nationales Miagites',
        type: 'image/jpeg',
      }
    ],
  },
});

export default function Home() {
  const targetDate = new Date(dateJNM);

  return (
    <>
      {/* Schémas JSON-LD pour Rich Results */}
      <JsonLdSchema schema={getEventSchema()} />
      <JsonLdSchema schema={getOrganizationSchema()} />

      {/* Schéma Breadcrumb pour les rich snippets */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              {
                '@type': 'ListItem',
                position: 1,
                name: 'Accueil',
                item: SITE_CONFIG.url,
              },
            ],
          })
        }}
        suppressHydrationWarning
      />

      <main className="home relative" id="top">
        {/* Section Partenaires - hors du Slice pour éviter le chevauchement avec le header fixe */}
        <div className="pt-20 md:pt-24 w-full">
          <PartenairesCarouselSuitCase />
        </div>

        {/* Section Countdown - Section critique pour l'engagement */}
        <Slice absolute first className="top-10 md:!top-20" parentClassName="h-[45vh]">
          <h1 id="countdown" className="text-center text-2xl 2xs:text-[36px] xs:text-4xl xs:text-5xl lg:text-6xl xl:text-[100px] sm:mt-0 mb-[20%] sm:m-auto font-bold my-[20px] sm:my-[50px]">
            EMBARQUEMENT DANS
          </h1>
          <Countdown className="mx-auto mb-[30%] xs:mb-0" targetDate={targetDate} />
          <Avionn className="absolute left-0 right-0 -bottom-30 xs:-bottom-60 sm-bottom-70 lg:-bottom-71 m-auto rotate-90 -scale-x-100 w-56 sm:w-80 md:w-96 lg:w-[400px] lg:h-72 fill-(--color-primary)" />
        </Slice>

        {/* Section CTA - Engagement et conversion */}
        <Slice absolute className="!top-52 md:!top-80" parentClassName="h-[70vh] mb-16 sm:mb-0 sm:h-screen">
          <div className="relative w-10/12 flex flex-col gap-3 py-14 px-6 justify-center rounded-3xl bg-(--color-tertiary) text-(--color-secondary) dark:text-(--color-seconde-black) m-auto">
            <h2 id="contact" className="text-center text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold my-[50px] transition-all">
              DES QUESTIONS SUR LES JNM ?
            </h2>
            <div className="py-2 sm:flex lg:mx-24">
              <Link
                href="/kesako"
                rel="noopener noreferrer"
                className="block mb-4 mx-auto sm:m-auto w-max bg-(--color-secondary) dark:bg-(--color-seconde-black) text-(--color-tertiary) text-xl sm:text-2xl font-bold rounded-4xl py-2 sm:py-3 px-8 sm:px-10 lg:px-20 hover:bg-gray-800 transition-all cursor-pointer"
              >
                KESAKO ?
              </Link>
              <Link
                target="_blank"
                href="https://ig.me/m/jnm2026_tls"
                rel="noopener noreferrer"
                className="block m-auto w-max bg-(--color-secondary) dark:bg-(--color-seconde-black) text-(--color-tertiary) text-xl sm:text-2xl font-bold rounded-4xl py-2 sm:py-3 px-8 sm:px-10 lg:px-20 hover:bg-gray-800 transition-all cursor-pointer"
              >
                CONTACTEZ-NOUS
              </Link>
            </div>
            <MessageBubble classNameP="absolute top-[-20px] md:top-[-50px] right-5" className="bg-(--color-tertiary) border-(--color-primary) border-4" rounded />
            <MessageBubble classNameP="absolute bottom-[-30px] md:bottom-[-50px] left-5" className="bg-(--color-tertiary) border-(--color-primary) border-4" />
          </div>
        </Slice>
      </main>
    </>
  );
}
