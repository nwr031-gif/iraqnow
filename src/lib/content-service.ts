/**
 * خدمة المحتوى — الكتابة/التعديل/الحذف
 * سلسلة التخزين: Prisma (قاعدة بيانات حقيقية) ← Supabase REST ← الذاكرة
 */

import { getPrisma } from '@/lib/prisma'
import { isDbAvailable } from '@/lib/data'
import * as store from '@/lib/supabase-store'
import type { MockAuthor, MockArticle, MockComment, MockPodcast } from '@/lib/mock-data'

type Locale = 'ar' | 'ku' | 'en'

async function useDb(): Promise<boolean> {
  return isDbAvailable()
}

/* ═══════════ Articles ═══════════ */

export async function createArticle(data: {
  translations: { locale: Locale; title: string; excerpt: string; content: string; seoTitle?: string; seoDesc?: string }[]
  categorySlug: string
  authorId: string
  status?: string
  breaking?: boolean
  featured?: boolean
  image?: string
  gallery?: string[]
  governorateSlug?: string
  tagSlugs?: string[]
  readingTime?: number
  scheduledAt?: string
}): Promise<{ ok: boolean; id?: string; error?: string; mock?: boolean }> {
  const ar = data.translations.find((t) => t.locale === 'ar')
  if (!ar?.title) return { ok: false, error: 'العنوان العربي مطلوب' }

  if (!(await useDb())) {
    return store.storeCreateArticle({
      status: data.status as MockArticle['status'] | undefined,
      breaking: data.breaking,
      featured: data.featured,
      authorId: data.authorId,
      categorySlug: data.categorySlug,
      governorateSlug: data.governorateSlug,
      tagSlugs: data.tagSlugs,
      image: data.image,
      gallery: data.gallery,
      readingTime: data.readingTime || Math.max(2, Math.ceil(ar.content.split(/\s+/).length / 200)),
      translations: data.translations.map((t) => ({
        locale: t.locale, title: t.title, excerpt: t.excerpt, content: t.content,
      })),
    })
  }

  try {
    const db = await getPrisma()
    if (!db) return { ok: false, error: 'قاعدة البيانات غير متاحة' }
    const category = await db.category.findUnique({ where: { slug: data.categorySlug } })
    if (!category) return { ok: false, error: 'القسم غير موجود' }

    const slug = `${ar.title.slice(0, 40).trim().replace(/\s+/g, '-').replace(/[^\w\u0600-\u06FF-]/g, '')}-${Date.now().toString(36)}`
    const article = await db.article.create({
      data: {
        slug,
        status: (data.status as any) || 'DRAFT',
        breaking: data.breaking || false,
        featured: data.featured || false,
        authorId: data.authorId,
        categoryId: category.id,
        readingTime: data.readingTime || Math.max(2, Math.ceil(ar.content.split(/\s+/).length / 200)),
        publishedAt: data.status === 'PUBLISHED' ? new Date() : data.scheduledAt ? new Date(data.scheduledAt) : null,
        translations: {
          create: data.translations.map((t) => ({
            locale: t.locale as any,
            title: t.title,
            excerpt: t.excerpt,
            content: t.content,
            seoTitle: t.seoTitle || t.title,
            seoDesc: t.seoDesc || t.excerpt,
            seoKeywords: [],
          })),
        },
      },
    })
    return { ok: true, id: article.id }
  } catch (e: any) {
    return { ok: false, error: e.message }
  }
}

export async function updateArticleStatus(id: string, status: string): Promise<{ ok: boolean; error?: string; mock?: boolean }> {
  if (!(await useDb())) {
    return store.storeUpdateArticle(id, { status: status as MockArticle['status'] })
  }
  try {
    const db = await getPrisma()
    if (!db) return { ok: false, error: 'قاعدة البيانات غير متاحة' }
    await db.article.update({
      where: { id },
      data: { status: status as any, ...(status === 'PUBLISHED' ? { publishedAt: new Date() } : {}) },
    })
    return { ok: true }
  } catch (e: any) {
    return { ok: false, error: e.message }
  }
}

