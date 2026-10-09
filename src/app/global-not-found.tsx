import Link from 'next/link'
import { Noto_Sans_Arabic, Noto_Kufi_Arabic } from 'next/font/google'
import './[locale]/globals.css'

const notoArabic = Noto_Sans_Arabic({ subsets: ['arabic'], variable: '--font-arabic' })
const notoKufi = Noto_Kufi_Arabic({ subsets: ['arabic'], variable: '--font-kufi' })

export default function GlobalNotFound() {
  return (
    <html lang="ar" dir="rtl" className={`${notoArabic.variable} ${notoKufi.variable}`}>
      <body className="font-arabic">
        <div className="flex min-h-screen flex-col items-center justify-center bg-lapis-950 px-6 text-center text-sand-100">
          <p className="font-kufi text-7xl font-bold text-gold-gradient">404</p>
          <h1 className="mt-4 font-kufi text-2xl font-bold">الصفحة غير موجودة</h1>
          <p className="mt-2 max-w-md text-sm text-sand-100/60">
            عذراً، الصفحة التي تبحث عنها غير متوفرة أو تم نقلها.
          </p>
          <Link href="/ar" className="btn-primary mt-8 font-kufi">
            العودة للرئيسية
          </Link>
        </div>
      </body>
    </html>
  )
}