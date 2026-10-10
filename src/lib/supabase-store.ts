/**
 * مخزن Supabase REST — يحفظ وينشر التعديلات فعلياً
 * سلسلة الاستخدام: Supabase (إن وجدت الجداول) ← الذاكرة
 * سيناريو الاستخدام: عند إنشاء الجداول (SQL) يعمل الحفظ تلقائياً بدون أي تغيير
 */

import { getStore, genId } from '@/lib/memory-store'
import { hash } from 'bcryptjs'
import type { MockArticle, MockCategory, MockAuthor, MockPodcast, MockComment } from '@/lib/mock-data'

type Locale = 'ar' | 'ku' | 'en'

const SB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SB_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

function headers(extra: Record<string, string> = {}): Record<string, string> {
  return {
    apikey: SB_KEY || '',
    Authorization: `Bearer ${SB_KEY || ''}`,
    'Content-Type': 'application/json',
    ...extra,
  }
}

let sbReady: boolean | null = null
let sbCheckedAt = 0
let seedAttemptedAt = 0
const SEED_RETRY_MS = 5 * 60_000

export async function isSupabaseReady(): Promise<boolean> {
  if (!SB_URL || !SB_KEY) return false
  const now = Date.now()
  if (sbReady !== null && now - sbCheckedAt < 60_000) return sbReady
  sbCheckedAt = now
  try {
    const res = await fetch(`${SB_URL}/rest/v1/articles?select=id&limit=1`, { headers: headers() })
    sbReady = res.status === 200
  } catch {
    sbReady = false
  }
  return sbReady
}

/* ═══════════ بذر تلقائي — يعيد المحاولة كل 5 دقائق عند الفشل ═══════════ */
async function ensureSeeded() {
  const now = Date.now()
  if (now - seedAttemptedAt < SEED_RETRY_MS) return
  seedAttemptedAt = now
  try {
    const countRes = await fetch(`${SB_URL}/rest/v1/articles?select=id&limit=1`, { headers: headers() })
    if (countRes.status !== 200) return
    const existing = await countRes.json()
    if (Array.isArray(existing) && existing.length > 0) return

    const store = getStore()
    const { MOCK_ARTICLES, MOCK_AUTHORS, MOCK_CATEGORIES, MOCK_PODCASTS } =
      await import('@/lib/mock-data')

    /* الأقسام */
    await fetch(`${SB_URL}/rest/v1/categories`, {
      method: 'POST',
      headers: headers({ Prefer: 'return=minimal' }),
      body: JSON.stringify(
        MOCK_CATEGORIES.map((c) => ({
          id: c.id, slug: c.slug, sort_order: c.order,
          name_ar: c.translations.find((t) => t.locale === 'ar')?.name,
          name_ku: c.translations.find((t) => t.locale === 'ku')?.name,
          name_en: c.translations.find((t) => t.locale === 'en')?.name,
          description_ar: c.translations.find((t) => t.locale === 'ar')?.description || '',
          description_ku: c.translations.find((t) => t.locale === 'ku')?.description || '',
          description_en: c.translations.find((t) => t.locale === 'en')?.description || '',
        }))
      ),
    })

    /* المحررون */
    await fetch(`${SB_URL}/rest/v1/authors`, {
      method: 'POST',
      headers: headers({ Prefer: 'return=minimal' }),
      body: JSON.stringify(
        MOCK_AUTHORS.map((a) => ({
          id: a.id, name: a.name, slug: a.slug, email: a.email, role: a.role,
          avatar: a.avatar || '', cover_image: a.coverImage || '',
          job_title: a.jobTitle.ar, bio: a.bio.ar,
          twitter: a.twitter || '', linkedin: a.linkedin || '', website: a.website || '',
          specialties: a.specialties, staff_since: a.staffSince,
          is_active: a.isActive, article_count: a.articleCount,
        }))
      ),
    })

    /* المقالات */
    await fetch(`${SB_URL}/rest/v1/articles`, {
      method: 'POST',
      headers: headers({ Prefer: 'return=minimal' }),
      body: JSON.stringify(
        MOCK_ARTICLES.map((a) => articleToRow(a))
      ),
    })

    /* البودكاست */
    await fetch(`${SB_URL}/rest/v1/podcast_episodes`, {
      method: 'POST',
      headers: headers({ Prefer: 'return=minimal' }),
      body: JSON.stringify(MOCK_PODCASTS.map((p) => podcastToRow(p))),
    })

    /* الإعدادات */
    await fetch(`${SB_URL}/rest/v1/site_settings`, {
      method: 'POST',
      headers: headers({ Prefer: 'return=minimal' }),
      body: JSON.stringify(
        Object.entries(store.settings).map(([key, value]) => ({ key, value }))
      ),
    })

    console.log('[supabase-store] ✅ seeded initial data')
  } catch (e) {
    console.error('[supabase-store] seed error:', e)
  }
}

/* ═══════════ تحويل الصفوف ═══════════ */

