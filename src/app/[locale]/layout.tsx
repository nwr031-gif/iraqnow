import type { Metadata, Viewport } from 'next'
import { Inter, Noto_Sans_Arabic, Noto_Kufi_Arabic } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { AnalyticsScripts } from '@/components/integrations/AnalyticsScripts'
import { PWAProvider } from '@/components/pwa/PWAProvider'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' })
const notoArabic = Noto_Sans_Arabic({
  subsets: ['arabic'],
  variable: '--font-arabic',
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
})
const notoKufi = Noto_Kufi_Arabic({
  subsets: ['arabic'],
  variable: '--font-kufi',
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://iraqnow.iq'),
  title: {
    default: 'العراق الآن | Iraq Now — صوت العراق الحقيقي',
    template: '%s | العراق الآن — Iraq Now',
  },
  description:
    'منصة إخبارية عراقية مستقلة متعددة اللغات (العربية، الكردية، الإنكليزية). تغطية شاملة من بغداد إلى أربيل والبصرة والموصل — أخبار عاجلة، تقارير معمقة، خرائط تفاعلية، صحافة بيانات، وبودكاست.',
  keywords: [
    'أخبار العراق', 'العراق الآن', 'Iraq Now', 'Iraq news', 'أخبار عربية',
    'أخبار كردية', 'بغداد', 'البصرة', 'أربيل', 'الموصل', 'كردستان',
    'اقتصاد العراق', 'سياسة العراق', 'رووداو', 'شفق نيوز',
  ],
  authors: [{ name: 'فريق العراق الآن', url: 'https://iraqnow.iq/team' }],
  creator: 'Iraq Now — العراق الآن',
  publisher: 'Iraq Now Media',
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  openGraph: {
    type: 'website',
    locale: 'ar_IQ',
    alternateLocale: ['ku_IQ', 'en_US'],
    url: 'https://iraqnow.iq',
    siteName: 'العراق الآن — Iraq Now',
    title: 'العراق الآن | Iraq Now — صوت العراق الحقيقي',
    description: 'تغطية شاملة ومستقلة من بغداد إلى أربيل والبصرة والموصل — بثلاث لغات',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'العراق الآن — Iraq Now' }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@iraqnow',
    creator: '@iraqnow',
    title: 'العراق الآن | Iraq Now',
    description: 'صوت العراق الحقيقي — بثلاث لغات',
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: '/',
    languages: { ar: '/ar', ku: '/ku', en: '/en', 'x-default': '/ar' },
  },
  category: 'news',
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fbf9f4' },
    { media: '(prefers-color-scheme: dark)', color: '#0e0d0b' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  colorScheme: 'light dark',
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const resolvedLocale = (await params).locale
  const locale = (['ar', 'ku', 'en'].includes(resolvedLocale) ? resolvedLocale : 'ar') as 'ar' | 'ku' | 'en'
  const dir = locale === 'en' ? 'ltr' : 'rtl'
  const lang = locale === 'ku' ? 'ckb' : locale

  return (
    <html
      lang={lang}
      dir={dir}
      className={`${inter.variable} ${notoArabic.variable} ${notoKufi.variable}`}
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon.svg" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="العراق الآن" />
        <meta name="format-detection" content="telephone=no" />
      </head>
      <body className={`${dir === 'rtl' ? 'font-arabic' : 'font-inter'} min-h-screen antialiased`}>
        <Providers locale={locale}>
          <AnalyticsScripts />
          <div className="flex min-h-screen flex-col">
            <Header locale={locale} />
            <main className="flex-1">{children}</main>
            <Footer locale={locale} />
          </div>
          <PWAProvider />
        </Providers>
      </body>
    </html>
  )
}
