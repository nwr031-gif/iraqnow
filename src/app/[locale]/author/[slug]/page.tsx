import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Globe, Briefcase, Calendar, Newspaper, Home, ChevronLeft, Sparkles } from 'lucide-react'
import { XIcon, LinkedInIcon, InstagramIcon } from '@/components/brand/SocialIcons'
import { ArticleCard } from '@/components/home/ArticleCard'
import { Reveal } from '@/components/ui/Reveal'
import { IshtarStar, CuneiformDivider } from '@/components/brand/Brand'
import { getAuthorById, getArticles, getCategories } from '@/lib/data'
import type { Locale } from '@/lib/mock-data'

export const revalidate = 300

export async function generateStaticParams() {
  try {
    const { getAuthors } = await import('@/lib/data')
    const authors = await getAuthors()
    return authors.map((a) => ({ slug: a.slug }))
  } catch { return [] }
}

const UI: Record<Locale, any> = {
  ar: {
    home: 'الرئيسية', articles: 'مقالات', since: 'عضو منذ', specialties: 'التخصصات',
    publishedArticles: 'المقالات المنشورة', noArticles: 'لا توجد مقالات منشورة بعد',
    follow: 'تابعه على', bio: 'نبذة', verified: 'محرر موثّق', role: 'الدور',
  },
  ku: {
    home: 'سەرەکی', articles: 'وتار', since: 'ئەندام لە', specialties: 'پسپۆڕییەکان',
    publishedArticles: 'وتارە بڵاوکراوەکان', noArticles: 'هیچ وتارێک نییە',
    follow: 'شوێنکەوتنی لەسەر', bio: 'پێناسە', verified: 'دەستکاریکاری پشتڕاستکراو', role: 'ڕۆڵ',
  },
  en: {
    home: 'Home', articles: 'Articles', since: 'Member since', specialties: 'Specialties',
    publishedArticles: 'Published Articles', noArticles: 'No published articles yet',
    follow: 'Follow on', bio: 'Bio', verified: 'Verified Editor', role: 'Role',
  },
}

const ROLE_LABELS: Record<string, Record<Locale, string>> = {
  ADMIN: { ar: 'مدير عام — رئيس التحرير', ku: 'بەڕێوەبەری گشتی', en: 'Editor-in-Chief' },
  EDITOR: { ar: 'محرر أول', ku: 'دەستکاریکاری باڵا', en: 'Senior Editor' },
  JOURNALIST: { ar: 'صحفي ميداني', ku: 'ڕۆژنامەنووسی مەیدانی', en: 'Field Journalist' },
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params
  const author = await getAuthorById(slug)
  if (!author) return { title: 'الكاتب غير موجود' }
  return {
    title: `${author.name} — ${author.jobTitle[locale as Locale] || ''}`,
    description: author.bio[locale as Locale] || author.bio.ar,
    alternates: { languages: { ar: `/ar/author/${slug}`, ku: `/ku/author/${slug}`, en: `/en/author/${slug}` } },
    openGraph: {
      type: 'profile',
      title: author.name,
      description: author.bio[locale as Locale] || author.bio.ar,
      images: author.avatar ? [author.avatar] : [],
    },
  }
}

