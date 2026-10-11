import { Metadata } from 'next'
import Link from 'next/link'
import { TrendingUp } from 'lucide-react'
import { TrendingTopics } from '@/components/home/TrendingTopics'

export const dynamic = 'force-static'
export const revalidate = 3600

export const metadata: Metadata = {
  title: 'الأكثر تداولاً',
  description: 'المواضيع الأكثر تداولاً في العراق الآن — ما يبحث عنه العراقيون',
  alternates: { languages: { ar: '/ar/trending', ku: '/ku/trending', en: '/en/trending' } },
}

export default async function TrendingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params
  const locale = (['ar', 'ku', 'en'].includes(rawLocale) ? rawLocale : 'ar') as 'ar' | 'ku' | 'en'
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="container-main pt-10">
        <h1 className="flex items-center gap-3 font-kufi text-3xl font-bold text-[var(--foreground)]">
          <TrendingUp className="h-8 w-8 text-terra-500" />
          الأكثر تداولاً
        </h1>
        <p className="mt-2 text-sm text-[var(--muted)]">ما يتحدث عنه العراق الآن</p>
      </div>
      <TrendingTopics locale={locale} />
    </div>
  )
}
