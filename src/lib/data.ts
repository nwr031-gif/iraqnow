import { prisma } from '@/lib/prisma'
import { getStore } from '@/lib/memory-store'
import {
  MOCK_GOVERNORATES,
  type Locale, type MockArticle, type MockCategory, type MockAuthor, type MockPodcast, type MockComment,
} from '@/lib/mock-data'

/**
 * طبقة البيانات — تحاول Prisma أولاً مع fallback للبيانات التجريبية
 * Data layer with automatic fallback when the database is unavailable
 */

let dbAvailable: boolean | null = null
let lastCheck = 0

export async function isDbAvailable(): Promise<boolean> {
  const now = Date.now()
  if (dbAvailable !== null && now - lastCheck < 30_000) return dbAvailable

  lastCheck = now
  try {
    await prisma.$queryRaw`SELECT 1`
    dbAvailable = true
  } catch {
    dbAvailable = false
  }
  return dbAvailable
}

async function safeDb<T>(fn: () => Promise<T>, fallback: () => T | Promise<T>): Promise<T> {
  if (!(await isDbAvailable())) return fallback()
  try {
    return await fn()
  } catch {
    dbAvailable = false
    return fallback()
  }
}

/* ═══════════ الأقسام ═══════════ */

export async function getCategories(): Promise<MockCategory[]> {
  return safeDb(
    async () => {
      const cats = await prisma.category.findMany({
        where: { isActive: true },
        include: { translations: true, _count: { select: { articles: true } } },
        orderBy: { order: 'asc' },
      })
      return cats.map((c) => ({
        id: c.id,
        slug: c.slug,
        order: c.order,
        articleCount: c._count.articles,
        translations: c.translations.map((t) => ({ locale: t.locale as Locale, name: t.name, description: t.description || '' })),
      }))
    },
    () => getStore().categories
  )
}

export async function getCategoryBySlug(slug: string): Promise<MockCategory | null> {
  return safeDb(
    async () => {
      const c = await prisma.category.findUnique({
        where: { slug },
        include: { translations: true, _count: { select: { articles: true } } },
      })
      if (!c) return null
      return {
        id: c.id,
        slug: c.slug,
        order: c.order,
        articleCount: c._count.articles,
        translations: c.translations.map((t) => ({ locale: t.locale as Locale, name: t.name, description: t.description || '' })),
      }
    },
    () => getStore().categories.find((c) => c.slug === slug) || null
  )
}

/* ═══════════ المقالات ═══════════ */

export interface ArticleQuery {
  categorySlug?: string
  authorId?: string
  tagSlug?: string
  governorateSlug?: string
  status?: string[]
  page?: number
  limit?: number
  sort?: 'latest' | 'views'
  excludeId?: string
}

function toMockArticle(a: any): MockArticle {
  return {
    id: a.id,
    slug: a.slug,
    status: a.status,
    breaking: a.breaking,
    featured: a.featured,
    publishedAt: a.publishedAt?.toISOString?.() || a.publishedAt || '',
    createdAt: a.createdAt?.toISOString?.() || a.createdAt || '',
    updatedAt: a.updatedAt?.toISOString?.() || a.updatedAt || '',
    viewCount: a.viewCount || 0,
    readingTime: a.readingTime || 5,
    authorId: a.authorId || a.author?.id || '',
    categorySlug: a.category?.slug || a.categorySlug || '',
    tagSlugs: (a.tags || []).map((t: any) => t.tag?.slug || t.slug || t),
    governorateSlug: a.locations?.[0]?.governorate?.code || a.governorateSlug || '',
    image: a.media?.[0]?.media?.url || a.image || '',
    translations: (a.translations || a.mockTranslations || []).map((t: any) => ({
      locale: t.locale,
      title: t.title,
      excerpt: t.excerpt,
      content: t.content,
    })),
  }
}