export async function updateArticleFull(id: string, data: Partial<MockArticle>): Promise<{ ok: boolean; error?: string; mock?: boolean }> {
  if (!(await useDb())) {
    return store.storeUpdateArticle(id, data)
  }
  try {
    const db = await getPrisma()
    if (!db) return { ok: false, error: 'قاعدة البيانات غير متاحة' }
    const ar = data.translations?.find((t) => t.locale === 'ar')
    await db.article.update({
      where: { id },
      data: {
        ...(data.status ? { status: data.status as any } : {}),
        ...(data.breaking !== undefined ? { breaking: data.breaking } : {}),
        ...(data.featured !== undefined ? { featured: data.featured } : {}),
        ...(data.slug ? { slug: data.slug } : {}),
      },
    })
    if (ar) {
      await db.articleTranslation.updateMany({
        where: { articleId: id, locale: 'ar' },
        data: { title: ar.title, excerpt: ar.excerpt, content: ar.content },
      })
    }
    return { ok: true }
  } catch (e: any) {
    return { ok: false, error: e.message }
  }
}

export async function deleteArticle(id: string): Promise<{ ok: boolean; error?: string; mock?: boolean }> {
  if (!(await useDb())) {
    return store.storeDeleteArticle(id)
  }
  try {
    const db = await getPrisma()
    if (!db) return { ok: false, error: 'قاعدة البيانات غير متاحة' }
    await db.article.delete({ where: { id } })
    return { ok: true }
  } catch (e: any) {
    return { ok: false, error: e.message }
  }
}

/* ═══════════ Users / Editors ═══════════ */

export async function createEditor(data: {
  name: string
  email: string
  password: string
  role: 'JOURNALIST' | 'EDITOR' | 'ADMIN'
  jobTitle?: string
  bio?: string
}): Promise<{ ok: boolean; id?: string; error?: string; mock?: boolean }> {
  if (!data.name || !data.email || !data.password) {
    return { ok: false, error: 'الاسم والبريد وكلمة المرور مطلوبة' }
  }
  if (data.password.length < 6) {
    return { ok: false, error: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' }
  }

  if (!(await useDb())) {
    return store.storeCreateEditor(data)
  }

  try {
    const db = await getPrisma()
    if (!db) return { ok: false, error: 'قاعدة البيانات غير متاحة' }
    const { hash } = await import('bcryptjs')
    const existing = await db.user.findUnique({ where: { email: data.email } })
    if (existing) return { ok: false, error: 'البريد الإلكتروني مستخدم مسبقاً' }

    const passwordHash = await hash(data.password, 12)
    const slug = data.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\u0600-\u06FF-]/g, '') || undefined
    const user = await db.user.create({
      data: {
        name: data.name, email: data.email, passwordHash, role: data.role as any,
        slug, jobTitle: data.jobTitle, bio: data.bio, staffSince: new Date(),
      },
    })
    return { ok: true, id: user.id }
  } catch (e: any) {
    return { ok: false, error: e.message }
  }
}

export async function updateUser(id: string, data: Partial<MockAuthor> & { password?: string }): Promise<{ ok: boolean; error?: string; mock?: boolean }> {
  if (!(await useDb())) {
    return store.storeUpdateUser(id, data)
  }
  try {
    const db = await getPrisma()
    if (!db) return { ok: false, error: 'قاعدة البيانات غير متاحة' }
    const { password, ...rest } = data
    await db.user.update({
      where: { id },
      data: {
        ...(rest.name ? { name: rest.name } : {}),
        ...(rest.role ? { role: rest.role as any } : {}),
        ...(rest.isActive !== undefined ? { isActive: rest.isActive } : {}),
        ...(rest.jobTitle ? { jobTitle: rest.jobTitle.ar || rest.jobTitle.en } : {}),
        ...(rest.bio ? { bio: rest.bio.ar || rest.bio.en } : {}),
        ...(rest.avatar !== undefined ? { avatar: rest.avatar } : {}),
        ...(rest.coverImage !== undefined ? { coverImage: rest.coverImage } : {}),
        ...(rest.twitter !== undefined ? { twitter: rest.twitter } : {}),
        ...(rest.linkedin !== undefined ? { linkedin: rest.linkedin } : {}),
        ...(rest.instagram !== undefined ? { instagram: rest.instagram } : {}),
        ...(rest.website !== undefined ? { website: rest.website } : {}),
        ...(rest.specialties ? { specialties: rest.specialties } : {}),
        ...(password ? { passwordHash: await (await import('bcryptjs')).hash(password, 12) } : {}),
      },
    })
    return { ok: true }
  } catch (e: any) {
    return { ok: false, error: e.message }
  }
}

