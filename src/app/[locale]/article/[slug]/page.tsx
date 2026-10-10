import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Home, ChevronLeft, Clock, Eye, MapPin, Calendar, Sparkles, Tag } from 'lucide-react'
import { ArticleCard } from '@/components/home/ArticleCard'
import { ArticleGallery, ReadingProgress, ShareButtons } from '@/components/article/ArticleExtras'
import { GiscusComments } from '@/components/integrations/GiscusComments'
import { Reveal } from '@/components/ui/Reveal'
import { CuneiformDivider } from '@/components/brand/Brand'
import { getArticleBySlug, getArticles, getAuthorById, getCategories } from '@/lib/data'
import type { Locale } from '@/lib/mock-data'

export const revalidate = 300

export async function generateStaticParams() {
  try {
    const { getArticles } = await import('@/lib/data')
    const { articles } = await getArticles({ limit: 100 })
    return articles.map((a) => ({ slug: a.slug }))
  } catch {
    return []
  }
}

const UI: Record<Locale, any> = {
  ar: {
    home: 'الرئيسية', readTime: 'دقيقة قراءة', views: 'قراءة', share: 'شارك الخبر',
    tags: 'الوسوم', related: 'أخبار ذات صلة', by: 'بقلم', notFound: 'المقال غير موجود',
    breaking: 'عاجل', sources: 'المصادر', comments: 'التعليقات',
  },
  ku: {
    home: 'سەرەکی', readTime: 'خولەک خوێندنەوە', views: 'خوێندنەوە', share: 'هاوبەشکردن',
    tags: 'تاگەکان', related: 'هەواڵی پەیوەندیدار', by: 'لەلایەن', notFound: 'وتار نەدۆزرایەوە',
    breaking: 'بەپەلە', sources: 'سەرچاوەکان', comments: 'تێبینییەکان',
  },
  en: {
    home: 'Home', readTime: 'min read', views: 'views', share: 'Share',
    tags: 'Tags', related: 'Related News', by: 'By', notFound: 'Article not found',
    breaking: 'BREAKING', sources: 'Sources', comments: 'Comments',
  },
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params
  const article = await getArticleBySlug(slug)
  if (!article) return { title: 'المقال غير موجود' }

  const tr = article.translations.find((t) => t.locale === locale) || article.translations[0]
  return {
    title: tr?.title || '',
    description: tr?.excerpt || '',
    alternates: {
      languages: {
        ar: `/ar/article/${slug}`, ku: `/ku/article/${slug}`, en: `/en/article/${slug}`,
      },
    },
    openGraph: {
      type: 'article',
      title: tr?.title,
      description: tr?.excerpt,
      images: article.image ? [{ url: article.image, width: 1200, height: 630 }] : [],
      publishedTime: article.publishedAt,
    },
  }
}