export default async function AuthorPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale: rawLocale, slug } = await params
  const locale = (['ar', 'ku', 'en'].includes(rawLocale) ? rawLocale : 'ar') as Locale
  const t = UI[locale]
  const dir = locale === 'en' ? 'ltr' : 'rtl'

  const author = await getAuthorById(slug)
  if (!author) notFound()

  const [{ articles }, allCategories] = await Promise.all([
    getArticles({ authorId: author.id, limit: 9 }),
    getCategories(),
  ])

  const socials = [
    author.twitter && { icon: XIcon, href: `https://x.com/${author.twitter}`, label: 'X' },
    author.linkedin && { icon: LinkedInIcon, href: `https://linkedin.com/in/${author.linkedin}`, label: 'LinkedIn' },
    author.instagram && { icon: InstagramIcon, href: `https://instagram.com/${author.instagram}`, label: 'Instagram' },
    author.website && { icon: Globe, href: author.website, label: 'Website' },
  ].filter(Boolean) as { icon: any; href: string; label: string }[]

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: author.name,
    jobTitle: author.jobTitle[locale] || author.jobTitle.ar,
    description: author.bio[locale] || author.bio.ar,
    image: author.avatar,
    url: `https://iraqnow.pages.dev/${locale}/author/${author.slug}`,
    sameAs: socials.map((s) => s.href),
    worksFor: { '@type': 'NewsMediaOrganization', name: 'Iraq Now' },
  }

  return (
    <div dir={dir} className="min-h-screen bg-[var(--background)]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* الغلاف */}
      <section className="relative">
        <div className="relative h-56 overflow-hidden bg-lapis-950 lg:h-72">
          {author.coverImage ? (
            <img src={author.coverImage} alt="" className="h-full w-full object-cover opacity-70" />
          ) : (
            <div className="h-full w-full ishtar-grid opacity-60" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--background)] via-lapis-950/50 to-transparent" />
          <div className="pointer-events-none absolute -top-20 start-1/4 h-72 w-72 rounded-full bg-gold-500 opacity-10 blur-[100px]" />

          <div className="container-main relative flex h-16 items-start pt-4">
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-sand-100/60">
              <Link href={`/${locale}`} className="flex items-center gap-1.5 transition-colors hover:text-gold-400">
                <Home className="h-3.5 w-3.5" />
                {t.home}
              </Link>
              <ChevronLeft className="h-3.5 w-3.5 ltr:rotate-180" />
              <span className="font-medium text-gold-400">{author.name}</span>
            </nav>
          </div>
        </div>

        <div className="container-main relative -mt-24 lg:-mt-28">
          <Reveal>
            <div className="flex flex-col items-center gap-6 text-center lg:flex-row lg:items-end lg:text-start">
              {author.avatar ? (
                <img
                  src={author.avatar}
                  alt={author.name}
                  className="h-36 w-36 rounded-3xl object-cover ring-4 ring-[var(--background)] shadow-2xl lg:h-44 lg:w-44"
                />
              ) : (
                <span className="flex h-36 w-36 items-center justify-center rounded-3xl bg-gradient-to-br from-lapis-600 to-lapis-950 font-kufi text-6xl font-bold text-gold-400 ring-4 ring-[var(--background)] lg:h-44 lg:w-44">
                  {author.name.charAt(0)}
                </span>
              )}

              <div className="flex-1 pb-2">
                <div className="flex flex-wrap items-center justify-center gap-2 lg:justify-start">
                  <h1 className="font-kufi text-3xl font-bold text-[var(--foreground)] lg:text-4xl">{author.name}</h1>
                  <span className="flex items-center gap-1.5 rounded-xl border border-gold-500/30 bg-gold-500/10 px-3 py-1 text-xs font-bold text-gold-600">
                    <Sparkles className="h-3.5 w-3.5" />
                    {ROLE_LABELS[author.role]?.[locale] || t.verified}
                  </span>
                </div>

                <p className="mt-2 flex flex-wrap items-center justify-center gap-4 text-sm text-[var(--muted)] lg:justify-start">
                  <span className="flex items-center gap-1.5">
                    <Briefcase className="h-4 w-4 text-gold-500" />
                    {author.jobTitle[locale] || author.jobTitle.ar}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4 text-gold-500" />
                    {t.since} {new Date(author.staffSince).toLocaleDateString(locale === 'ar' ? 'ar-IQ' : 'en-US', { year: 'numeric', month: 'long' })}
                  </span>
                </p>

                {/* روابط التواصل */}
                {socials.length > 0 && (
                  <div className="mt-4 flex items-center justify-center gap-2 lg:justify-start">
                    {socials.map((s) => (
                      <a
                        key={s.label}
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={s.label}
                        className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--card-bg)] text-[var(--muted)] transition-all duration-300 hover:-translate-y-1 hover:border-gold-500/50 hover:text-gold-600"
                      >
                        <s.icon className="h-4.5 w-4.5" />
                      </a>
                    ))}
                  </div>
                )}
              </div>

              {/* إحصائية */}
              <div className="flex gap-4 pb-2">
                <div className="rounded-2xl border border-gold-500/20 bg-gradient-to-b from-gold-500/10 to-transparent px-6 py-4 text-center">
                  <p className="font-kufi text-3xl font-bold text-gold-600">{author.articleCount}</p>
                  <p className="mt-1 text-[11px] text-[var(--muted)]">{t.articles}</p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <div className="container-main py-12">
        {/* النبذة والتخصصات */}
        <Reveal>
          <div className="mx-auto max-w-4xl rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] p-6 lg:p-8">
            <h2 className="mb-3 flex items-center gap-2 font-kufi text-lg font-bold text-[var(--foreground)]">
              <IshtarStar size={18} />
              {t.bio}
            </h2>
            <p className="text-sm leading-loose text-[var(--muted)]">
              {author.bio[locale] || author.bio.ar}
            </p>

            {author.specialties.length > 0 && (
              <div className="mt-5 border-t border-[var(--border)] pt-5">
                <p className="mb-3 text-xs font-bold text-gold-600">{t.specialties}</p>
                <div className="flex flex-wrap gap-2">
                  {author.specialties.map((spec) => (
                    <span key={spec} className="rounded-lg border border-gold-500/25 bg-gold-500/[0.07] px-3 py-1.5 text-xs font-medium text-gold-600">
                      {spec}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Reveal>

        <CuneiformDivider variant="star" className="my-12 opacity-40" />

        {/* المقالات */}
        <section>
          <div className="mb-8 flex items-center justify-between">
            <h2 className="section-title font-kufi text-xl font-bold lg:text-2xl">{t.publishedArticles}</h2>
            <span className="badge badge-gold">
              <Newspaper className="h-3.5 w-3.5" />
              {articles.length.toLocaleString(locale === 'ar' ? 'ar-IQ' : 'en-US')}
            </span>
          </div>

          {articles.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-16 text-center">
              <Newspaper className="h-10 w-10 text-[var(--muted)] opacity-30" />
              <p className="text-sm text-[var(--muted)]">{t.noArticles}</p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {articles.map((article, i) => {
                const cat = allCategories.find((c) => c.slug === article.categorySlug)
                const cardArticle = {
                  ...article,
                  media: article.image ? [{ media: { url: article.image, alt: '' } }] : [],
                  category: cat ? { slug: cat.slug, translations: cat.translations } : undefined,
                  author: { name: author.name, avatar: author.avatar },
                }
                return (
                  <Reveal key={article.id} delay={(i % 3) * 80}>
                    <ArticleCard article={cardArticle as any} locale={locale} />
                  </Reveal>
                )
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}




