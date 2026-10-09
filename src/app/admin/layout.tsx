import type { Metadata, Viewport } from 'next'
import { Noto_Sans_Arabic, Noto_Kufi_Arabic } from 'next/font/google'
import '../[locale]/globals.css'
import { Providers } from '../[locale]/providers'
import { AdminShell } from '@/components/admin/AdminShell'
import { getSessionUser } from '@/lib/rbac'
import { redirect } from 'next/navigation'

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

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionUser()

  if (!user || user.role === 'READER') {
    redirect('/ar/auth/signin?callbackUrl=/admin')
  }

  return (
    <html lang="ar" dir="rtl" className={`${notoArabic.variable} ${notoKufi.variable}`} suppressHydrationWarning>
      <body className="font-arabic antialiased">
        <Providers locale="ar">
          <AdminShell user={{ id: user.id, name: user.name || 'محرر', email: user.email || '', role: user.role, image: user.image || undefined }}>
            {children}
          </AdminShell>
        </Providers>
      </body>
    </html>
  )
}
