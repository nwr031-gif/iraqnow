import type { MetadataRoute } from 'next'

export const dynamic = 'force-dynamic'

const SB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SB_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const BASE = 'https://iraqnow.pages.dev'

const CATEGORIES = ['politics', 'economy', 'security', 'society', 'culture', 'sports', 'technology', 'health', 'education', 'environment', 'local', 'world']
const GOVS = ['baghdad', 'basra', 'mosul', 'erbil', 'sulaymaniyah', 'duhok', 'halabja', 'najaf', 'karbala', 'anbar', 'diyala', 'kirkuk', 'salahuddin', 'babylon', 'wasit', 'maysan', 'dhi-qar', 'muthanna', 'qadisiya']
const PAGES = ['', 'latest', 'data', 'map', 'podcasts', 'search', 'about', 'editorial-policy', 'contact', 'privacy', 'terms', 'fact-check', 'corrections', 'advertise', 'team']

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = []
  const now = new Date()

  /* الصفحات الأساسية × اللغتين */
  for (const loc of ['ar', 'en']) {
    for (const p of PAGES) entries.push({ url: `${BASE}/${loc}${p ? '/' + p : ''}`, lastModified: now, changeFrequency: 'hourly', priority: p === '' ? 1 : 0.8 })
    for (const c of CATEGORIES) entries.push({ url: `${BASE}/${loc}/category/${c}`, lastModified: now, changeFrequency: 'hourly', priority: 0.7 })
    for (const g of GOVS) entries.push({ url: `${BASE}/${loc}/governorate/${g}`, lastModified: now, changeFrequency: 'weekly', priority: 0.6 })
  }

  /* كل المقالات المنشورة × اللغتين */
  try {
    const res = await fetch(
      `${SB_URL}/rest/v1/articles?select=slug,updated_at&status=eq.PUBLISHED&order=updated_at.desc&limit=1000`,
      { headers: { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}` } as Record<string, string>, cache: 'no-store' },
    )
    if (res.ok) {
      const rows = (await res.json()) as { slug: string; updated_at: string }[]
      for (const a of rows) {
        for (const loc of ['ar', 'en']) {
          entries.push({ url: `${BASE}/${loc}/article/${a.slug}`, lastModified: new Date(a.updated_at), changeFrequency: 'daily', priority: 0.9 })
        }
      }
    }
  } catch { /* نكمل ببقية المدخلات */ }

  return entries
}
