'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search, Loader2, SearchX, Clock } from 'lucide-react'
import Link from 'next/link'

interface SearchResult {
  id: string
  slug: string
  title_ar?: string
  title_en?: string
  excerpt_ar?: string
  categorySlug?: string
  image?: string
  publishedAt?: string
  readingTime?: number
  _formatted?: {
    title_ar?: { snippet?: string }
    excerpt_ar?: { snippet?: string }
  }
}

const CATEGORY_LABELS: Record<string, string> = {
  politics: 'السياسة', economy: 'الاقتصاد', security: 'الأمن', society: 'المجتمع',
  culture: 'الثقافة', sports: 'الرياضة', technology: 'التكنولوجيا', health: 'الصحة',
  education: 'التعليم', environment: 'البيئة', local: 'محليات', world: 'العالم',
}

/* تنقية آمنة: تسمح بوسم <mark> فقط وتحول باقي الأقواس إلى نص */
function safeHighlight(html: string | undefined, plain: string): string {
  const source = html && html.trim() ? html : plain || ''
  return source
    .replace(/&/g, '&')
    .replace(/<(?!\/?mark\b)/gi, '<')
}

function timeAgo(dateStr?: string): string {
  if (!dateStr) return ''
  const diff = Date.now() - new Date(dateStr).getTime()
  const h = Math.floor(diff / 3600_000)
  if (h < 1) return 'الآن'
  if (h < 24) return `قبل ${h} ساعة`
  const d = Math.floor(h / 24)
  if (d < 30) return `قبل ${d} يوم`
  return new Date(dateStr).toLocaleDateString('ar-IQ', { month: 'long', day: 'numeric' })
}

export function SearchResults() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get('q') || ''

  const [query, setQuery] = useState(initialQuery)
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [searched, setSearched] = useState(false)
  const abortRef = useRef<AbortController | null>(null)

  const doSearch = useCallback(async (q: string) => {
    if (!q || q.length < 2) { setResults([]); setSearched(false); setError(''); return }
    setLoading(true)
    setError('')
    abortRef.current?.abort()
    abortRef.current = new AbortController()
    try {
      const res = await fetch(`/api/search?action=search&q=${encodeURIComponent(q)}&limit=20`, {
        signal: abortRef.current.signal,
      })
      if (res.status === 429) {
        setError('طلبات كثيرة — انتظر لحظة ثم حاول مجدداً')
      } else if (res.ok) {
        const data = await res.json()
        setResults(data.hits || [])
      } else {
        setError('تعذر تنفيذ البحث — حاول مجدداً')
      }
    } catch {
      setError('')
    }
    setLoading(false)
    setSearched(true)
  }, [])

  useEffect(() => {
    if (initialQuery) doSearch(initialQuery)
    return () => abortRef.current?.abort()
  }, [initialQuery, doSearch])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.replace(`/ar/search?q=${encodeURIComponent(query.trim())}`)
      doSearch(query.trim())
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-6 flex items-center gap-2 font-kufi text-2xl font-bold text-[var(--foreground)]">
        <Search className="h-6 w-6 text-[var(--muted)]" />
        البحث
      </h1>

      <form onSubmit={handleSubmit} className="mb-8 flex gap-2" role="search">
        <div className="relative flex-1">
          <Search className="absolute start-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--muted)]" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ابحث عن أخبار، مواضيع، تحليلات..."
            aria-label="استعلام البحث"
            maxLength={100}
            className="w-full rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] py-3.5 pe-4 ps-12 text-sm text-[var(--foreground)] placeholder:text-[var(--muted)] focus:border-line-strong focus:outline-none"
            autoFocus
          />
        </div>
        <button type="submit" disabled={loading} className="btn-primary !rounded-2xl !px-6 font-kufi">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          بحث
        </button>
      </form>

      {error && (
        <div className="flex items-center justify-center gap-2 rounded-2xl border border-line bg-cream-deep py-12 text-sm text-[var(--muted)]" role="alert">
          {error}
        </div>
      )}

      {loading && !error && (
        <div className="flex items-center justify-center gap-3 py-16 text-[var(--muted)]" aria-live="polite">
          <Loader2 className="h-5 w-5 animate-spin" />
          جاري البحث...
        </div>
      )}

      {!loading && !error && searched && results.length === 0 && (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] py-16 text-center">
          <SearchX className="h-10 w-10 text-[var(--muted)] opacity-30" />
          <p className="text-sm text-[var(--muted)]">لا توجد نتائج مطابقة لـ "{query}"</p>
          <p className="max-w-xs text-xs text-[var(--muted)] opacity-70">جرّب كلمات أقل أو صياغة مختلفة</p>
        </div>
      )}

      {!loading && !error && results.length > 0 && (
        <div className="space-y-3">
          <p className="text-xs text-[var(--muted)]" aria-live="polite">
            {results.length} نتيجة
          </p>
          {results.map((hit) => {
            const title = hit._formatted?.title_ar?.snippet || hit.title_ar || hit.title_en || ''
            const excerpt = hit._formatted?.excerpt_ar?.snippet || hit.excerpt_ar || ''
            const label = CATEGORY_LABELS[hit.categorySlug || ''] || hit.categorySlug || ''
            return (
              <Link
                key={hit.id}
                href={`/ar/article/${hit.slug}`}
                className="group flex gap-4 rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-line-strong hover:shadow-[var(--shadow-card)]"
              >
                {hit.image && (
                  <div className="relative hidden h-24 w-32 shrink-0 overflow-hidden rounded-xl bg-cream-deep sm:block">
                    <img src={hit.image} alt="" loading="lazy" className="h-full w-full object-cover" />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="mb-1.5 flex items-center gap-2">
                    {label && <span className="text-[10px] font-bold text-[var(--muted)]">{label}</span>}
                    {hit.publishedAt && (
                      <span className="flex items-center gap-1 text-[10px] text-[var(--muted)] opacity-70">
                        <Clock className="h-3 w-3" />
                        {timeAgo(hit.publishedAt)}
                      </span>
                    )}
                  </div>
                  <h3
                    className="font-kufi text-base font-bold leading-snug text-[var(--foreground)] transition-opacity group-hover:opacity-75 [&>mark]:bg-cream-deep [&>mark]:text-[var(--foreground)]"
                    dangerouslySetInnerHTML={{ __html: safeHighlight(hit._formatted?.title_ar?.snippet, title) }}
                  />
                  <p
                    className="mt-1.5 text-sm leading-relaxed text-[var(--muted)] line-clamp-2 [&>mark]:bg-cream-deep [&>mark]:text-[var(--foreground)]"
                    dangerouslySetInnerHTML={{ __html: safeHighlight(hit._formatted?.excerpt_ar?.snippet, excerpt) }}
                  />
                </div>
              </Link>
            )
          })}
        </div>
      )}

      {!searched && !loading && !error && (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] py-16 text-center">
          <Search className="h-10 w-10 text-[var(--muted)] opacity-20" />
          <p className="text-sm text-[var(--muted)]">اكتب كلمة للبحث في الأخبار والتحليلات</p>
        </div>
      )}
    </div>
  )
}