function filterMockArticles(query: ArticleQuery): MockArticle[] {
  let articles = getStore().articles.filter((a) => a.status === 'PUBLISHED')
  if (query.categorySlug) articles = articles.filter((a) => a.categorySlug === query.categorySlug)
  if (query.authorId) articles = articles.filter((a) => a.authorId === query.authorId)
  if (query.governorateSlug) articles = articles.filter((a) => a.governorateSlug === query.governorateSlug)
  if (query.tagSlug) articles = articles.filter((a) => a.tagSlugs.includes(query.tagSlug!))
  if (query.excludeId) articles = articles.filter((a) => a.id !== query.excludeId)
  if (query.sort === 'views') articles.sort((a, b) => b.viewCount - a.viewCount)
  else articles.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
  return articles
}

export async function getArticles(query: ArticleQuery = {}): Promise<{ articles: MockArticle[]; total: number; pages: number }> {
  const page = query.page || 1
  const limit = query.limit || 12

  return safeDb(
    async () => {
      const where: any = {
        status: query.status ? { in: query.status } : 'PUBLISHED',
      }
      if (query.categorySlug) where.category = { slug: query.categorySlug }
      if (query.authorId) where.authorId = query.authorId
      if (query.tagSlug) where.tags = { some: { tag: { slug: query.tagSlug } } }
      if (query.governorateSlug) where.locations = { some: { governorate: { code: query.governorateSlug } } }
      if (query.excludeId) where.id = { not: query.excludeId }

      const [articles, total] = await Promise.all([
        prisma.article.findMany({
          where,
          include: {
            translations: true,
            category: { include: { translations: true } },
            author: true,
            tags: { include: { tag: true } },
            media: { include: { media: true }, take: 1 },
            locations: { include: { governorate: true } },
          },
          orderBy: query.sort === 'views' ? { viewCount: 'desc' } : { publishedAt: 'desc' },
          skip: (page - 1) * limit,
          take: limit,
        }),
        prisma.article.count({ where }),
      ])
      return { articles: articles.map(toMockArticle), total, pages: Math.ceil(total / limit) }
    },
    () => {
      const filtered = filterMockArticles(query)
      const start = (page - 1) * limit
      return {
        articles: filtered.slice(start, start + limit),
        total: filtered.length,
        pages: Math.ceil(filtered.length / limit),
      }
    }
  )
}

export async function getArticleBySlug(slug: string): Promise<MockArticle | null> {
  return safeDb(
    async () => {
      const a = await prisma.article.findUnique({
        where: { slug },
        include: {
          translations: true,
          category: { include: { translations: true } },
          author: true,
          tags: { include: { tag: true } },
          media: { include: { media: true } },
          locations: { include: { governorate: true } },
        },
      })
      return a ? toMockArticle(a) : null
    },
    () => getStore().articles.find((a) => a.slug === slug) || null
  )
}

export async function getFeaturedArticles(limit = 5): Promise<MockArticle[]> {
  return safeDb(
    async () => {
      const articles = await prisma.article.findMany({
        where: { status: 'PUBLISHED', featured: true },
        include: {
          translations: true,
          category: { include: { translations: true } },
          author: true,
          media: { include: { media: true }, take: 1 },
          locations: { include: { governorate: true } },
        },
        orderBy: { publishedAt: 'desc' },
        take: limit,
      })
      return articles.map(toMockArticle)
    },
    () => getStore().articles.filter((a) => a.featured && a.status === 'PUBLISHED').slice(0, limit)
  )
}

/* ═══════════ المحررون ═══════════ */