function articleToRow(a: MockArticle) {
  const tr = (l: Locale, f: 'title' | 'excerpt' | 'content') =>
    a.translations?.find((t) => t.locale === l)?.[f] || ''
  return {
    id: a.id,
    slug: a.slug,
    status: a.status,
    breaking: a.breaking,
    featured: a.featured,
    published_at: a.publishedAt || null,
    created_at: a.createdAt || null,
    updated_at: a.updatedAt || null,
    view_count: a.viewCount || 0,
    reading_time: a.readingTime || 5,
    author_id: a.authorId,
    author_name: (a as any).authorName || null,
    category_slug: a.categorySlug,
    governorate_slug: a.governorateSlug,
    image: a.image || '',
    gallery: a.gallery || [],
    tags: a.tagSlugs || [],
    title_ar: tr('ar', 'title'), title_ku: tr('ku', 'title'), title_en: tr('en', 'title'),
    excerpt_ar: tr('ar', 'excerpt'), excerpt_ku: tr('ku', 'excerpt'), excerpt_en: tr('en', 'excerpt'),
    content_ar: tr('ar', 'content'), content_ku: tr('ku', 'content'), content_en: tr('en', 'content'),
  }
}

function rowToArticle(r: any): MockArticle {
  const translations = (['ar', 'ku', 'en'] as Locale[])
    .map((locale) => ({
      locale,
      title: r[`title_${locale}`] || '',
      excerpt: r[`excerpt_${locale}`] || '',
      content: r[`content_${locale}`] || '',
    }))
    .filter((t) => t.title || t.content)
  return {
    id: r.id,
    slug: r.slug,
    status: r.status,
    breaking: !!r.breaking,
    featured: !!r.featured,
    publishedAt: r.published_at || '',
    createdAt: r.created_at || '',
    updatedAt: r.updated_at || '',
    viewCount: r.view_count || 0,
    readingTime: r.reading_time || 5,
    authorId: r.author_id || '',
    categorySlug: r.category_slug || '',
    tagSlugs: r.tags || [],
    governorateSlug: r.governorate_slug || '',
    image: r.image || '',
    gallery: r.gallery || [],
    translations: translations.length ? translations : [{ locale: 'ar', title: '', excerpt: '', content: '' }],
  }
}

function rowToCategory(c: any): MockCategory {
  return {
    id: c.id, slug: c.slug, order: c.sort_order || 0, articleCount: 0,
    translations: (['ar', 'ku', 'en'] as Locale[])
      .map((locale) => ({ locale, name: c[`name_${locale}`] || '', description: c[`description_${locale}`] || '' }))
      .filter((t) => t.name),
  }
}

function rowToAuthor(a: any): MockAuthor {
  return {
    id: a.id, name: a.name || 'محرر', slug: a.slug || a.id, email: a.email || '',
    role: a.role, avatar: a.avatar || undefined, coverImage: a.cover_image || undefined,
    jobTitle: { ar: a.job_title || '', ku: a.job_title || '', en: a.job_title || '' },
    bio: { ar: a.bio || '', ku: a.bio || '', en: a.bio || '' },
    twitter: a.twitter || undefined, linkedin: a.linkedin || undefined,
    instagram: a.instagram || undefined, website: a.website || undefined,
    specialties: a.specialties || [],
    staffSince: a.staff_since || a.created_at || '',
    isActive: a.is_active !== false, articleCount: a.article_count || 0,
  }
}

function podcastToRow(p: MockPodcast) {
  const tr = (l: Locale, f: 'title' | 'description' | 'showNotes') =>
    p.translations?.find((t) => t.locale === l)?.[f] || ''
  return {
    id: p.id, slug: p.slug,
    episode_number: p.episodeNumber, season: p.season,
    duration: p.duration, audio_url: p.audioUrl, cover_url: p.coverUrl,
    published_at: p.publishedAt, is_published: p.isPublished,
    is_featured: p.isFeatured, views: p.views || 0,
    title_ar: tr('ar', 'title'), title_ku: tr('ku', 'title'), title_en: tr('en', 'title'),
    description_ar: tr('ar', 'description'), description_ku: tr('ku', 'description'), description_en: tr('en', 'description'),
    guest_ar: p.guest?.ar || '', guest_ku: p.guest?.ku || '', guest_en: p.guest?.en || '',
    show_notes_ar: tr('ar', 'showNotes'), show_notes_ku: tr('ku', 'showNotes'), show_notes_en: tr('en', 'showNotes'),
  }
}

function rowToPodcast(r: any): MockPodcast {
  const translations = (['ar', 'ku', 'en'] as Locale[])
    .map((locale) => ({
      locale,
      title: r[`title_${locale}`] || '',
      description: r[`description_${locale}`] || '',
      showNotes: r[`show_notes_${locale}`] || '',
    }))
    .filter((t) => t.title)
  return {
    id: r.id, slug: r.slug,
    episodeNumber: r.episode_number || 1, season: r.season || 1,
    duration: r.duration || '0:00', audioUrl: r.audio_url || '', coverUrl: r.cover_url || '',
    publishedAt: r.published_at || '', isPublished: r.is_published !== false,
    isFeatured: !!r.is_featured, views: r.views || 0,
    guest: { ar: r.guest_ar || '', ku: r.guest_ku || '', en: r.guest_en || '' },
    translations: translations.length ? translations : [{ locale: 'ar', title: '', description: '', showNotes: '' }],
  }
}

function rowToComment(c: any): MockComment {
  return {
    id: c.id, articleId: c.article_id, articleTitle: c.article_title || '',
    userId: c.user_id || '', userName: c.user_name || 'زائر',
    content: c.content, status: c.status, createdAt: c.created_at,
  }
}

/* ═══════════ القراءة ═══════════ */

export interface StoreArticleQuery {
  categorySlug?: string
  authorId?: string
  governorateSlug?: string
  status?: string[]
  sort?: 'latest' | 'views'
  excludeId?: string
}

