import { getPrisma } from '@/lib/prisma'
import { isDbAvailable } from '@/lib/data'
import * as mem from '@/lib/memory-store'
import { hash } from 'bcryptjs'
import type { MockAuthor, MockArticle, MockComment, MockPodcast } from '@/lib/mock-data'

/**
 * خدمة المحتوى — كتابة/تعديل/حذف مع دعم قاعدة البيانات أو مخزن الذاكرة
 * Content service handling both Prisma and in-memory modes
 */

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
  governorateSlug?: string
  tagSlugs?: string[]
  readingTime?: number
  scheduledAt?: string
}): Promise<{ ok: boolean; id?: string; error?: string; mock?: boolean }> {
  const ar = data.translations.find((t) => t.locale === 'ar')
  if (!ar?.title) return { ok: false, error: 'العنوان العربي مطلوب' }

  const slug = `${ar.title.slice(0, 40).trim().replace(/\s+/g, '-').replace(/[^\w\u0600-\u06FF-]/g, '')}-${Date.now().toString(36)}`

  if (!(await useDb())) {
    try {
      const created = mem.createArticle({
        slug,
        status: (data.status as MockArticle['status']) || 'DRAFT',
        breaking: data.breaking || false,
        featured: data.featured || false,
        authorId: data.authorId,
        categorySlug: data.categorySlug,
        governorateSlug: data.governorateSlug || 'baghdad',
        tagSlugs: data.tagSlugs || [],
        image: data.image || '',
        readingTime: data.readingTime || Math.max(2, Math.ceil(ar.content.split(/\s+/).length / 200)),
        translations: data.translations.map((t) => ({
          locale: t.locale,
          title: t.title,
          excerpt: t.excerpt,
          content: t.content,
        })),
      })
      return { ok: true, id: created.id, mock: true }
    } catch (e: any) {
      return { ok: false, error: e.message }
    }
  }

  try {
    const category = await (await getPrisma()).category.findUnique({ where: { slug: data.categorySlug } })
    if (!category) return { ok: false, error: 'القسم غير موجود' }

    const article = await (await getPrisma()).article.create({
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
    const updated = mem.updateArticle(id, { status: status as MockArticle['status'] })
    return updated ? { ok: true, mock: true } : { ok: false, error: 'المقال غير موجود' }
  }
  try {
    await (await getPrisma()).article.update({
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
    const updated = mem.updateArticle(id, data)
    return updated ? { ok: true, mock: true } : { ok: false, error: 'المقال غير موجود' }
  }
  try {
    const ar = data.translations?.find((t) => t.locale === 'ar')
    await (await getPrisma()).article.update({
      where: { id },
      data: {
        ...(data.status ? { status: data.status as any } : {}),
        ...(data.breaking !== undefined ? { breaking: data.breaking } : {}),
        ...(data.featured !== undefined ? { featured: data.featured } : {}),
        ...(data.slug ? { slug: data.slug } : {}),
        ...(ar ? { title: ar.title, excerpt: ar.excerpt, content: ar.content } : {}),
      },
    })
    return { ok: true }
  } catch (e: any) {
    return { ok: false, error: e.message }
  }
}

export async function deleteArticle(id: string): Promise<{ ok: boolean; error?: string; mock?: boolean }> {
  if (!(await useDb())) {
    return mem.deleteArticle(id) ? { ok: true, mock: true } : { ok: false, error: 'المقال غير موجود' }
  }
  try {
    await (await getPrisma()).article.delete({ where: { id } })
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
    const existing = mem.getStore().authors.find((a) => a.email === data.email)
    if (existing) return { ok: false, error: 'البريد الإلكتروني مستخدم مسبقاً' }
    const author = mem.createAuthor({
      name: data.name,
      email: data.email,
      role: data.role,
      jobTitle: data.jobTitle,
      bio: data.bio,
    })
    return { ok: true, id: author.id, mock: true }
  }

  try {
    const existing = await (await getPrisma()).user.findUnique({ where: { email: data.email } })
    if (existing) return { ok: false, error: 'البريد الإلكتروني مستخدم مسبقاً' }

    const passwordHash = await hash(data.password, 12)
    const slug = data.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\u0600-\u06FF-]/g, '') || undefined

    const user = await (await getPrisma()).user.create({
      data: {
        name: data.name,
        email: data.email,
        passwordHash,
        role: data.role as any,
        slug,
        jobTitle: data.jobTitle,
        bio: data.bio,
        staffSince: new Date(),
      },
    })
    return { ok: true, id: user.id }
  } catch (e: any) {
    return { ok: false, error: e.message }
  }
}

export async function updateUser(id: string, data: Partial<MockAuthor> & { password?: string }): Promise<{ ok: boolean; error?: string; mock?: boolean }> {
  if (!(await useDb())) {
    const { password, ...rest } = data
    const updated = mem.updateAuthor(id, rest)
    return updated ? { ok: true, mock: true } : { ok: false, error: 'المستخدم غير موجود' }
  }
  try {
    const { password, ...rest } = data
    await (await getPrisma()).user.update({
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
        ...(password ? { passwordHash: await hash(password, 12) } : {}),
      },
    })
    return { ok: true }
  } catch (e: any) {
    return { ok: false, error: e.message }
  }
}

export async function deleteUser(id: string): Promise<{ ok: boolean; error?: string; mock?: boolean }> {
  if (!(await useDb())) {
    return mem.deleteAuthor(id) ? { ok: true, mock: true } : { ok: false, error: 'المستخدم غير موجود' }
  }
  try {
    await (await getPrisma()).user.delete({ where: { id } })
    return { ok: true }
  } catch (e: any) {
    return { ok: false, error: e.message }
  }
}

/* ═══════════ Comments ═══════════ */

export async function moderateComment(id: string, status: MockComment['status']): Promise<{ ok: boolean; error?: string; mock?: boolean }> {
  if (!(await useDb())) {
    const updated = mem.updateComment(id, status)
    return updated ? { ok: true, mock: true } : { ok: false, error: 'التعليق غير موجود' }
  }
  try {
    await (await getPrisma()).comment.update({ where: { id }, data: { status } })
    return { ok: true }
  } catch (e: any) {
    return { ok: false, error: e.message }
  }
}

export async function removeComment(id: string): Promise<{ ok: boolean; error?: string; mock?: boolean }> {
  if (!(await useDb())) {
    return mem.deleteComment(id) ? { ok: true, mock: true } : { ok: false, error: 'التعليق غير موجود' }
  }
  try {
    await (await getPrisma()).comment.delete({ where: { id } })
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
    const existing = mem.getStore().categories.find((c) => c.slug === data.slug)
    if (existing) return { ok: false, error: 'معرف القسم مستخدم مسبقاً' }
    const cat = mem.createCategory({
      slug: data.slug,
      translations: data.translations.map((t) => ({ locale: t.locale, name: t.name, description: t.description || '' })),
    })
    return { ok: true, id: cat.id, mock: true }
  }
  try {
    const cat = await (await getPrisma()).category.create({
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
    const updated = mem.updateCategory(id, {
      ...(data.slug ? { slug: data.slug } : {}),
      ...(data.translations ? { translations: data.translations.map((t) => ({ locale: t.locale, name: t.name, description: t.description || '' })) } : {}),
    })
    return updated ? { ok: true, mock: true } : { ok: false, error: 'القسم غير موجود' }
  }
  try {
    if (data.slug) await (await getPrisma()).category.update({ where: { id }, data: { slug: data.slug } })
    if (data.translations) {
      for (const t of data.translations) {
        await (await getPrisma()).categoryTranslation.upsert({
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
    return mem.deleteCategory(id) ? { ok: true, mock: true } : { ok: false, error: 'القسم غير موجود' }
  }
  try {
    await (await getPrisma()).category.delete({ where: { id } })
    return { ok: true }
  } catch (e: any) {
    return { ok: false, error: 'لا يمكن حذف قسم يحتوي على مقالات' }
  }
}

/* ═══════════ Podcasts ═══════════ */

export async function createPodcastEpisode(data: Partial<MockPodcast>): Promise<{ ok: boolean; id?: string; error?: string; mock?: boolean }> {
  const ar = data.translations?.find((t) => t.locale === 'ar')
  if (!ar?.title) return { ok: false, error: 'العنوان العربي مطلوب' }

  if (!(await useDb())) {
    const slug = data.slug || `episode-${data.episodeNumber || Date.now().toString(36)}`
    const created = mem.createPodcast({ ...data, slug })
    return { ok: true, id: created.id, mock: true }
  }
  try {
    const slug = `episode-${data.episodeNumber || Date.now().toString(36)}`
    const ep = await (await getPrisma()).podcastEpisode.create({
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
            guest: data.guest?.[t.locale] || '',
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

export async function removePodcast(id: string): Promise<{ ok: boolean; error?: string; mock?: boolean }> {
  if (!(await useDb())) {
    return mem.deletePodcast(id) ? { ok: true, mock: true } : { ok: false, error: 'الحلقة غير موجودة' }
  }
  try {
    await (await getPrisma()).podcastEpisode.delete({ where: { id } })
    return { ok: true }
  } catch (e: any) {
    return { ok: false, error: e.message }
  }
}

export async function updatePodcastFull(id: string, data: Partial<MockPodcast>): Promise<{ ok: boolean; error?: string; mock?: boolean }> {
  if (!(await useDb())) {
    const updated = mem.updatePodcast(id, data)
    return updated ? { ok: true, mock: true } : { ok: false, error: 'الحلقة غير موجودة' }
  }
  try {
    await (await getPrisma()).podcastEpisode.update({
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

/* ═══════════ Newsletter ═══════════ */

export async function removeSubscriber(id: string): Promise<{ ok: boolean; error?: string; mock?: boolean }> {
  if (!(await useDb())) {
    return mem.deleteSubscriber(id) ? { ok: true, mock: true } : { ok: false, error: 'المشترك غير موجود' }
  }
  try {
    await (await getPrisma()).newsletter.delete({ where: { id } })
    return { ok: true }
  } catch (e: any) {
    return { ok: false, error: e.message }
  }
}

/* ═══════════ Settings ═══════════ */

export async function saveSettings(updates: Record<string, string>): Promise<{ ok: boolean; mock?: boolean }> {
  if (!(await useDb())) {
    mem.updateSettings(updates)
    return { ok: true, mock: true }
  }
  try {
    for (const [key, value] of Object.entries(updates)) {
      await (await getPrisma()).siteSetting.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      })
    }
    return { ok: true }
  } catch {
    mem.updateSettings(updates)
    return { ok: true, mock: true }
  }
}

export function loadSettings(): Record<string, string> {
  return mem.getSettings()
}