export default async function ArticlePage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale: rawLocale, slug } = await params
  const locale = (['ar', 'ku', 'en'].includes(rawLocale) ? rawLocale : 'ar') as Locale
  const t = UI[locale]
  const dir = locale === 'en' ? 'ltr' : 'rtl'

  const article = await getArticleBySlug(slug)
  if (!article) notFound()

  const [author, allCategories, { articles: related }] = await Promise.all([
    getAuthorById(article.authorId),
    getCategories(),
    getArticles({ categorySlug: article.categorySlug, excludeId: article.id, limit: 3 }),
  ])

  const tr = article.translations.find((x) => x.locale === locale) || article.translations[0]
  const category = allCategories.find((c) => c.slug === article.categorySlug)
  const catName = category?.translations.find((x) => x.locale === locale)?.name || category?.translations[0]?.name || ''
  const govName = article.governorateSlug

  const title = tr?.title || ''
  const paragraphs = (tr?.content || '').split('\n').filter((p) => p.trim())

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: title,
    description: tr?.excerpt,
    image: article.gallery?.length ? article.gallery : article.image ? [article.image] : [],
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    inLanguage: locale === 'ku' ? 'ckb' : locale,
    author: author ? { '@type': 'Person', name: author.name, url: `https://iraqnow.pages.dev/${locale}/author/${author.slug}` } : { '@type': 'Organization', name: 'Iraq Now' },
    publisher: { '@type': 'NewsMediaOrganization', name: 'العراق الآن — Iraq Now' },
    mainEntityOfPage: `https://iraqnow.pages.dev/${locale}/article/${slug}`,
  }

  return (
    <div dir={dir} className="min-h-screen bg-[var(--background)]">
      <ReadingProgress />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <article className="container-main max-w-4xl py-8 lg:py-12">
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-2 text-xs text-[var(--muted)]">
          <Link href={`/${locale}`} className="flex items-center gap-1.5 transition-colors hover:text-gold-600">
            <Home className="h-3.5 w-3.5" />
            {t.home}
          </Link>
          <ChevronLeft className="h-3.5 w-3.5 ltr:rotate-180" />
          {category && (
            <>
              <Link href={`/${locale}/category/${category.slug}`} className="transition-colors hover:text-gold-600">
                {catName}
              </Link>
              <ChevronLeft className="h-3.5 w-3.5 ltr:rotate-180" />
            </>
          )}
          <span className="line-clamp-1 max-w-48 font-medium text-gold-600">{title}</span>
        </nav>

        {/* الشارات والعنوان */}
        <Reveal>
          <div className="mb-4 flex flex-wrap items-center gap-2">
            {article.breaking && (
              <span className="badge badge-live font-kufi text-[11px] font-bold">
                <Sparkles className="h-3.5 w-3.5" />
                {t.breaking}
              </span>
            )}
            {category && (
              <Link href={`/${locale}/category/${category.slug}`} className="badge badge-gold text-[11px]">
                {catName}
              </Link>
            )}
            {govName && (
              <span className="badge badge-lapis text-[11px]">
                <MapPin className="h-3 w-3" />
                {govName}
              </span>
            )}
          </div>

          <h1 className="font-kufi text-2xl font-bold leading-[1.3] text-[var(--foreground)] text-balance sm:text-3xl lg:text-4xl">
            {title}
          </h1>

          <p className="mt-4 text-base leading-relaxed text-[var(--muted)] sm:text-lg">
            {tr?.excerpt}
          </p>
        </Reveal>

        {/* الميتا */}
        <Reveal delay={100}>
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-y border-[var(--border)] py-4">
            <div className="flex items-center gap-3">
              {author?.avatar ? (
                <img src={author.avatar} alt="" className="h-11 w-11 rounded-xl object-cover ring-2 ring-gold-500/30" />
              ) : (
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-lapis-600 to-lapis-900 font-kufi text-sm font-bold text-gold-400">
                  {author?.name?.charAt(0) || 'IQ'}
                </span>
              )}
              <div>
                {author ? (
                  <Link href={`/${locale}/author/${author.slug}`} className="font-kufi text-sm font-bold text-[var(--foreground)] transition-colors hover:text-gold-600">
                    {t.by} {author.name}
                  </Link>
                ) : (
                  <p className="font-kufi text-sm font-bold text-[var(--foreground)]">{t.by} العراق الآن</p>
                )}
                <div className="mt-0.5 flex items-center gap-3 text-[11px] text-[var(--muted)]">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString(locale === 'ar' ? 'ar-IQ' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '—'}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {article.readingTime} {t.readTime}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {article.viewCount.toLocaleString(locale === 'ar' ? 'ar-IQ' : 'en-US')} {t.views}
                  </span>
                </div>
              </div>
            </div>

            <ShareButtons url={`https://iraqnow.pages.dev/${locale}/article/${slug}`} title={title} />
          </div>
        </Reveal>

        {/* الصورة الرئيسية */}
        {article.image && (
          <Reveal delay={150}>
            <figure className="mt-8">
              <img
                src={article.image}
                alt={title}
                className="aspect-[16/9] w-full rounded-3xl border border-[var(--border)] object-cover shadow-2xl shadow-lapis-900/15"
              />
              <figcaption className="mt-3 text-center text-xs text-[var(--muted)]">
                {tr?.excerpt?.slice(0, 80)}...
              </figcaption>
            </figure>
          </Reveal>
        )}

        {/* المحتوى */}
        <Reveal delay={200}>
          <div className="mt-8">
            {paragraphs.map((para, i) => (
              <p
                key={i}
                className={`mb-6 text-base leading-[2.1] text-[var(--foreground)] sm:text-[17px] ${i === 0 ? 'first-letter:float-start first-letter:me-3 first-letter:mt-1 first-letter:font-kufi first-letter:text-6xl first-letter:font-bold first-letter:text-gold-600' : ''}`}
              >
                {para}
              </p>
            ))}
          </div>
        </Reveal>

        {/* معرض الصور المتعدد */}
        {article.gallery && article.gallery.length > 1 && (
          <ArticleGallery images={article.gallery} alt={title} />
        )}

        {/* الوسوم */}
        {article.tagSlugs?.length > 0 && (
          <div className="mt-8 flex flex-wrap items-center gap-2">
            <Tag className="h-4 w-4 text-gold-500" />
            {article.tagSlugs.map((tag) => (
              <span key={tag} className="badge badge-gold">{tag}</span>
            ))}
          </div>
        )}

        {/* نظام التعليقات — Giscus (يظهر عند تفعيله) */}
        <GiscusComments locale={locale} title={title} />

        <CuneiformDivider variant="star" className="my-10 opacity-40" />

        {/* بطاقة الكاتب */}
        {author && (
          <Reveal>
            <Link
              href={`/${locale}/author/${author.slug}`}
              className="group flex flex-col items-center gap-4 rounded-3xl border border-gold-500/25 bg-gradient-to-b from-gold-500/[0.06] to-transparent p-6 text-center transition-all duration-300 hover:border-gold-500/50 sm:flex-row sm:text-start"
            >
              <img src={author.avatar || ''} alt="" className="h-20 w-20 rounded-2xl object-cover ring-2 ring-gold-500/40" />
              <div className="flex-1">
                <p className="font-kufi text-lg font-bold text-[var(--foreground)] transition-colors group-hover:text-gold-600">{author.name}</p>
                <p className="mt-0.5 text-xs text-gold-600">{author.jobTitle[locale] || author.jobTitle.ar}</p>
                <p className="mt-2 text-sm leading-relaxed text-[var(--muted)] line-clamp-2">
                  {author.bio[locale] || author.bio.ar}
                </p>
              </div>
            </Link>
          </Reveal>
        )}
      </article>

      {/* أخبار ذات صلة */}
      {related.length > 0 && (
        <section className="border-t border-[var(--border)] bg-[var(--card-bg)]/50 py-12">
          <div className="container-main">
            <Reveal>
              <h2 className="section-title mb-8 font-kufi text-xl font-bold lg:text-2xl">{t.related}</h2>
            </Reveal>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((rel, i) => {
                const cat = allCategories.find((c) => c.slug === rel.categorySlug)
                const cardArticle = {
                  ...rel,
                  media: rel.image ? [{ media: { url: rel.image, alt: '' } }] : [],
                  category: cat ? { slug: cat.slug, translations: cat.translations } : undefined,
                  author: author ? { name: author.name } : undefined,
                }
                return (
                  <Reveal key={rel.id} delay={i * 80}>
                    <ArticleCard article={cardArticle as any} locale={locale} />
                  </Reveal>
                )
              })}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}