async function sbGet(path: string): Promise<any[] | null> {
  try {
    const res = await fetch(path, { headers: headers() })
    if (res.status !== 200) return null
    return await res.json()
  } catch {
    return null
  }
}

export async function storeCategories(): Promise<MockCategory[]> {
  if (!(await isSupabaseReady())) return getStore().categories
  await ensureSeeded()
  const rows = await sbGet(`${SB_URL}/rest/v1/categories?select=*&order=sort_order.asc`)
  return rows ? rows.map(rowToCategory) : getStore().categories
}

export async function storeCategoryBySlug(slug: string): Promise<MockCategory | null> {
  if (!(await isSupabaseReady())) return getStore().categories.find((c) => c.slug === slug) || null
  const rows = await sbGet(`${SB_URL}/rest/v1/categories?slug=eq.${encodeURIComponent(slug)}&select=*`)
  return rows && rows.length > 0 ? rowToCategory(rows[0]) : null
}

export async function storePublishedArticles(query: StoreArticleQuery): Promise<MockArticle[]> {
  if (!(await isSupabaseReady())) {
    let articles = getStore().articles.filter((a) => a.status === 'PUBLISHED')
    if (query.categorySlug) articles = articles.filter((a) => a.categorySlug === query.categorySlug)
    if (query.authorId) articles = articles.filter((a) => a.authorId === query.authorId)
    if (query.governorateSlug) articles = articles.filter((a) => a.governorateSlug === query.governorateSlug)
    if (query.excludeId) articles = articles.filter((a) => a.id !== query.excludeId)
    if (query.sort === 'views') articles.sort((a, b) => b.viewCount - a.viewCount)
    else articles.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    return articles
  }
  await ensureSeeded()

  const params = new URLSearchParams({ select: '*' })
  if (query.authorId) params.set('author_id', `eq.${query.authorId}`)
  if (query.governorateSlug) params.set('governorate_slug', `eq.${query.governorateSlug}`)
  if (query.excludeId) params.set('id', `neq.${query.excludeId}`)
  if (query.categorySlug) {
    const { MOCK_CATEGORIES } = await import('@/lib/mock-data')
    const cat = MOCK_CATEGORIES.find((c) => c.slug === query.categorySlug)
    params.set('category_slug', `eq.${query.categorySlug}`)
  }
  params.set('order', query.sort === 'views' ? 'view_count.desc' : 'published_at.desc')

  const rows = await sbGet(`${SB_URL}/rest/v1/articles?${params}`)
  if (!rows) return storePublishedArticlesMemory(query)
  let articles = rows.map(rowToArticle)
  /* الوسوم تُفلتر محلياً (jsonb) */
  if (query.categorySlug) articles = articles.filter((a) => a.categorySlug === query.categorySlug)
  return articles
}

function storePublishedArticlesMemory(query: StoreArticleQuery): MockArticle[] {
  let articles = getStore().articles.filter((a) => a.status === 'PUBLISHED')
  if (query.categorySlug) articles = articles.filter((a) => a.categorySlug === query.categorySlug)
  if (query.authorId) articles = articles.filter((a) => a.authorId === query.authorId)
  return articles.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
}

export async function storeArticleBySlug(slug: string): Promise<MockArticle | null> {
  if (!(await isSupabaseReady())) return getStore().articles.find((a) => a.slug === slug) || null
  const rows = await sbGet(`${SB_URL}/rest/v1/articles?slug=eq.${encodeURIComponent(slug)}&select=*`)
  return rows && rows.length > 0 ? rowToArticle(rows[0]) : null
}

export async function storeFeaturedArticles(limit: number): Promise<MockArticle[]> {
  if (!(await isSupabaseReady())) return getStore().articles.filter((a) => a.featured && a.status === 'PUBLISHED').slice(0, limit)
  const rows = await sbGet(`${SB_URL}/rest/v1/articles?featured=eq.true&status=eq.PUBLISHED&select=*&order=published_at.desc&limit=${limit}`)
  return rows ? rows.map(rowToArticle) : getStore().articles.filter((a) => a.featured).slice(0, limit)
}

export async function storeAuthors(includeInactive = false): Promise<MockAuthor[]> {
  if (!(await isSupabaseReady())) {
    const authors = getStore().authors
    return includeInactive ? authors : authors.filter((a) => a.isActive)
  }
  await ensureSeeded()
  const rows = await sbGet(`${SB_URL}/rest/v1/authors?select=*&order=staff_since.asc`)
  if (!rows) return getStore().authors
  let authors = rows.map(rowToAuthor)
  if (!includeInactive) authors = authors.filter((a) => a.isActive)
  return authors
}

export async function storeAuthorById(idOrSlug: string): Promise<MockAuthor | null> {
  if (!(await isSupabaseReady())) return getStore().authors.find((a) => a.id === idOrSlug || a.slug === idOrSlug) || null
  const rows = await sbGet(`${SB_URL}/rest/v1/authors?or=(id.eq.${encodeURIComponent(idOrSlug)},slug.eq.${encodeURIComponent(idOrSlug)})&select=*`)
  return rows && rows.length > 0 ? rowToAuthor(rows[0]) : null
}

export async function storePodcasts(limit?: number): Promise<MockPodcast[]> {
  if (!(await isSupabaseReady())) {
    const pods = getStore().podcasts
    return limit ? pods.slice(0, limit) : pods
  }
  await ensureSeeded()
  const rows = await sbGet(`${SB_URL}/rest/v1/podcast_episodes?select=*&is_published=eq.true&order=episode_number.desc${limit ? `&limit=${limit}` : ''}`)
  return rows ? rows.map(rowToPodcast) : getStore().podcasts
}

