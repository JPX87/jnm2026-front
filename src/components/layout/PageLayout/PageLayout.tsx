import type { Metadata, Viewport } from "next";
import { Oswald, Open_Sans } from "next/font/google";
import '@/scss/globals.scss'
import HeaderGrid from "@/components/layout/Header/HeaderGrid";
import { ThemeProvider } from "@/components/ui/theme/ThemeProvider/ThemeProvider";

// Configuration des polices
const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
  display: "swap", 
});

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
  display: "swap",
});

// VIEWPORT (Mobile & Theme color)
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
}

// SEO & METADATA
export const metadata: Metadata = {
  title: {
    default: "JNM 2026 - Toulouse",
    template: "%s | JNM 2026", // Sur la page contact, le titre deviendra "Contact | JNM 2026"
  },
  description: "Site officiel des 42èmes Journées Nationales Miagites qui se tiendront à Toulouse du 26 au 29 Mai 2026.",
  
  keywords: ["JNM 2026", "Miage", "Toulouse", "Journées Nationales Miagites", "Conférence", "Événement"],
  authors: [{ name: "Comité d'organisation JNM" }],
  //creator: "Votre Nom ou Agence",
  publisher: "JNM 2026",

  // Icônes (Favicon)
  icons: {
    icon: ["/favicon.ico", "/logo.svg"],
    shortcut: "/favicon-128x128.png",
    apple: "/apple-touch-icon.png",
  },
  
  // Pour indiquer aux moteurs de recherche quelle est l'URL "principale"
  alternates: {
    canonical: "/",
  },

  // Indexation par les robots (Google, Bing)
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
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
    <html lang="fr" suppressHydrationWarning>
      <body
         className={`${openSans.variable} ${oswald.variable} font-sans antialiased`}
      >
        <ThemeProvider attribute="data-theme"
          defaultTheme="system"
          enableSystem
          themes={["light", "dark"]}
        >
          {header && <HeaderGrid />}
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
