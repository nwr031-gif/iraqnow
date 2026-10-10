import { Metadata } from 'next'
import Link from 'next/link'
import { TrendingUp } from 'lucide-react'
import { TrendingTopics } from '@/components/home/TrendingTopics'

export const revalidate = 120

export const metadata: Metadata = {
  title: 'الأكثر تداولاً',
  description: 'المواضيع الأكثر تداولاً في العراق الآن — ما يبحث عنه العراقيون',
  alternates: { languages: { ar: '/ar/trending', ku: '/ku/trending', en: '/en/trending' } },
}

export default function TrendingPage() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="container-main pt-10">
        <h1 className="flex items-center gap-3 font-kufi text-3xl font-bold text-[var(--foreground)]">
          <TrendingUp className="h-8 w-8 text-terra-500" />
          الأكثر تداولاً
        </h1>
        <p className="mt-2 text-sm text-[var(--muted)]">ما يتحدث عنه العراق الآن</p>
      </div>
      <TrendingTopics locale="ar" />
    </div>
  )
}