export async function storePodcastBySlug(slug: string): Promise<MockPodcast | null> {
  if (!(await isSupabaseReady())) return getStore().podcasts.find((p) => p.slug === slug) || null
  const rows = await sbGet(`${SB_URL}/rest/v1/podcast_episodes?slug=eq.${encodeURIComponent(slug)}&select=*`)
  return rows && rows.length > 0 ? rowToPodcast(rows[0]) : null
}

export async function storeAdminArticles(statusFilter?: string): Promise<MockArticle[]> {
  if (!(await isSupabaseReady())) {
    const all = [...getStore().articles]
    if (!statusFilter || statusFilter === 'all') return all
    return all.filter((a) => a.status === statusFilter)
  }
  await ensureSeeded()
  const statusParam = statusFilter && statusFilter !== 'all' ? `&status=eq.${statusFilter}` : ''
  const rows = await sbGet(`${SB_URL}/rest/v1/articles?select=*&order=updated_at.desc&limit=200${statusParam}`)
  return rows ? rows.map(rowToArticle) : getStore().articles
}

export async function storeStats() {
  if (!(await isSupabaseReady())) {
    const store = getStore()
    const published = store.articles.filter((a) => a.status === 'PUBLISHED')
    return {
      articles: store.articles.length, published: published.length,
      users: store.authors.length, comments: store.comments.length,
      pending: store.comments.filter((c) => c.status === 'pending').length,
      subscribers: store.subscribers.filter((s) => s.active).length,
      podcasts: store.podcasts.length,
      views: published.reduce((s, a) => s + a.viewCount, 0),
    }
  }
  const [articles, authors, comments, subs, podcasts] = await Promise.all([
    sbGet(`${SB_URL}/rest/v1/articles?select=id,status,view_count`),
    sbGet(`${SB_URL}/rest/v1/authors?select=id`),
    sbGet(`${SB_URL}/rest/v1/comments?select=id,status`),
    sbGet(`${SB_URL}/rest/v1/newsletter_subscribers?select=id,active`),
    sbGet(`${SB_URL}/rest/v1/podcast_episodes?select=id`),
  ])
  const arts = articles || []
  const published = arts.filter((a) => a.status === 'PUBLISHED')
  return {
    articles: arts.length,
    published: published.length,
    users: (authors || []).length,
    comments: (comments || []).length,
    pending: (comments || []).filter((c) => c.status === 'pending').length,
    subscribers: (subs || []).filter((s) => s.active).length,
    podcasts: (podcasts || []).length,
    views: published.reduce((s, a) => s + (a.view_count || 0), 0),
  }
}

export async function storeComments(statusFilter?: string): Promise<MockComment[]> {
  if (!(await isSupabaseReady())) {
    const all = getStore().comments
    if (!statusFilter || statusFilter === 'all') return all
    return all.filter((c) => c.status === statusFilter)
  }
  const statusParam = statusFilter && statusFilter !== 'all' ? `&status=eq.${statusFilter}` : ''
  const rows = await sbGet(`${SB_URL}/rest/v1/comments?select=*&order=created_at.desc&limit=100${statusParam}`)
  return rows ? rows.map(rowToComment) : getStore().comments
}

export async function storeSubscribers() {
  if (!(await isSupabaseReady())) return getStore().subscribers
  const rows = await sbGet(`${SB_URL}/rest/v1/newsletter_subscribers?select=*&order=created_at.desc&limit=200`)
  return rows
    ? rows.map((s: any) => ({ id: s.id, email: s.email, locale: s.locale, active: s.active !== false, createdAt: s.created_at }))
    : getStore().subscribers
}

/* ═══════════ الكتابة ═══════════ */

async function sbInsert(table: string, rows: any): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetch(`${SB_URL}/rest/v1/${table}`, {
      method: 'POST',
      headers: headers({ Prefer: 'return=minimal' }),
      body: JSON.stringify(rows),
    })
    if (res.status === 201 || res.status === 200) return { ok: true }
    const body = await res.text().catch(() => '')
    return { ok: false, error: `Supabase ${res.status}: ${body.slice(0, 150)}` }
  } catch (e: any) {
    return { ok: false, error: e.message }
  }
}

async function sbUpdate(table: string, id: string, updates: any): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetch(`${SB_URL}/rest/v1/${table}?id=eq.${encodeURIComponent(id)}`, {
      method: 'PATCH',
      headers: headers({ Prefer: 'return=minimal' }),
      body: JSON.stringify(updates),
    })
    if (res.status === 200 || res.status === 204) return { ok: true }
    const body = await res.text().catch(() => '')
    return { ok: false, error: `Supabase ${res.status}: ${body.slice(0, 150)}` }
  } catch (e: any) {
    return { ok: false, error: e.message }
  }
}

