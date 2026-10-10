'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search, Loader2, SearchX } from 'lucide-react'
import Link from 'next/link'
import { Image as ImageIcon } from 'lucide-react'

interface SearchResult {
  id: string
  title: string
  excerpt: string
  slug: string
  category?: string
  publishedAt?: string
  _formatted?: {
    title?: { snippet?: string }
  }
}

export function SearchResults() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get('q') || ''

  const [query, setQuery] = useState(initialQuery)
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  const doSearch = useCallback(async (q: string) => {
    if (!q || q.length < 2) { setResults([]); setSearched(false); return }
    setLoading(true)
    try {
      const res = await fetch(`/api/search?action=search&q=${encodeURIComponent(q)}&locale=ar&limit=20`)
      if (res.ok) {
        const data = await res.json()
        setResults(data.hits || [])
      }
    } catch { /* ignore */ }
    setLoading(false)
    setSearched(true)
  }, [])

  useEffect(() => {
    if (initialQuery) doSearch(initialQuery)
  }, [initialQuery, doSearch])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query) {
      router.replace(`/ar/search?q=${encodeURIComponent(query)}`)
      doSearch(query)
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-6 flex items-center gap-2 font-kufi text-2xl font-bold text-[var(--foreground)]">
        <Search className="h-6 w-6 text-gold-500" />
        البحث
      </h1>

      <form onSubmit={handleSubmit} className="mb-8 flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute start-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--muted)]" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ابحث عن أخبار، مواضيع، تحليلات..."
            className="w-full rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] py-3.5 pe-4 ps-12 text-sm text-[var(--foreground)] placeholder:text-[var(--muted)] focus:border-gold-500/50 focus:outline-none focus:ring-2 focus:ring-gold-500/15"
            autoFocus
          />
        </div>
        <button type="submit" disabled={loading} className="btn-primary !rounded-2xl !px-6 font-kufi">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          بحث
        </button>
      </form>

      {loading && (
        <div className="flex items-center justify-center gap-3 py-16 text-[var(--muted)]">
          <Loader2 className="h-5 w-5 animate-spin text-gold-400" />
          جاري البحث...
        </div>
      )}

      {!loading && searched && results.length === 0 && (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] py-16 text-center">
          <SearchX className="h-10 w-10 text-[var(--muted)] opacity-30" />
          <p className="text-sm text-[var(--muted)]">لا توجد نتائج مطابقة لـ "{query}"</p>
        </div>
      )}

      {results.length > 0 && (
        <div className="space-y-3">
          <p className="text-xs text-[var(--muted)]">
            {results.length} نتيجة
          </p>
          {results.map((hit) => (
            <Link
              key={hit.id}
              href={`/ar/article/${hit.slug}`}
              className="group block rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-gold-500/40 hover:shadow-lg"
            >
              {hit.category && (
                <span className="badge badge-gold mb-2 text-[10px]">{hit.category}</span>
              )}
              <h3
                className="font-kufi text-base font-bold text-[var(--foreground)] transition-colors group-hover:text-gold-600 [&>mark]:bg-gold-500/25 [&>mark]:text-gold-700"
                dangerouslySetInnerHTML={{ __html: (hit._formatted?.title as any)?.snippet || hit.title || '' }}
              />
              <p
                className="mt-2 text-sm leading-relaxed text-[var(--muted)] line-clamp-2 [&>mark]:bg-gold-500/25 [&>mark]:text-gold-700"
                dangerouslySetInnerHTML={{ __html: ((hit as any)._formatted?.excerpt as any)?.snippet || hit.excerpt || '' }}
              />
            </Link>
          ))}
        </div>
      )}

      {!searched && !loading && (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] py-16 text-center">
          <Search className="h-10 w-10 text-[var(--muted)] opacity-20" />
          <p className="text-sm text-[var(--muted)]">اكتب كلمة للبحث في الأخبار والتحليلات</p>
        </div>
      )}
    </div>
  )
}
