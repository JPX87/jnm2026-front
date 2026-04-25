import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  reactCompiler: true,

  // === SEO & PERFORMANCE ===

  // Compression GZIP activée par défaut, mais assurons-le explicitement
  compress: true,

  // Optimisation des images (SEO critical)
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    // Optimisation pour Core Web Vitals (LCP)
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Headers pour SEO et performance
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          // Cache headers pour les assets statiques
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          },
          // Headers de sécurité (SEO friendly)
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          },
        ],
      },
      // Pages HTML - cache modéré
      {
        source: '/:path*\\.html',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, stale-while-revalidate=86400'
          },
        ],
      },
      // Assets dynamiques (JS, CSS)
      {
        source: '/(_next|~partytown)/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          },
        ],
      },
      // Fonts - cache maximum
      {
        source: '/fonts/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          },
        ],
      },
    ];
  },

  // Redirects (utile pour les anciennes URLs)
  async redirects() {
    return [
      // Ajouter les redirects 301 si nécessaire
      // Exemple:
      // {
      //   source: '/old-url',
      //   destination: '/new-url',
      //   permanent: true,
      // },
    ];
  },

  // Rewrites (pour les APIs externes)
  async rewrites() {
    return {
      beforeFiles: [
        // Ajouter les rewrites si nécessaire
      ],
    };
  },

  // Variables d'environnement
  env: {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'https://jnm2026.miage.fr',
  },

  // Trailing slashes pour la cohérence SEO
  trailingSlash: false,

  // Génération de sitemaps et robots.txt automatiques
  generateEtags: true,

  // Optimisations supplémentaires
  productionBrowserSourceMaps: false,

  // Internationalization (si applicable)
  i18n: undefined, // À activer si multi-langue

  // PageExtensions
  pageExtensions: ['ts', 'tsx', 'js', 'jsx'],
};

export default nextConfig;