async function sbDelete(table: string, id: string): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetch(`${SB_URL}/rest/v1/${table}?id=eq.${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: headers(),
    })
    if (res.status === 200 || res.status === 204) return { ok: true }
    const body = await res.text().catch(() => '')
    return { ok: false, error: `Supabase ${res.status}: ${body.slice(0, 150)}` }
  } catch (e: any) {
    return { ok: false, error: e.message }
  }
}

export async function storeCreateArticle(data: Partial<MockArticle> & { authorName?: string }): Promise<{ ok: boolean; id?: string; error?: string; mock?: boolean }> {
  if (!(await isSupabaseReady())) {
    const created = getStoreCreateArticleMemory(data)
    return created
  }
  const id = data.id || genId('article')
  const article: MockArticle = {
    id,
    slug: data.slug || genId('story'),
    status: (data.status as MockArticle['status']) || 'DRAFT',
    breaking: data.breaking || false,
    featured: data.featured || false,
    publishedAt: data.status === 'PUBLISHED' ? new Date().toISOString() : data.publishedAt || '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    viewCount: 0,
    readingTime: data.readingTime || 5,
    authorId: data.authorId || '',
    categorySlug: data.categorySlug || 'politics',
    tagSlugs: data.tagSlugs || [],
    governorateSlug: data.governorateSlug || 'baghdad',
    image: data.image || '',
    gallery: data.gallery || [],
    translations: data.translations || [],
  }
  const res = await sbInsert('articles', articleToRow(article))
  if (!res.ok) return { ok: false, error: res.error }
  return { ok: true, id, mock: false }
}

function getStoreCreateArticleMemory(data: Partial<MockArticle> & { authorName?: string }): { ok: boolean; id?: string; error?: string; mock?: boolean } {
  const store = getStore()
  const now = new Date().toISOString()
  const article: MockArticle = {
    id: genId('article'),
    slug: data.slug || genId('story'),
    status: (data.status as MockArticle['status']) || 'DRAFT',
    breaking: data.breaking || false,
    featured: data.featured || false,
    publishedAt: data.status === 'PUBLISHED' ? now : data.publishedAt || '',
    createdAt: now,
    updatedAt: now,
    viewCount: 0,
    readingTime: data.readingTime || 5,
    authorId: data.authorId || 'user-admin',
    categorySlug: data.categorySlug || 'politics',
    tagSlugs: data.tagSlugs || [],
    governorateSlug: data.governorateSlug || 'baghdad',
    image: data.image || '',
    gallery: data.gallery || [],
    translations: data.translations || [],
  }
  store.articles.unshift(article)
  return { ok: true, id: article.id, mock: true }
}

export async function storeUpdateArticle(id: string, updates: Partial<MockArticle>): Promise<{ ok: boolean; error?: string; mock?: boolean }> {
  if (!(await isSupabaseReady())) {
    const store = getStore()
    const idx = store.articles.findIndex((a) => a.id === id)
    if (idx === -1) return { ok: false, error: 'المقال غير موجود' }
    const existing = store.articles[idx]
    const merged = { ...existing, ...updates, updatedAt: new Date().toISOString() }
    if (updates.status === 'PUBLISHED' && !existing.publishedAt) merged.publishedAt = new Date().toISOString()
    store.articles[idx] = merged
    return { ok: true, mock: true }
  }
  const row: any = { updated_at: new Date().toISOString() }
  if (updates.slug) row.slug = updates.slug
  if (updates.status) {
    row.status = updates.status
    if (updates.status === 'PUBLISHED') row.published_at = new Date().toISOString()
  }
  if (updates.breaking !== undefined) row.breaking = updates.breaking
  if (updates.featured !== undefined) row.featured = updates.featured
  if (updates.image !== undefined) row.image = updates.image
  if (updates.gallery !== undefined) row.gallery = updates.gallery
  if (updates.tagSlugs) row.tags = updates.tagSlugs
  if (updates.governorateSlug) row.governorate_slug = updates.governorateSlug
  if (updates.categorySlug) row.category_slug = updates.categorySlug
  const tr = (l: Locale, f: 'title' | 'excerpt' | 'content') =>
    updates.translations?.find((t) => t.locale === l)?.[f]
  for (const l of ['ar', 'ku', 'en'] as Locale[]) {
    const title = tr(l, 'title')
    const excerpt = tr(l, 'excerpt')
    const content = tr(l, 'content')
    if (title !== undefined) row[`title_${l}`] = title
    if (excerpt !== undefined) row[`excerpt_${l}`] = excerpt
    if (content !== undefined) row[`content_${l}`] = content
  }
  const res = await sbUpdate('articles', id, row)
  return res.ok ? { ok: true, mock: false } : { ok: false, error: res.error }
}

export async function storeDeleteArticle(id: string): Promise<{ ok: boolean; error?: string; mock?: boolean }> {
  if (!(await isSupabaseReady())) {
    const store = getStore()
    const idx = store.articles.findIndex((a) => a.id === id)
    if (idx === -1) return { ok: false, error: 'المقال غير موجود' }
    store.articles.splice(idx, 1)
    return { ok: true, mock: true }
  }
  const res = await sbDelete('articles', id)
  return res.ok ? { ok: true, mock: false } : { ok: false, error: res.error }
}

export async function storeCreateEditor(data: {
  name: string; email: string; password: string
  role: 'JOURNALIST' | 'EDITOR' | 'ADMIN'; jobTitle?: string; bio?: string
}): Promise<{ ok: boolean; id?: string; error?: string; mock?: boolean }> {
  if (!data.name || !data.email || !data.password) return { ok: false, error: 'الاسم والبريد وكلمة المرور مطلوبة' }
  if (data.password.length < 6) return { ok: false, error: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' }

  const passwordHash = await hash(data.password, 10)
  let slug = data.name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\u0600-\u06FF-]/g, '')
    .replace(/^-+|-+$/g, '')
  /* الاسم العربي قد يُنتج slug غير صالح — استخدم البريد كأساس مضمون */
  if (!slug || slug.length < 3 || /^-+$/.test(slug)) {
    slug = data.email.split('@')[0].toLowerCase().replace(/[^\w-]/g, '') || genId('author')
  }
  if (getStore().authors.find((a) => a.slug === slug)) {
    slug = `${slug}-${genId('u').slice(-4)}`
  }

  if (!(await isSupabaseReady())) {
    const store = getStore()
    if (store.authors.find((a) => a.email === data.email)) return { ok: false, error: 'البريد الإلكتروني مستخدم مسبقاً' }
    const author: MockAuthor = {
      id: genId('user'), name: data.name, slug, email: data.email, role: data.role,
      avatar: `https://i.pravatar.cc/300?u=${encodeURIComponent(data.email)}`,
      jobTitle: { ar: data.jobTitle || '', ku: data.jobTitle || '', en: data.jobTitle || '' },
      bio: { ar: data.bio || '', ku: data.bio || '', en: data.bio || '' },
      specialties: [], staffSince: new Date().toISOString(), isActive: true, articleCount: 0,
    }
    ;(author as any).passwordHash = passwordHash
    store.authors.push(author)
    return { ok: true, id: author.id, mock: true }
  }

  const existing = await sbGet(`${SB_URL}/rest/v1/authors?email=eq.${encodeURIComponent(data.email)}&select=id`)
  if (existing && existing.length > 0) return { ok: false, error: 'البريد الإلكتروني مستخدم مسبقاً' }

  const id = genId('user')
  const res = await sbInsert('authors', [{
    id, name: data.name, slug, email: data.email, role: data.role,
    job_title: data.jobTitle || '', bio: data.bio || '',
    specialties: [], staff_since: new Date().toISOString(),
    is_active: true, article_count: 0, password_hash: passwordHash,
  }])
  if (!res.ok) return { ok: false, error: res.error }
  return { ok: true, id, mock: false }
}

