import type { Metadata, Viewport } from 'next'
import { Noto_Sans_Arabic, Noto_Kufi_Arabic } from 'next/font/google'
import '../[locale]/globals.css'
import { Providers } from '../[locale]/providers'
import { AdminShell } from '@/components/admin/AdminShell'
import { AdminLogin } from '@/components/admin/AdminLogin'
import { adminIsAuthed } from '@/lib/admin-server'
import { ADMIN_USER } from '@/lib/admin-auth'

const notoArabic = Noto_Sans_Arabic({ subsets: ['arabic'], variable: '--font-arabic', display: 'swap' })
const notoKufi = Noto_Kufi_Arabic({ subsets: ['arabic'], variable: '--font-kufi', display: 'swap' })

export const metadata: Metadata = {
  title: { default: 'لوحة التحكم | العراق الآن', template: '%s | لوحة تحكم العراق الآن' },
  robots: { index: false, follow: false },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export const dynamic = 'force-dynamic'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const authed = await adminIsAuthed()

  return (
    <html lang="ar" dir="rtl" className={`${notoArabic.variable} ${notoKufi.variable}`} suppressHydrationWarning>
      <body className="font-arabic antialiased">
        <Providers locale="ar">
          {authed ? <AdminShell user={ADMIN_USER}>{children}</AdminShell> : <AdminLogin />}
        </Providers>
      </body>
    </html>
  )
}
