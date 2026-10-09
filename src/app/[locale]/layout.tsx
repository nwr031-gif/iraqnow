import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { Noto_Sans_Arabic, Noto_Kufi_Arabic } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { LocaleSwitcher } from '@/components/layout/LocaleSwitcher'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const notoArabic = Noto_Sans_Arabic({ 
  subsets: ['arabic'], 
  variable: '--font-arabic',
  weight: ['300', '400', '500', '600', '700'],
})
const notoKufi = Noto_Kufi_Arabic({ 
  subsets: ['arabic'], 
  variable: '--font-kufi',
  weight: ['300', '400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: {
    default: 'IraqNow - بوابة العراق الإخبارية',
    template: '%s | IraqNow',
  },
  description: 'منصة إخبارية عراقية شاملة متعددة اللغات (العربية، الكردية، الإنكليزية) مع خرائط تفاعلية، بحث متقدم، وميزات مجتمعية',
  keywords: ['أخبار العراق', 'Iraq news', 'العراق الآن', 'بوابة إخبارية', 'أخبار عربية', 'أخبار كردية'],
  authors: [{ name: 'IraqNow' }],
  creator: 'IraqNow',
  publisher: 'IraqNow',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'ar_IQ',
    url: 'https://iraqnow.com',
    siteName: 'IraqNow',
    title: 'IraqNow - بوابة العراق الإخبارية',
    description: 'منصة إخبارية عراقية شاملة متعددة اللغات',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'IraqNow',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'IraqNow',
    description: 'منصة إخبارية عراقية شاملة متعددة اللغات',
    images: ['/og-image.png'],
  },
  alternates: {
    languages: {
      ar: '/ar',
      ku: '/ku',
      en: '/en',
    },
  },
}

export const viewport: Viewport = {
  themeColor: '#1a1a2e',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const resolvedLocale = (await params).locale
  const dir = resolvedLocale === 'en' ? 'ltr' : 'rtl'
  const lang = resolvedLocale === 'ku' ? 'ckb' : resolvedLocale

  return (
    <html lang={lang} dir={dir} className={`${inter.variable} ${notoArabic.variable} ${notoKufi.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${dir === 'rtl' ? 'font-arabic' : 'font-inter'} antialiased bg-gray-50 text-gray-900`}>
        <Providers locale={resolvedLocale as 'ar' | 'ku' | 'en'}>
          <div className="flex flex-col min-h-screen">
            <LocaleSwitcher />
            <Header locale={resolvedLocale as 'ar' | 'ku' | 'en'} />
            <main className="flex-1">{children}</main>
            <Footer locale={resolvedLocale as 'ar' | 'ku' | 'en'} />
          </div>
        </Providers>
      </body>
    </html>
  )
}