export async function storeUpdateUser(id: string, updates: Partial<MockAuthor> & { password?: string }): Promise<{ ok: boolean; error?: string; mock?: boolean }> {
  if (!(await isSupabaseReady())) {
    const store = getStore()
    const author = store.authors.find((a) => a.id === id)
    if (!author) return { ok: false, error: 'المستخدم غير موجود' }
    Object.assign(author, updates)
    if (updates.password) (author as any).passwordHash = await hash(updates.password, 10)
    return { ok: true, mock: true }
  }
  const row: any = {}
  if (updates.name) row.name = updates.name
  if (updates.role) row.role = updates.role
  if (updates.isActive !== undefined) row.is_active = updates.isActive
  if (updates.avatar !== undefined) row.avatar = updates.avatar
  if (updates.coverImage !== undefined) row.cover_image = updates.coverImage
  if (updates.jobTitle) row.job_title = updates.jobTitle.ar || updates.jobTitle.en || ''
  if (updates.bio) row.bio = updates.bio.ar || updates.bio.en || ''
  if (updates.twitter !== undefined) row.twitter = updates.twitter
  if (updates.linkedin !== undefined) row.linkedin = updates.linkedin
  if (updates.instagram !== undefined) row.instagram = updates.instagram
  if (updates.website !== undefined) row.website = updates.website
  if (updates.specialties) row.specialties = updates.specialties
  if (updates.password) row.password_hash = await hash(updates.password, 10)
  const res = await sbUpdate('authors', id, row)
  return res.ok ? { ok: true, mock: false } : { ok: false, error: res.error }
}

export async function storeDeleteUser(id: string): Promise<{ ok: boolean; error?: string; mock?: boolean }> {
  if (!(await isSupabaseReady())) {
    const store = getStore()
    const idx = store.authors.findIndex((a) => a.id === id)
    if (idx === -1) return { ok: false, error: 'المستخدم غير موجود' }
    store.authors.splice(idx, 1)
    return { ok: true, mock: true }
  }
  const res = await sbDelete('authors', id)
  return res.ok ? { ok: true, mock: false } : { ok: false, error: res.error }
}

export async function storeVerifyLogin(email: string, password: string, compareFn: (a: string, b: string) => Promise<boolean>): Promise<{ id: string; name: string; role: string } | null> {
  if (!(await isSupabaseReady())) {
    const store = getStore()
    const author = (store.authors as any).find((a: any) => a.email === email)
    if (author?.passwordHash) {
      const stored = author.passwordHash as string
      const plain = stored.length < 30 ? stored : null
      if (plain && plain === password) return { id: author.id, name: author.name, role: author.role }
      if (plain === null && (await compareFn(password, stored))) return { id: author.id, name: author.name, role: author.role }
    }
    return null
  }
  const rows = await sbGet(`${SB_URL}/rest/v1/authors?email=eq.${encodeURIComponent(email)}&select=id,name,role,password_hash,is_active`)
  if (!rows || rows.length === 0) return null
  const author = rows[0]
  if (author.is_active === false) return null
  if (!author.password_hash) return null
  const isValid = await compareFn(password, author.password_hash)
  return isValid ? { id: author.id, name: author.name, role: author.role } : null
}

