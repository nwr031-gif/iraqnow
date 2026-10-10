/**
 * مخزن الذاكرة — يسمح للوحة التحكم بالعمل بالكامل حتى بدون قاعدة بيانات
 * In-memory store for demo mode (when DB is unavailable)
 */

import {
  MOCK_AUTHORS, MOCK_ARTICLES, MOCK_DRAFTS, MOCK_CATEGORIES, MOCK_PODCASTS,
  MOCK_COMMENTS, MOCK_SUBSCRIBERS,
  type MockAuthor, type MockArticle, type MockCategory, type MockPodcast, type MockComment,
} from '@/lib/mock-data'

interface MemoryState {
  authors: MockAuthor[]
  articles: MockArticle[]
  categories: MockCategory[]
  podcasts: MockPodcast[]
  comments: MockComment[]
  subscribers: typeof MOCK_SUBSCRIBERS
  settings: Record<string, string>
}

const globalStore = globalThis as unknown as { __iraqnowStore?: MemoryState }

function createInitialState(): MemoryState {
  return {
    authors: JSON.parse(JSON.stringify(MOCK_AUTHORS)),
    articles: JSON.parse(JSON.stringify([...MOCK_DRAFTS, ...MOCK_ARTICLES])),
    categories: JSON.parse(JSON.stringify(MOCK_CATEGORIES)),
    podcasts: JSON.parse(JSON.stringify(MOCK_PODCASTS)),
    comments: JSON.parse(JSON.stringify(MOCK_COMMENTS)),
    subscribers: JSON.parse(JSON.stringify(MOCK_SUBSCRIBERS)),
    settings: {
      siteName: 'العراق الآن',
      siteNameEn: 'Iraq Now',
      tagline: 'صوت العراق الحقيقي',
      description: 'منصة إخبارية عراقية مستقلة متعددة اللغات',
      contactEmail: 'info@iraqnow.iq',
      twitter: 'iraqnow',
      facebook: 'iraqnow',
      instagram: 'iraqnow',
      youtube: 'iraqnow',
      telegram: 'iraqnow',
      breakingEnabled: 'true',
      newsletterEnabled: 'true',
      maintenanceMode: 'false',
    },
  }
}

export function getStore(): MemoryState {
  if (!globalStore.__iraqnowStore) {
    globalStore.__iraqnowStore = createInitialState()
  }
  return globalStore.__iraqnowStore
}

export function genId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`
}

/* ───── Authors / Users ───── */

export function createAuthor(data: {
  name: string
  email: string
  role: MockAuthor['role']
  jobTitle?: string
  bio?: string
  avatar?: string
  password?: string
}): MockAuthor {
  const store = getStore()
  const slug = data.name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\u0600-\u06FF-]/g, '')
  const author: MockAuthor = {
    id: genId('user'),
    name: data.name,
    slug: slug || genId('author'),
    email: data.email,
    role: data.role,
    avatar: data.avatar || `https://i.pravatar.cc/300?u=${encodeURIComponent(data.email)}`,
    jobTitle: { ar: data.jobTitle || '', ku: data.jobTitle || '', en: data.jobTitle || '' },
    bio: { ar: data.bio || '', ku: data.bio || '', en: data.bio || '' },
    specialties: [],
    staffSince: new Date().toISOString(),
    isActive: true,
    articleCount: 0,
  }
  store.authors.push(author)
  return author
}

export function updateAuthor(id: string, updates: Partial<MockAuthor>): MockAuthor | null {
  const store = getStore()
  const idx = store.authors.findIndex((a) => a.id === id)
  if (idx === -1) return null
  store.authors[idx] = { ...store.authors[idx], ...updates }
  return store.authors[idx]
}

export function deleteAuthor(id: string): boolean {
  const store = getStore()
  const idx = store.authors.findIndex((a) => a.id === id)
  if (idx === -1) return false
  store.authors.splice(idx, 1)
  return true
}

/* ───── Articles ───── */

export function createArticle(data: Partial<MockArticle>): MockArticle {
  const store = getStore()
  const now = new Date().toISOString()
  const article: MockArticle = {
    id: genId('article'),
    slug: data.slug || genId('story'),
    status: data.status || 'DRAFT',
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
    translations: data.translations || [
      { locale: 'ar', title: '', excerpt: '', content: '' },
      { locale: 'ku', title: '', excerpt: '', content: '' },
      { locale: 'en', title: '', excerpt: '', content: '' },
    ],
  }
  store.articles.unshift(article)
  return article
}

