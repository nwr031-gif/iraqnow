import { Metadata } from 'next'
import { Suspense } from 'react'
import { SearchResults } from '@/components/search/SearchResults'

export const dynamic = 'force-static'

export const metadata: Metadata = {
  title: 'البحث',
  description: 'ابحث في أخبار العراق الآن — مقالات، تحليلات، وتقارير',
}

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="container-main py-10">
        <Suspense fallback={<div className="h-96 animate-pulse rounded-2xl bg-[var(--card-bg)]" />}>
          <SearchResults />
        </Suspense>
      </div>
    </div>
  )
}