export async function storeModerateComment(id: string, status: MockComment['status']): Promise<{ ok: boolean; error?: string; mock?: boolean }> {
  if (!(await isSupabaseReady())) {
    const comment = getStore().comments.find((c) => c.id === id)
    if (!comment) return { ok: false, error: 'التعليق غير موجود' }
    comment.status = status
    return { ok: true, mock: true }
  }
  const res = await sbUpdate('comments', id, { status })
  return res.ok ? { ok: true, mock: false } : { ok: false, error: res.error }
}

export async function storeDeleteComment(id: string): Promise<{ ok: boolean; error?: string; mock?: boolean }> {
  if (!(await isSupabaseReady())) {
    const store = getStore()
    const idx = store.comments.findIndex((c) => c.id === id)
    if (idx === -1) return { ok: false, error: 'التعليق غير موجود' }
    store.comments.splice(idx, 1)
    return { ok: true, mock: true }
  }
  const res = await sbDelete('comments', id)
  return res.ok ? { ok: true, mock: false } : { ok: false, error: res.error }
}

export async function storeCreateCategory(data: { slug: string; translations: { locale: Locale; name: string; description?: string }[] }): Promise<{ ok: boolean; id?: string; error?: string; mock?: boolean }> {
  if (!data.slug || !data.translations.find((t) => t.locale === 'ar')?.name) {
    return { ok: false, error: 'المعرف والاسم العربي مطلوبان' }
  }
  if (!(await isSupabaseReady())) {
    const store = getStore()
    if (store.categories.find((c) => c.slug === data.slug)) return { ok: false, error: 'معرف القسم مستخدم مسبقاً' }
    const cat: MockCategory = {
      id: genId('cat'), slug: data.slug, order: store.categories.length + 1, articleCount: 0,
      translations: data.translations.map((t) => ({ locale: t.locale, name: t.name, description: t.description || '' })),
    }
    store.categories.push(cat)
    return { ok: true, id: cat.id, mock: true }
  }
  const existing = await sbGet(`${SB_URL}/rest/v1/categories?slug=eq.${encodeURIComponent(data.slug)}&select=id`)
  if (existing && existing.length > 0) return { ok: false, error: 'معرف القسم مستخدم مسبقاً' }
  const id = genId('cat')
  const row: any = { id, slug: data.slug }
  for (const t of data.translations) {
    row[`name_${t.locale}`] = t.name
    row[`description_${t.locale}`] = t.description || ''
  }
  const res = await sbInsert('categories', [row])
  return res.ok ? { ok: true, id, mock: false } : { ok: false, error: res.error }
}

export async function storeUpdateCategory(id: string, updates: { slug?: string; translations?: { locale: Locale; name: string; description?: string }[] }): Promise<{ ok: boolean; error?: string; mock?: boolean }> {
  if (!(await isSupabaseReady())) {
    const store = getStore()
    const idx = store.categories.findIndex((c) => c.id === id)
    if (idx === -1) return { ok: false, error: 'القسم غير موجود' }
    if (updates.slug) store.categories[idx].slug = updates.slug
    if (updates.translations) store.categories[idx].translations = updates.translations.map((t) => ({ locale: t.locale, name: t.name, description: t.description || '' }))
    return { ok: true, mock: true }
  }
  const row: any = {}
  if (updates.slug) row.slug = updates.slug
  if (updates.translations) {
    for (const t of updates.translations) {
      row[`name_${t.locale}`] = t.name
      row[`description_${t.locale}`] = t.description || ''
    }
  }
  const res = await sbUpdate('categories', id, row)
  return res.ok ? { ok: true, mock: false } : { ok: false, error: res.error }
}

export async function storeDeleteCategory(id: string): Promise<{ ok: boolean; error?: string; mock?: boolean }> {
  if (!(await isSupabaseReady())) {
    const store = getStore()
    const idx = store.categories.findIndex((c) => c.id === id)
    if (idx === -1) return { ok: false, error: 'القسم غير موجود' }
    store.categories.splice(idx, 1)
    return { ok: true, mock: true }
  }
  const res = await sbDelete('categories', id)
  return res.ok ? { ok: true, mock: false } : { ok: false, error: res.error }
}

export async function storeCreatePodcast(data: Partial<MockPodcast>): Promise<{ ok: boolean; id?: string; error?: string; mock?: boolean }> {
  const ar = data.translations?.find((t) => t.locale === 'ar')
  if (!ar?.title) return { ok: false, error: 'العنوان العربي مطلوب' }
  if (!(await isSupabaseReady())) {
    const store = getStore()
    const maxEp = Math.max(0, ...store.podcasts.map((p) => p.episodeNumber))
    const pod: MockPodcast = {
      id: genId('pod'), slug: data.slug || `episode-${data.episodeNumber || maxEp + 1}`,
      episodeNumber: data.episodeNumber || maxEp + 1, season: data.season || 3,
      duration: data.duration || '0:00', audioUrl: data.audioUrl || '',
      coverUrl: data.coverUrl || `https://picsum.photos/seed/${genId('cover')}/600/600`,
      publishedAt: new Date().toISOString(), isPublished: data.isPublished ?? true,
      isFeatured: data.isFeatured || false, views: 0,
      guest: data.guest || { ar: '', ku: '', en: '' },
      translations: data.translations || [],
    }
    store.podcasts.unshift(pod)
    return { ok: true, id: pod.id, mock: true }
  }
  const id = genId('pod')
  const row = podcastToRow({ ...(data as MockPodcast), id, publishedAt: new Date().toISOString() })
  const res = await sbInsert('podcast_episodes', [row])
  return res.ok ? { ok: true, id, mock: false } : { ok: false, error: res.error }
}