export async function deleteUser(id: string): Promise<{ ok: boolean; error?: string; mock?: boolean }> {
  if (!(await useDb())) {
    return store.storeDeleteUser(id)
  }
  try {
    const db = await getPrisma()
    if (!db) return { ok: false, error: 'قاعدة البيانات غير متاحة' }
    await db.user.delete({ where: { id } })
    return { ok: true }
  } catch (e: any) {
    return { ok: false, error: e.message }
  }
}

/* ═══════════ Comments ═══════════ */

export async function moderateComment(id: string, status: MockComment['status']): Promise<{ ok: boolean; error?: string; mock?: boolean }> {
  if (!(await useDb())) {
    return store.storeModerateComment(id, status)
  }
  try {
    const db = await getPrisma()
    if (!db) return { ok: false, error: 'قاعدة البيانات غير متاحة' }
    await db.comment.update({ where: { id }, data: { status } })
    return { ok: true }
  } catch (e: any) {
    return { ok: false, error: e.message }
  }
}

export async function removeComment(id: string): Promise<{ ok: boolean; error?: string; mock?: boolean }> {
  if (!(await useDb())) {
    return store.storeDeleteComment(id)
  }
  try {
    const db = await getPrisma()
    if (!db) return { ok: false, error: 'قاعدة البيانات غير متاحة' }
    await db.comment.delete({ where: { id } })
    return { ok: true }
  } catch (e: any) {
    return { ok: false, error: e.message }
  }
}

/* ═══════════ Categories ═══════════ */

export async function createCategory(data: {
  slug: string
  translations: { locale: Locale; name: string; description?: string }[]
}): Promise<{ ok: boolean; id?: string; error?: string; mock?: boolean }> {
  if (!data.slug || !data.translations.find((t) => t.locale === 'ar')?.name) {
    return { ok: false, error: 'المعرف والاسم العربي مطلوبان' }
  }
  if (!(await useDb())) {
    return store.storeCreateCategory(data)
  }
  try {
    const db = await getPrisma()
    if (!db) return { ok: false, error: 'قاعدة البيانات غير متاحة' }
    const cat = await db.category.create({
      data: {
        slug: data.slug,
        translations: {
          create: data.translations.map((t) => ({ locale: t.locale as any, name: t.name, description: t.description })),
        },
      },
    })
    return { ok: true, id: cat.id }
  } catch (e: any) {
    return { ok: false, error: e.message }
  }
}

export async function updateCategoryFull(id: string, data: { slug?: string; translations?: { locale: Locale; name: string; description?: string }[] }): Promise<{ ok: boolean; error?: string; mock?: boolean }> {
  if (!(await useDb())) {
    return store.storeUpdateCategory(id, data)
  }
  try {
    const db = await getPrisma()
    if (!db) return { ok: false, error: 'قاعدة البيانات غير متاحة' }
    if (data.slug) await db.category.update({ where: { id }, data: { slug: data.slug } })
    if (data.translations) {
      for (const t of data.translations) {
        await db.categoryTranslation.upsert({
          where: { categoryId_locale: { categoryId: id, locale: t.locale as any } },
          update: { name: t.name, description: t.description },
          create: { categoryId: id, locale: t.locale as any, name: t.name, description: t.description },
        })
      }
    }
    return { ok: true }
  } catch (e: any) {
    return { ok: false, error: e.message }
  }
}

export async function removeCategory(id: string): Promise<{ ok: boolean; error?: string; mock?: boolean }> {
  if (!(await useDb())) {
    return store.storeDeleteCategory(id)
  }
  try {
    const db = await getPrisma()
    if (!db) return { ok: false, error: 'قاعدة البيانات غير متاحة' }
    await db.category.delete({ where: { id } })
    return { ok: true }
  } catch {
    return { ok: false, error: 'لا يمكن حذف قسم يحتوي على مقالات' }
  }
}

/* ═══════════ Podcasts ═══════════ */

