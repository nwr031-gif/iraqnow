/**
 * إحصاءات المنصة الحقيقية — تُبنى من بيانات Supabase وقت البناء
 */

export interface SiteStats {
  totalArticles: number
  breakingCount: number
  thisWeek: number
  categoriesCovered: number
  governoratesCovered: number
  avgReadingTime: number
  totalViews: number
  podcasts: number
  authors: number
  byCategory: Record<string, number>
  byMonth: Array<{ month: string; label: string; count: number }>
  latest: Array<{ title: string; category: string; date: string; views: number }>
  updatedAt: string
}

interface ArticleRow {
  title_ar?: string
  category_slug?: string | null
  governorate_slug?: string | null
  reading_time?: number | null
  view_count?: number | null
  breaking?: boolean | null
  published_at?: string | null
}

const MONTHS_AR = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر']
const MONTHS_EN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function sb() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return null
  return { url, headers: { apikey: key, Authorization: `Bearer ${key}` } }
}

async function countRows(url: string, headers: Record<string, string>, path: string): Promise<number> {
  try {
    const res = await fetch(`${url}/rest/v1/${path}&select=id`, { headers, cache: 'no-store' })
    if (res.status !== 200) return 0
    const rows = await res.json()
    return Array.isArray(rows) ? rows.length : 0
  } catch {
    return 0
  }
}

export async function getSiteStats(locale: 'ar' | 'en' = 'ar'): Promise<SiteStats | null> {
  const conn = sb()
  if (!conn) return null
  const { url, headers } = conn

  try {
    const res = await fetch(
      `${url}/rest/v1/articles?status=eq.PUBLISHED&select=title_ar,category_slug,governorate_slug,reading_time,view_count,breaking,published_at&order=published_at.desc&limit=1000`,
      { headers, cache: 'no-store' }
    )
    if (res.status !== 200) return null
    const rows: ArticleRow[] = await res.json()
    if (rows.length === 0) return null

    const [podcasts, authors] = await Promise.all([
      countRows(url, headers, 'podcast_episodes?is_published=eq.true'),
      countRows(url, headers, 'authors?is_active=eq.true'),
    ])

    const now = Date.now()
    const weekAgo = now - 7 * 86400_000
    const byCategory: Record<string, number> = {}
    const byMonthMap = new Map<string, number>()
    let totalViews = 0
    let readingSum = 0
    let readingN = 0
    let breakingCount = 0
    let thisWeek = 0
    const govs = new Set<string>()

    for (const r of rows) {
      const cat = r.category_slug || 'world'
      byCategory[cat] = (byCategory[cat] || 0) + 1
      if (r.governorate_slug) govs.add(r.governorate_slug)
      if (r.breaking) breakingCount++
      totalViews += r.view_count || 0
      if (r.reading_time) { readingSum += r.reading_time; readingN++ }
      const d = r.published_at ? new Date(r.published_at) : null
      if (d && !isNaN(d.getTime())) {
        const key = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`
        byMonthMap.set(key, (byMonthMap.get(key) || 0) + 1)
        if (d.getTime() > weekAgo) thisWeek++
      }
    }

    /* آخر 6 أشهر */
    const byMonth: SiteStats['byMonth'] = []
    const base = new Date()
    for (let i = 5; i >= 0; i--) {
      const d = new Date(Date.UTC(base.getUTCFullYear(), base.getUTCMonth() - i, 1))
      const key = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`
      byMonth.push({
        month: key,
        label: (locale === 'en' ? MONTHS_EN : MONTHS_AR)[d.getUTCMonth()],
        count: byMonthMap.get(key) || 0,
      })
    }

    const latest = rows.slice(0, 6).map((r) => ({
      title: String(r.title_ar || '').slice(0, 120),
      category: r.category_slug || 'world',
      date: r.published_at || '',
      views: r.view_count || 0,
    }))

    return {
      totalArticles: rows.length,
      breakingCount,
      thisWeek,
      categoriesCovered: Object.keys(byCategory).length,
      governoratesCovered: govs.size,
      avgReadingTime: readingN ? Math.round(readingSum / readingN) : 3,
      totalViews,
      podcasts,
      authors,
      byCategory,
      byMonth,
      latest,
      updatedAt: new Date().toISOString(),
    }
  } catch {
    return null
  }
}
