'use client'

import Link from 'next/link'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { ArticleCard, type ArticleData } from './ArticleCard'
import { Reveal } from '@/components/ui/Reveal'
import { IshtarStar } from '@/components/brand/Brand'

type Locale = 'ar' | 'ku' | 'en'

interface LatestNewsProps {
  locale: Locale
  articles?: ArticleData[]
}

const UI: Record<Locale, { title: string; viewAll: string; subtitle: string }> = {
  ar: { title: 'أحدث الأخبار', viewAll: 'عرض كل الأخبار', subtitle: 'تغطية مستمرة على مدار الساعة من جميع المحافظات' },
  ku: { title: 'دوایین هەواڵەکان', viewAll: 'هەموو هەواڵەکان', subtitle: 'پەرپێدانی بەردەوام لە هەموو پارێزگاکان' },
  en: { title: 'Latest News', viewAll: 'View All News', subtitle: 'Continuous 24/7 coverage from all governorates' },
}

const categories = ['politics', 'economy', 'security', 'society', 'culture', 'sports', 'technology', 'health', 'education', 'environment']
const catNames: Record<Locale, string[]> = {
  ar: ['السياسة', 'الاقتصاد', 'الأمن', 'المجتمع', 'الثقافة', 'الرياضة', 'التكنولوجيا', 'الصحة', 'التعليم', 'البيئة'],
  ku: ['سیاسەت', 'ئابووری', 'ئاسایش', 'کۆمەڵگە', 'چاند', 'وەرزش', 'تەکنەلۆژی', 'تەندروستی', 'پەروەردە', 'ژینگە'],
  en: ['Politics', 'Economy', 'Security', 'Society', 'Culture', 'Sports', 'Technology', 'Health', 'Education', 'Environment'],
}
const govs: Record<Locale, string[]> = {
  ar: ['بغداد', 'البصرة', 'أربيل', 'الموصل', 'السليمانية', 'النجف', 'كربلاء', 'كركوك', 'ذي قار', 'الأنبار'],
  ku: ['بەغداد', 'بەسرە', 'هەولێر', 'مۆسڵ', 'سلێمانی', 'نەجەف', 'کەربەلا', 'کەرکووک', 'زیقار', 'ئەنبار'],
  en: ['Baghdad', 'Basra', 'Erbil', 'Mosul', 'Sulaymaniyah', 'Najaf', 'Karbala', 'Kirkuk', 'Dhi Qar', 'Anbar'],
}


export function LatestNews({ locale, articles: propArticles }: LatestNewsProps) {
  const t = UI[locale]
  const dir = locale === 'en' ? 'ltr' : 'rtl'
  const Arrow = dir === 'rtl' ? ArrowLeft : ArrowRight
  const articles = propArticles || []

  return (
    <section className="py-14 lg:py-20 bg-[var(--background)]" aria-labelledby="latest-heading">
      <div className="container-main">
        <Reveal>
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-gold-600">
                <IshtarStar size={12} />
                {locale === 'en' ? 'News Feed' : locale === 'ku' ? 'خۆری هەواڵ' : 'تدفق الأخبار'}
              </p>
              <h2 id="latest-heading" className="section-title font-kufi text-3xl font-bold lg:text-4xl">
                {t.title}
              </h2>
              <p className="mt-2 text-sm text-[var(--muted)]">{t.subtitle}</p>
            </div>

            <Link
              href={`/${locale}/latest`}
              className="group flex items-center gap-2 rounded-xl border border-gold-500/40 px-5 py-2.5 text-sm font-semibold text-gold-600 transition-all duration-300 hover:bg-gold-500 hover:text-lapis-950"
            >
              {t.viewAll}
              <Arrow className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
            </Link>
          </div>
        </Reveal>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {articles.length === 0 ? (
            <div className="col-span-full flex flex-col items-center gap-4 rounded-3xl border border-dashed border-gold-500/30 py-20 text-center">
              <IshtarStar size={48} />
              <p className="font-kufi text-lg font-bold text-[var(--foreground)]">
                {locale === 'en' ? 'Coming Soon' : locale === 'ku' ? 'بەم زووانە' : 'قريباً'}
              </p>
              <p className="max-w-sm text-sm text-[var(--muted)]">
                {locale === 'en' ? 'We\'re working on bringing you the latest news from Iraq. Check back soon!' : 'نعمل على تقديم أحدث الأخبار من العراق. عد قريباً!'}
              </p>
            </div>
          ) : articles.map((article, i) => (
            <Reveal key={article.id} delay={(i % 3) * 100}>
              <ArticleCard article={article} locale={locale} />
            </Reveal>
          ))}
        </div>

        {/* فاصل + زر المزيد */}
        <Reveal>
          <div className="mt-12 flex justify-center">
            <Link
              href={`/${locale}/latest`}
              className="btn-primary group !rounded-2xl !px-10 !py-4 font-kufi"
            >
              {locale === 'en' ? 'Load More Stories' : locale === 'ku' ? 'زیاتر پیشان بدە' : 'تحميل المزيد من الأخبار'}
              <Arrow className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