export async function getAuthors(includeInactive = false): Promise<MockAuthor[]> {
  return safeDb(
    async () => {
      const users = await prisma.user.findMany({
        where: includeInactive ? { role: { in: ['ADMIN', 'EDITOR', 'JOURNALIST'] } } : { role: { in: ['ADMIN', 'EDITOR', 'JOURNALIST'] }, isActive: true },
        include: { _count: { select: { articles: true } } },
        orderBy: { createdAt: 'asc' },
      })
      return users.map((u) => ({
        id: u.id,
        name: u.name || 'محرر',
        slug: u.slug || u.id,
        email: u.email || '',
        role: u.role as MockAuthor['role'],
        avatar: u.avatar || undefined,
        coverImage: u.coverImage || undefined,
        jobTitle: { ar: u.jobTitle || '', ku: u.jobTitle || '', en: u.jobTitle || '' },
        bio: { ar: u.bio || '', ku: u.bio || '', en: u.bio || '' },
        twitter: u.twitter || undefined,
        linkedin: u.linkedin || undefined,
        instagram: u.instagram || undefined,
        website: u.website || undefined,
        specialties: u.specialties,
        staffSince: u.staffSince?.toISOString() || u.createdAt.toISOString(),
        isActive: u.isActive,
        articleCount: u._count.articles,
      }))
    },
    () => (includeInactive ? getStore().authors : getStore().authors.filter((a) => a.isActive))
  )
}

export async function getAuthorById(id: string): Promise<MockAuthor | null> {
  return safeDb(
    async () => {
      const u = await prisma.user.findFirst({
        where: { OR: [{ id }, { slug: id }] },
        include: { _count: { select: { articles: true } } },
      })
      if (!u) return null
      return {
        id: u.id,
        name: u.name || 'محرر',
        slug: u.slug || u.id,
        email: u.email || '',
        role: u.role as MockAuthor['role'],
        avatar: u.avatar || undefined,
        coverImage: u.coverImage || undefined,
        jobTitle: { ar: u.jobTitle || '', ku: u.jobTitle || '', en: u.jobTitle || '' },
        bio: { ar: u.bio || '', ku: u.bio || '', en: u.bio || '' },
        twitter: u.twitter || undefined,
        linkedin: u.linkedin || undefined,
        instagram: u.instagram || undefined,
        website: u.website || undefined,
        specialties: u.specialties,
        staffSince: u.staffSince?.toISOString() || u.createdAt.toISOString(),
        isActive: u.isActive,
        articleCount: u._count.articles,
      }
    },
    () => getStore().authors.find((a) => a.id === id || a.slug === id) || null
  )
}

/* ═══════════ البودكاست ═══════════ */

export async function getPodcasts(limit?: number): Promise<MockPodcast[]> {
  return safeDb(
    async () => {
      const episodes = await prisma.podcastEpisode.findMany({
        where: { isPublished: true },
        include: { translations: true },
        orderBy: { episodeNumber: 'desc' },
        take: limit,
      })
      return episodes.map((e) => ({
        id: e.id,
        slug: e.slug,
        episodeNumber: e.episodeNumber,
        season: e.season,
        duration: e.duration || '0:00',
        audioUrl: e.audioUrl,
        coverUrl: e.coverUrl || '',
        publishedAt: e.publishedAt.toISOString(),
        isPublished: e.isPublished,
        isFeatured: e.isFeatured,
        views: e.views,
        guest: {
          ar: e.translations.find((t) => t.locale === 'ar')?.guest || '',
          ku: e.translations.find((t) => t.locale === 'ku')?.guest || '',
          en: e.translations.find((t) => t.locale === 'en')?.guest || '',
        },
        translations: e.translations.map((t) => ({
          locale: t.locale as Locale,
          title: t.title,
          description: t.description || '',
          showNotes: t.showNotes || '',
        })),
      }))
    },
    () => (limit ? getStore().podcasts.slice(0, limit) : getStore().podcasts)
  )
}

