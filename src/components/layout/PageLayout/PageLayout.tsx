import type { Metadata, Viewport } from "next";
import Script from "next/script";
import '@/scss/globals.scss'
import HeaderGrid from "@/components/layout/Header/HeaderGrid";
import NavigationLoader from "@/components/ui/NavigationLoader/NavigationLoader";
import { ThemeProvider } from "@/components/ui/theme/ThemeProvider/ThemeProvider";
import ScrollToHash from "@/lib/ScrollToHash";
import Footer from "../Footer/Footer";
import { getEventSchema, getOrganizationSchema, SITE_CONFIG } from "@/lib/seo";

// VIEWPORT (Mobile & Theme color)
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#1a1a1a",
  colorScheme: "light dark",
}

// SEO & METADATA - Optimisé au maximum
export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.url),
  title: {
    default: SITE_CONFIG.title,
    template: "%s | JNM 2026",
  },
  description: SITE_CONFIG.description,
  keywords: [
    "JNM 2026",
    "Miage",
    "Toulouse",
    "Journées Nationales Miagites",
    "Conférence",
    "Événement",
    "Networking",
    "Formations",
    "Ateliers",
  ],
  authors: [{ name: "JOURNÉES NATIONALES MIAGE 2026" }],
  creator: "JNM 2026",
  publisher: "JNM 2026",

  // Icônes (Favicon & PWA)
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "64x64" },
      { url: "/icon-192.png", sizes: "192x192" },
      { url: "/icon-512.png", sizes: "512x512" },
    ],
    shortcut: "icon-128.png",
    apple: "/apple-touch-icon.png",
  },

  // Manifest PWA
  manifest: "/manifest.json",

  // Canonical URL
  alternates: {
    canonical: SITE_CONFIG.url,
    languages: {
      'fr-FR': SITE_CONFIG.url,
    },
  },

  // Indexation par les robots (Google, Bing)
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  // Open Graph - Optimisé pour les réseaux sociaux
  openGraph: {
    type: 'website',
    locale: SITE_CONFIG.locale,
    url: SITE_CONFIG.url,
    siteName: SITE_CONFIG.name,
    title: SITE_CONFIG.title,
    description: SITE_CONFIG.description,
    images: [
      {
        url: SITE_CONFIG.ogImage,
        width: 1200,
        height: 630,
        alt: SITE_CONFIG.ogImageAlt,
        type: 'image/jpeg',
      }
    ],
  },

  // Vérifications
  verification: {
    google: 'YOUR_GOOGLE_VERIFICATION_CODE', // À remplacer
    yandex: 'YOUR_YANDEX_VERIFICATION_CODE',  // À remplacer
  },

  // Catégories et classification
  category: 'Technology',
  applicationName: 'JNM 2026',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'JNM 2026',
  },
};

export default function RootLayout({
  children,
  header = true,
}: Readonly<{
  children: React.ReactNode;
  header?: boolean;
}>) {
  return (
    <>
      <Script
        id="schema-organization"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(getOrganizationSchema()) }}
      />
      <Script
        id="schema-event"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(getEventSchema()) }}
      />
      <ThemeProvider attribute="data-theme"
        defaultTheme="system"
        enableSystem
        themes={["light", "dark"]}
      >
        <ScrollToHash />
        <NavigationLoader />
        {header && <HeaderGrid />}
        {children}
        <Footer />
      </ThemeProvider>
    </>
  );
}