export function updateArticle(id: string, updates: Partial<MockArticle>): MockArticle | null {
  const store = getStore()
  const idx = store.articles.findIndex((a) => a.id === id)
  if (idx === -1) return null
  const existing = store.articles[idx]
  const updated = { ...existing, ...updates, updatedAt: new Date().toISOString() }
  if (updates.status === 'PUBLISHED' && !existing.publishedAt) {
    updated.publishedAt = new Date().toISOString()
  }
  store.articles[idx] = updated
  return updated
}

export function deleteArticle(id: string): boolean {
  const store = getStore()
  const idx = store.articles.findIndex((a) => a.id === id)
  if (idx === -1) return false
  store.articles.splice(idx, 1)
  return true
}

/* ───── Categories ───── */

export function createCategory(data: { slug: string; translations: MockCategory['translations'] }): MockCategory {
  const store = getStore()
  const cat: MockCategory = {
    id: genId('cat'),
    slug: data.slug,
    order: store.categories.length + 1,
    articleCount: 0,
    translations: data.translations,
  }
  store.categories.push(cat)
  return cat
}

export function updateCategory(id: string, updates: Partial<MockCategory>): MockCategory | null {
  const store = getStore()
  const idx = store.categories.findIndex((c) => c.id === id)
  if (idx === -1) return null
  store.categories[idx] = { ...store.categories[idx], ...updates }
  return store.categories[idx]
}

export function deleteCategory(id: string): boolean {
  const store = getStore()
  const idx = store.categories.findIndex((c) => c.id === id)
  if (idx === -1) return false
  store.categories.splice(idx, 1)
  return true
}

/* ───── Podcasts ───── */

export function createPodcast(data: Partial<MockPodcast>): MockPodcast {
  const store = getStore()
  const maxEp = Math.max(0, ...store.podcasts.map((p) => p.episodeNumber))
  const podcast: MockPodcast = {
    id: genId('pod'),
    slug: data.slug || genId('episode'),
    episodeNumber: data.episodeNumber || maxEp + 1,
    season: data.season || 3,
    duration: data.duration || '0:00',
    audioUrl: data.audioUrl || '',
    coverUrl: data.coverUrl || `https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=600&fit=crop&q=80'cover')}/600/600`,
    publishedAt: new Date().toISOString(),
    isPublished: data.isPublished ?? true,
    isFeatured: data.isFeatured || false,
    views: 0,
    guest: data.guest || { ar: '', ku: '', en: '' },
    translations: data.translations || [
      { locale: 'ar', title: '', description: '', showNotes: '' },
      { locale: 'ku', title: '', description: '', showNotes: '' },
      { locale: 'en', title: '', description: '', showNotes: '' },
    ],
  }
  store.podcasts.unshift(podcast)
  return podcast
}

export function updatePodcast(id: string, updates: Partial<MockPodcast>): MockPodcast | null {
  const store = getStore()
  const idx = store.podcasts.findIndex((p) => p.id === id)
  if (idx === -1) return null
  store.podcasts[idx] = { ...store.podcasts[idx], ...updates }
  return store.podcasts[idx]
}

export function deletePodcast(id: string): boolean {
  const store = getStore()
  const idx = store.podcasts.findIndex((p) => p.id === id)
  if (idx === -1) return false
  store.podcasts.splice(idx, 1)
  return true
}

/* ───── Comments ───── */

export function updateComment(id: string, status: MockComment['status']): MockComment | null {
  const store = getStore()
  const comment = store.comments.find((c) => c.id === id)
  if (!comment) return null
  comment.status = status
  return comment
}

export function deleteComment(id: string): boolean {
  const store = getStore()
  const idx = store.comments.findIndex((c) => c.id === id)
  if (idx === -1) return false
  store.comments.splice(idx, 1)
  return true
}

/* ───── Subscribers ───── */

export function deleteSubscriber(id: string): boolean {
  const store = getStore()
  const idx = store.subscribers.findIndex((s) => s.id === id)
  if (idx === -1) return false
  store.subscribers.splice(idx, 1)
  return true
}

/* ───── Settings ───── */

export function getSettings(): Record<string, string> {
  return { ...getStore().settings }
}

export function updateSettings(updates: Record<string, string>): Record<string, string> {
  const store = getStore()
  store.settings = { ...store.settings, ...updates }
  return store.settings
}
