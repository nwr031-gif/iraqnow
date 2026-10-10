import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Home, ChevronLeft, Newspaper, MapPin } from 'lucide-react'
import { ArticleCard } from '@/components/home/ArticleCard'
import { Reveal } from '@/components/ui/Reveal'
import { IshtarStar } from '@/components/brand/Brand'
import { getArticles } from '@/lib/data'
import { getCategories } from '@/lib/data'

export const revalidate = 120

const GOV_NAMES: Record<string, { ar: string; ku: string; en: string }> = {
  baghdad: { ar: 'بغداد', ku: 'بەغداد', en: 'Baghdad' },
  basra: { ar: 'البصرة', ku: 'بەسرە', en: 'Basra' },
  mosul: { ar: 'نينوى', ku: 'نەینەوا', en: 'Nineveh' },
  erbil: { ar: 'أربيل', ku: 'هەولێر', en: 'Erbil' },
  sulaymaniyah: { ar: 'السليمانية', ku: 'سلێمانی', en: 'Sulaymaniyah' },
  duhok: { ar: 'دهوك', ku: 'دهۆک', en: 'Duhok' },
  halabja: { ar: 'حلبجة', ku: 'هەڵەبجە', en: 'Halabja' },
  najaf: { ar: 'النجف', ku: 'نەجەف', en: 'Najaf' },
  karbala: { ar: 'كربلاء', ku: 'کەربەلا', en: 'Karbala' },
  anbar: { ar: 'الأنبار', ku: 'ئەنبار', en: 'Anbar' },
  diyala: { ar: 'ديالى', ku: 'دیالە', en: 'Diyala' },
  kirkuk: { ar: 'كركوك', ku: 'کەرکووک', en: 'Kirkuk' },
  salahuddin: { ar: 'صلاح الدين', ku: 'سەڵاحەدین', en: 'Salahuddin' },
  babylon: { ar: 'بابل', ku: 'بابل', en: 'Babylon' },
  wasit: { ar: 'واسط', ku: 'واسیت', en: 'Wasit' },
  maysan: { ar: 'ميسان', ku: 'مێسان', en: 'Maysan' },
  'dhi-qar': { ar: 'ذي قار', ku: 'زیقار', en: 'Dhi Qar' },
  muthanna: { ar: 'المثنى', ku: 'موسەننا', en: 'Muthanna' },
  qadisiya: { ar: 'القادسية', ku: 'قادسیە', en: 'Qadisiya' },
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params
  const gov = GOV_NAMES[slug]
  if (!gov) return { title: 'المحافظة غير موجودة' }
  return {
    title: `أخبار ${gov[locale as keyof typeof gov] || gov.ar}`,
    description: `آخر أخبار محافظة ${gov.ar} — تغطية شاملة من العراق الآن`,
    alternates: { languages: { ar: `/ar/governorate/${slug}`, ku: `/ku/governorate/${slug}`, en: `/en/governorate/${slug}` } },
  }
}

export async function generateStaticParams() {
  return Object.keys(GOV_NAMES).flatMap((slug) =>
    ['ar', 'ku', 'en'].map((locale) => ({ slug, locale }))
  )
}

export default async function GovernoratePage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale: rawLocale, slug } = await params
  const locale = (['ar', 'ku', 'en'].includes(rawLocale) ? rawLocale : 'ar') as 'ar' | 'ku' | 'en'
  const dir = locale === 'en' ? 'ltr' : 'rtl'

  const gov = GOV_NAMES[slug]
  if (!gov) notFound()

  const [{ articles }, allCategories] = await Promise.all([
    getArticles({ governorateSlug: slug, limit: 12 }),
    getCategories(),
  ])

  const govName = gov[locale] || gov.ar

  return (
    <div dir={dir} className="min-h-screen bg-[var(--background)]">
      <section className="relative overflow-hidden bg-lapis-950 py-12 text-white">
        <div className="pointer-events-none absolute inset-0 ishtar-grid opacity-40" aria-hidden="true" />
        <div className="container-main relative">
          <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs text-sand-100/50">
            <Link href={`/${locale}`} className="flex items-center gap-1.5 hover:text-gold-400">
              <Home className="h-3.5 w-3.5" /> {locale === 'en' ? 'Home' : 'الرئيسية'}
            </Link>
            <ChevronLeft className="h-3.5 w-3.5 ltr:rotate-180" />
            <Link href={`/${locale}/map`} className="hover:text-gold-400">{locale === 'en' ? 'Map' : 'الخريطة'}</Link>
            <ChevronLeft className="h-3.5 w-3.5 ltr:rotate-180" />
            <span className="font-medium text-gold-400">{govName}</span>
          </nav>
          <Reveal>
            <div className="flex items-center gap-4">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-gold-400 to-gold-700 shadow-xl">
                <MapPin className="h-7 w-7 text-lapis-950" />
              </span>
              <div>
                <h1 className="font-kufi text-3xl font-bold lg:text-4xl">{govName}</h1>
                <p className="mt-1 flex items-center gap-2 text-sm text-sand-100/50">
                  <Newspaper className="h-4 w-4 text-gold-500" />
                  {articles.length} {locale === 'en' ? 'articles' : 'خبر'}
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <div className="container-main py-10">
        {articles.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-20 text-center">
            <Newspaper className="h-12 w-12 text-[var(--muted)] opacity-30" />
            <p className="text-sm text-[var(--muted)]">لا توجد أخبار لهذه المحافظة حالياً</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article, i) => {
              const cat = allCategories.find((c) => c.slug === article.categorySlug)
              const cardArticle = {
                ...article,
                media: article.image ? [{ media: { url: article.image, alt: '' } }] : [],
                category: cat ? { slug: cat.slug, translations: cat.translations } : undefined,
              }
              return (
                <Reveal key={article.id} delay={(i % 3) * 70}>
                  <ArticleCard article={cardArticle as any} locale={locale} />
                </Reveal>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
