import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  outputFileTracingExcludes: {
    '/**': [
      './node_modules/@prisma/**',
      './node_modules/.prisma/**',
      './node_modules/pg/**',
      './node_modules/pg-*/**',
      './node_modules/@auth/prisma-adapter/**',
    ],
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'picsum.photos' },
      { protocol: 'https', hostname: 'cdn.iraqnow.com' },
      { protocol: 'https', hostname: 'api.iraqnow.com' },
      { protocol: 'https', hostname: '*.supabase.co' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: 'platform-lookaside.fbsbx.com' },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(self), browsing-topics=()' },
          { key: 'Content-Security-Policy', value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://static.cloudflareinsights.com https://cloud.umami.is https://cdn.onesignal.com https://challenges.cloudflare.com https://giscus.app; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://giscus.app; font-src 'self' https://fonts.gstatic.com https://giscus.app; img-src 'self' data: blob: https://images.unsplash.com https://picsum.photos https://*.supabase.co https://i.pravatar.cc https://lh3.googleusercontent.com https://platform-lookaside.fbsbx.com https://cdn.iraqnow.com; connect-src 'self' https://*.supabase.co https://ms-7fba9866c156-55153.par.meilisearch.io https://cloud.umami.is https://api.onesignal.com https://onesignal.com https://giscus.app https://api.resend.com wss://*.onesignal.com; frame-src https://challenges.cloudflare.com https://giscus.app https://onesignal.com; worker-src 'self' blob:; manifest-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'" },
        ],
      },
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,DELETE,OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization' },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ]
  },
  async rewrites() {
    return [
      {
        source: '/rss',
        destination: '/api/rss',
      },
      {
        source: '/rss.xml',
        destination: '/api/rss',
      },
      {
        source: '/feed.xml',
        destination: '/api/rss',
      },
      {
        source: '/sitemap.xml',
        destination: '/sitemap.xml',
      },
    ]
  },
}

export default nextConfig