export async function storeUpdatePodcast(id: string, updates: Partial<MockPodcast>): Promise<{ ok: boolean; error?: string; mock?: boolean }> {
  if (!(await isSupabaseReady())) {
    const store = getStore()
    const idx = store.podcasts.findIndex((p) => p.id === id)
    if (idx === -1) return { ok: false, error: 'الحلقة غير موجودة' }
    store.podcasts[idx] = { ...store.podcasts[idx], ...updates }
    return { ok: true, mock: true }
  }
  const row: any = {}
  if (updates.episodeNumber) row.episode_number = updates.episodeNumber
  if (updates.duration) row.duration = updates.duration
  if (updates.audioUrl) row.audio_url = updates.audioUrl
  if (updates.coverUrl) row.cover_url = updates.coverUrl
  if (updates.isPublished !== undefined) row.is_published = updates.isPublished
  if (updates.isFeatured !== undefined) row.is_featured = updates.isFeatured
  if (updates.guest) {
    row.guest_ar = updates.guest.ar || ''
    row.guest_ku = updates.guest.ku || ''
    row.guest_en = updates.guest.en || ''
  }
  const tr = (l: Locale, f: 'title' | 'description' | 'showNotes') =>
    updates.translations?.find((t) => t.locale === l)?.[f]
  for (const l of ['ar', 'ku', 'en'] as Locale[]) {
    const v1 = tr(l, 'title'); const v2 = tr(l, 'description'); const v3 = tr(l, 'showNotes')
    if (v1 !== undefined) row[`title_${l}`] = v1
    if (v2 !== undefined) row[`description_${l}`] = v2
    if (v3 !== undefined) row[`show_notes_${l}`] = v3
  }
  const res = await sbUpdate('podcast_episodes', id, row)
  return res.ok ? { ok: true, mock: false } : { ok: false, error: res.error }
}

export async function storeDeletePodcast(id: string): Promise<{ ok: boolean; error?: string; mock?: boolean }> {
  if (!(await isSupabaseReady())) {
    const store = getStore()
    const idx = store.podcasts.findIndex((p) => p.id === id)
    if (idx === -1) return { ok: false, error: 'الحلقة غير موجودة' }
    store.podcasts.splice(idx, 1)
    return { ok: true, mock: true }
  }
  const res = await sbDelete('podcast_episodes', id)
  return res.ok ? { ok: true, mock: false } : { ok: false, error: res.error }
}

export async function storeDeleteSubscriber(id: string): Promise<{ ok: boolean; error?: string; mock?: boolean }> {
  if (!(await isSupabaseReady())) {
    const store = getStore()
    const idx = store.subscribers.findIndex((s) => s.id === id)
    if (idx === -1) return { ok: false, error: 'المشترك غير موجود' }
    store.subscribers.splice(idx, 1)
    return { ok: true, mock: true }
  }
  const res = await sbDelete('newsletter_subscribers', id)
  return res.ok ? { ok: true, mock: false } : { ok: false, error: res.error }
}

export async function storeAddSubscriber(email: string, locale: Locale): Promise<{ ok: boolean; error?: string }> {
  if (!(await isSupabaseReady())) {
    const store = getStore()
    const existing = store.subscribers.find((s) => s.email === email)
    if (existing) {
      existing.active = true
      return { ok: true }
    }
    store.subscribers.push({ id: genId('sub'), email, locale, active: true, createdAt: new Date().toISOString() })
    return { ok: true }
  }
  const existing = await sbGet(`${SB_URL}/rest/v1/newsletter_subscribers?email=eq.${encodeURIComponent(email)}&select=id`)
  if (existing && existing.length > 0) {
    await sbUpdate('newsletter_subscribers', existing[0].id, { active: true, locale })
    return { ok: true }
  }
  const res = await sbInsert('newsletter_subscribers', [{
    id: genId('sub'), email, locale, active: true, created_at: new Date().toISOString(),
  }])
  return res.ok ? { ok: true } : { ok: false, error: res.error }
}

export async function storeGetSettings(): Promise<Record<string, string>> {
  if (!(await isSupabaseReady())) return { ...getStore().settings }
  const rows = await sbGet(`${SB_URL}/rest/v1/site_settings?select=*`)
  if (!rows || rows.length === 0) return { ...getStore().settings }
  const settings: Record<string, string> = {}
  for (const r of rows) settings[r.key] = r.value
  return settings
}

export async function storeSaveSettings(updates: Record<string, string>): Promise<{ ok: boolean; mock?: boolean }> {
  if (!(await isSupabaseReady())) {
    const store = getStore()
    store.settings = { ...store.settings, ...updates }
    return { ok: true, mock: true }
  }
  for (const [key, value] of Object.entries(updates)) {
    try {
      const res = await fetch(`${SB_URL}/rest/v1/site_settings?key=eq.${encodeURIComponent(key)}`, {
        method: 'PATCH',
        headers: headers({ Prefer: 'return=minimal' }),
        body: JSON.stringify({ key, value, updated_at: new Date().toISOString() }),
      })
      if (res.status === 404 || res.status === 200) {
        const check = await sbGet(`${SB_URL}/rest/v1/site_settings?key=eq.${encodeURIComponent(key)}&select=key`)
        if (!check || check.length === 0) {
          await sbInsert('site_settings', [{ key, value }])
        }
      }
    } catch {
      return { ok: false }
    }
  }
  return { ok: true, mock: false }
}



