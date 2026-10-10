'use client'

import Link from 'next/link'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { ArticleCard, type ArticleData } from './ArticleCard'
import { Reveal } from '@/components/ui/Reveal'
import { IshtarStar } from '@/components/brand/Brand'

type Locale = 'ar' | 'ku' | 'en'

interface LatestNewsProps {
  locale: Locale
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

const MOCK: ArticleData[] = Array.from({ length: 9 }, (_, i) => ({
  id: String(i + 10),
  slug: `article-${i + 10}`,
  breaking: i === 2,
  featured: false,
  publishedAt: new Date(Date.now() - (i + 1) * 1.5 * 3600000).toISOString(),
  viewCount: Math.floor(Math.random() * 18000) + 2400,
  readingTime: Math.floor(Math.random() * 8) + 3,
  translations: [
    { locale: 'ar' as const, title: ['مجلس النواب يقر قانون الموازنة العامة بعد مناقشات مطولة', 'العراق يسجل نمواً اقتصادياً بنسبة 4.2% في الربع الأول', 'وزارة النفط تعلن عن اكتشاف حقول جديدة في البصرة', 'افتتاح أول مركز تكنولوجي متخصص في بغداد', 'الجامعات العراقية تدخل ضمن أفضل 500 جامعة عالمية', 'افتتاح مهرجان بابل الدولي للثقافة والفنون', 'منتخب العراق يفوز على نظيره الإيراني ودياً', 'حملة وطنية للتشجير في جميع المحافظات', 'مشروع جديد لتطوير البنية التحتية في كركوك'][i],
      excerpt: 'تفاصيل شاملة عن هذا الخبر الهام مع تحليل معمق وتغطية خاصة من مراسلي العراق الآن في الميدان، تشمل آراء الخبراء والمختصين والبيانات الرسمية الحديثة.',
    },
    { locale: 'ku' as const, title: `هەواڵی گرنگی ژمارە ${i + 1} لە عێراق ئێستا`, excerpt: 'وردەکاری گشتگیر دەربارەی ئەم هەواڵە گرنگە لەگەڵ شیکاری قووڵ.' },
    { locale: 'en' as const, title: `Breaking: Major Development in Iraq's ${['Political', 'Economic', 'Security', 'Social', 'Cultural', 'Sports', 'Tech', 'Health', 'Education'][i] ?? 'National'} Sector`, excerpt: 'Comprehensive details on this important story with in-depth analysis and exclusive coverage from Iraq Now correspondents in the field.' },
  ],
  media: [{ media: { url: `https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=600&fit=crop&q=80&sig=iraqnow${i + 10}/800/500`, alt: '' } }],
  category: { slug: categories[i % categories.length], translations: [{ locale: 'ar' as const, name: catNames.ar[i % catNames.ar.length] }, { locale: 'ku' as const, name: catNames.ku[i % catNames.ku.length] }, { locale: 'en' as const, name: catNames.en[i % catNames.en.length] }] },
  author: { name: ['أحمد الزبيدي', 'ليلى حسن', 'سوران محمد', 'عمر عبد الله', 'زينب الكعبي', 'حسين العلي', 'فاطمة الجابري', 'علي الشمري', 'نور الدين'][i] },
  location: { governorate: { translations: [{ locale: 'ar' as const, name: govs.ar[i % govs.ar.length] }, { locale: 'ku' as const, name: govs.ku[i % govs.ku.length] }, { locale: 'en' as const, name: govs.en[i % govs.en.length] }] } },
}))

export function LatestNews({ locale }: LatestNewsProps) {
  const t = UI[locale]
  const dir = locale === 'en' ? 'ltr' : 'rtl'
  const Arrow = dir === 'rtl' ? ArrowLeft : ArrowRight

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
          {MOCK.map((article, i) => (
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