export async function createPodcastEpisode(data: Partial<MockPodcast>): Promise<{ ok: boolean; id?: string; error?: string; mock?: boolean }> {
  const ar = data.translations?.find((t) => t.locale === 'ar')
  if (!ar?.title) return { ok: false, error: 'العنوان العربي مطلوب' }

  if (!(await useDb())) {
    return store.storeCreatePodcast(data)
  }
  try {
    const db = await getPrisma()
    if (!db) return { ok: false, error: 'قاعدة البيانات غير متاحة' }
    const slug = `episode-${data.episodeNumber || Date.now().toString(36)}`
    const ep = await db.podcastEpisode.create({
      data: {
        slug,
        episodeNumber: data.episodeNumber || 1,
        season: data.season || 3,
        duration: data.duration || '0:00',
        audioUrl: data.audioUrl || '',
        coverUrl: data.coverUrl,
        isPublished: data.isPublished ?? true,
        isFeatured: data.isFeatured || false,
        translations: {
          create: (data.translations || []).map((t) => ({
            locale: t.locale as any,
            title: t.title,
            description: t.description,
            guest: data.guest?.[t.locale as Locale] || '',
            showNotes: t.showNotes,
          })),
        },
      },
    })
    return { ok: true, id: ep.id }
  } catch (e: any) {
    return { ok: false, error: e.message }
  }
}

export async function updatePodcastFull(id: string, data: Partial<MockPodcast>): Promise<{ ok: boolean; error?: string; mock?: boolean }> {
  if (!(await useDb())) {
    return store.storeUpdatePodcast(id, data)
  }
  try {
    const db = await getPrisma()
    if (!db) return { ok: false, error: 'قاعدة البيانات غير متاحة' }
    await db.podcastEpisode.update({
      where: { id },
      data: {
        ...(data.episodeNumber ? { episodeNumber: data.episodeNumber } : {}),
        ...(data.duration ? { duration: data.duration } : {}),
        ...(data.audioUrl ? { audioUrl: data.audioUrl } : {}),
        ...(data.isPublished !== undefined ? { isPublished: data.isPublished } : {}),
        ...(data.isFeatured !== undefined ? { isFeatured: data.isFeatured } : {}),
      },
    })
    return { ok: true }
  } catch (e: any) {
    return { ok: false, error: e.message }
  }
}

export async function removePodcast(id: string): Promise<{ ok: boolean; error?: string; mock?: boolean }> {
  if (!(await useDb())) {
    return store.storeDeletePodcast(id)
  }
  try {
    const db = await getPrisma()
    if (!db) return { ok: false, error: 'قاعدة البيانات غير متاحة' }
    await db.podcastEpisode.delete({ where: { id } })
    return { ok: true }
  } catch (e: any) {
    return { ok: false, error: e.message }
  }
}

/* ═══════════ Newsletter ═══════════ */

export async function removeSubscriber(id: string): Promise<{ ok: boolean; error?: string; mock?: boolean }> {
  if (!(await useDb())) {
    return store.storeDeleteSubscriber(id)
  }
  try {
    const db = await getPrisma()
    if (!db) return { ok: false, error: 'قاعدة البيانات غير متاحة' }
    await db.newsletter.delete({ where: { id } })
    return { ok: true }
  } catch (e: any) {
    return { ok: false, error: e.message }
  }
}

/* ═══════════ Settings ═══════════ */

export async function saveSettings(updates: Record<string, string>): Promise<{ ok: boolean; mock?: boolean }> {
  if (!(await useDb())) {
    return store.storeSaveSettings(updates)
  }
  try {
    const db = await getPrisma()
    if (!db) return { ok: false }
    for (const [key, value] of Object.entries(updates)) {
      await db.siteSetting.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      })
    }
    return { ok: true }
  } catch {
    return store.storeSaveSettings(updates)
  }
}

export async function loadSettings(): Promise<Record<string, string>> {
  if (await useDb()) {
    try {
      const db = await getPrisma()
      if (db) {
        const rows = await db.siteSetting.findMany()
        const settings: Record<string, string> = {}
        for (const r of rows) settings[r.key] = r.value
        return settings
      }
    } catch { /* fallback */ }
  }
  return store.storeGetSettings()
}