export async function getPodcastBySlug(slug: string): Promise<MockPodcast | null> {
  return safeDb(
    async () => {
      const e = await prisma.podcastEpisode.findUnique({
        where: { slug },
        include: { translations: true },
      })
      if (!e) return null
      return {
        id: e.id,
        slug: e.slug,
        episodeNumber: e.episodeNumber,
        season: e.season,
        duration: e.duration || '0:00',
        audioUrl: e.audioUrl,
        coverUrl: e.coverUrl || '',
        publishedAt: e.publishedAt.toISOString(),
        isPublished: e.isPublished,
        isFeatured: e.isFeatured,
        views: e.views,
        guest: {
          ar: e.translations.find((t) => t.locale === 'ar')?.guest || '',
          ku: e.translations.find((t) => t.locale === 'ku')?.guest || '',
          en: e.translations.find((t) => t.locale === 'en')?.guest || '',
        },
        translations: e.translations.map((t) => ({
          locale: t.locale as Locale,
          title: t.title,
          description: t.description || '',
          showNotes: t.showNotes || '',
        })),
      }
    },
    () => getStore().podcasts.find((p) => p.slug === slug) || null
  )
}

/* ═══════════ لوحة التحكم ═══════════ */

export async function getAdminArticles(statusFilter?: string): Promise<MockArticle[]> {
  return safeDb(
    async () => {
      const where: any = {}
      if (statusFilter && statusFilter !== 'all') where.status = statusFilter
      const articles = await prisma.article.findMany({
        where,
        include: {
          translations: true,
          category: { include: { translations: true } },
          author: true,
          media: { include: { media: true }, take: 1 },
        },
        orderBy: { updatedAt: 'desc' },
        take: 100,
      })
      return articles.map(toMockArticle)
    },
    () => {
      const all = [...getStore().articles]
      if (!statusFilter || statusFilter === 'all') return all
      return all.filter((a) => a.status === statusFilter)
    }
  )
}

export async function getAdminStats() {
  return safeDb(
    async () => {
      const [articles, published, users, comments, pending, subscribers, podcasts] = await Promise.all([
        prisma.article.count(),
        prisma.article.count({ where: { status: 'PUBLISHED' } }),
        prisma.user.count(),
        prisma.comment.count(),
        prisma.comment.count({ where: { status: 'pending' } }),
        prisma.newsletter.count({ where: { active: true } }),
        prisma.podcastEpisode.count(),
      ])
      const views = await prisma.article.aggregate({ _sum: { viewCount: true } })
      return { articles, published, users, comments, pending, subscribers, podcasts, views: views._sum.viewCount || 0 }
    },
    () => {
      const store = getStore()
      const published = store.articles.filter((a) => a.status === 'PUBLISHED')
      return {
        articles: store.articles.length,
        published: published.length,
        users: store.authors.length,
        comments: store.comments.length,
        pending: store.comments.filter((c) => c.status === 'pending').length,
        subscribers: store.subscribers.filter((s) => s.active).length,
        podcasts: store.podcasts.length,
        views: published.reduce((sum, a) => sum + a.viewCount, 0),
      }
    }
  )
}

export async function getAdminComments(statusFilter?: string): Promise<MockComment[]> {
  return safeDb(
    async () => {
      const where: any = {}
      if (statusFilter && statusFilter !== 'all') where.status = statusFilter
      const comments = await prisma.comment.findMany({
        where,
        include: { user: true, article: { include: { translations: { where: { locale: 'ar' } } } } },
        orderBy: { createdAt: 'desc' },
        take: 100,
      })
      return comments.map((c) => ({
        id: c.id,
        articleId: c.articleId,
        articleTitle: c.article.translations[0]?.title || '',
        userId: c.userId,
        userName: c.user.name || 'زائر',
        content: c.content,
        status: c.status as MockComment['status'],
        createdAt: c.createdAt.toISOString(),
      }))
    },
    () => {
      if (!statusFilter || statusFilter === 'all') return getStore().comments
      return getStore().comments.filter((c) => c.status === statusFilter)
    }
  )
}

export async function getSubscribers() {
  return safeDb(
    async () => {
      const subs = await prisma.newsletter.findMany({ orderBy: { createdAt: 'desc' }, take: 200 })
      return subs.map((s) => ({ id: s.id, email: s.email, locale: s.locale as Locale, active: s.active, createdAt: s.createdAt.toISOString() }))
    },
    () => getStore().subscribers
  )
}

export { MOCK_GOVERNORATES }

