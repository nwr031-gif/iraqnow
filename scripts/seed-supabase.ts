/**
 * بذر Supabase مباشرة — يشغَّل محلياً:
 * npx tsx --env-file=.env scripts/seed-supabase.ts
 */
import { MOCK_ARTICLES, MOCK_CATEGORIES, MOCK_AUTHORS, MOCK_PODCASTS } from '../src/lib/mock-data'

const SB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SB_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const headers: Record<string, string> = {
  apikey: SB_KEY,
  Authorization: `Bearer ${SB_KEY}`,
  'Content-Type': 'application/json',
  Prefer: 'return=minimal',
}

async function insert(table: string, rows: any[]): Promise<boolean> {
  const res = await fetch(`${SB_URL}/rest/v1/${table}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(rows),
  })
  if (res.status === 201 || res.status === 200) {
    console.log(`✓ ${table}: ${rows.length} rows`)
    return true
  }
  const text = await res.text()
  console.error(`✗ ${table}: ${res.status} — ${text.slice(0, 200)}`)
  return false
}

function articleToRow(a: any) {
  const tr = (l: string, f: string) => a.translations?.find((t: any) => t.locale === l)?.[f] || ''
  return {
    id: a.id, slug: a.slug, status: a.status,
    breaking: a.breaking, featured: a.featured,
    published_at: a.publishedAt || null,
    created_at: a.createdAt || null,
    updated_at: a.updatedAt || null,
    view_count: a.viewCount || 0, reading_time: a.readingTime || 5,
    author_id: a.authorId, category_slug: a.categorySlug,
    governorate_slug: a.governorateSlug,
    image: a.image || '', gallery: a.gallery || [], tags: a.tagSlugs || [],
    title_ar: tr('ar', 'title'), title_ku: tr('ku', 'title'), title_en: tr('en', 'title'),
    excerpt_ar: tr('ar', 'excerpt'), excerpt_ku: tr('ku', 'excerpt'), excerpt_en: tr('en', 'excerpt'),
    content_ar: tr('ar', 'content'), content_ku: tr('ku', 'content'), content_en: tr('en', 'content'),
  }
}

function podcastToRow(p: any) {
  const tr = (l: string, f: string) => p.translations?.find((t: any) => t.locale === l)?.[f] || ''
  return {
    id: p.id, slug: p.slug, episode_number: p.episodeNumber, season: p.season,
    duration: p.duration, audio_url: p.audioUrl, cover_url: p.coverUrl,
    published_at: p.publishedAt, is_published: p.isPublished, is_featured: p.isFeatured,
    views: p.views || 0,
    title_ar: tr('ar', 'title'), title_ku: tr('ku', 'title'), title_en: tr('en', 'title'),
    description_ar: tr('ar', 'description'), description_ku: tr('ku', 'description'), description_en: tr('en', 'description'),
    guest_ar: p.guest?.ar || '', guest_ku: p.guest?.ku || '', guest_en: p.guest?.en || '',
    show_notes_ar: tr('ar', 'showNotes'), show_notes_ku: tr('ku', 'showNotes'), show_notes_en: tr('en', 'showNotes'),
  }
}

async function main() {
  console.log(`🌱 Seeding Supabase (${SB_URL})...\n`)

  await insert('categories', MOCK_CATEGORIES.map((c) => ({
    id: c.id, slug: c.slug, sort_order: c.order,
    name_ar: c.translations.find((t) => t.locale === 'ar')?.name,
    name_ku: c.translations.find((t) => t.locale === 'ku')?.name,
    name_en: c.translations.find((t) => t.locale === 'en')?.name,
    description_ar: c.translations.find((t) => t.locale === 'ar')?.description || '',
    description_ku: c.translations.find((t) => t.locale === 'ku')?.description || '',
    description_en: c.translations.find((t) => t.locale === 'en')?.description || '',
  })))

  await insert('authors', MOCK_AUTHORS.map((a) => ({
    id: a.id, name: a.name, slug: a.slug, email: a.email, role: a.role,
    avatar: a.avatar || '', cover_image: a.coverImage || '',
    job_title: a.jobTitle.ar, bio: a.bio.ar,
    twitter: a.twitter || '', linkedin: a.linkedin || '', website: a.website || '',
    specialties: a.specialties, staff_since: a.staffSince,
    is_active: a.isActive, article_count: a.articleCount,
  })))

  await insert('articles', MOCK_ARTICLES.map(articleToRow))

  await insert('podcast_episodes', MOCK_PODCASTS.map(podcastToRow))

  console.log('\n🎉 Done!')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
