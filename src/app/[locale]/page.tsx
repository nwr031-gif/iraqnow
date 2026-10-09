import { Metadata } from 'next'
import Link from 'next/link'
import { Suspense } from 'react'
import { HeroSection } from '@/components/home/HeroSection'
import { BreakingNews } from '@/components/home/BreakingNews'
import { LatestNews } from '@/components/home/LatestNews'
import { CategorySections } from '@/components/home/CategorySections'
import { TrendingTopics } from '@/components/home/TrendingTopics'
import { NewsletterSignup } from '@/components/home/NewsletterSignup'
import { Map, TrendingUp, Users, Zap, Award } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export const metadata: Metadata = {
  title: 'الرئيسية',
  description: 'IraqNow - بوابة العراق الإخبارية الشاملة متعددة اللغات. أخبار عاجلة، تقارير معمقة، خرائط تفاعلية، وصحافة بيانات.',
}

interface FeatureItem {
  icon: LucideIcon
  title: { ar: string; ku: string; en: string }
  desc: { ar: string; ku: string; en: string }
}

const features: FeatureItem[] = [
  { icon: Map, title: { ar: 'خرائط تفاعلية', ku: 'نەخشەی بەراوەر', en: 'Interactive Maps' }, desc: { ar: 'تصفح الأخبار جغرافياً على خريطة العراق', ku: 'هەواڵەکان بە جۆگرافیایی لەسەر نەخشەی عێراق بدۆزەوە', en: 'Browse news geographically on Iraq map' } },
  { icon: TrendingUp, title: { ar: 'تحليلات وبيانات', ku: 'تَحلیل و داتا', en: 'Analytics & Data' }, desc: { ar: 'صحافة بيانات معمقة ورسوم بيانية تفاعلية', ku: 'رۆژنامەوانی داتای سەێوە و گرافە بەراوەرەکان', en: 'In-depth data journalism with interactive charts' } },
  { icon: Users, title: { ar: 'مجتمع تفاعلي', ku: 'کۆمەڵگەی بەراوەر', en: 'Interactive Community' }, desc: { ar: 'تعليقات، نقاشات، وإشارات مرجعية مخصصة', ku: 'تێبینی، مێژوو، و نیشانەکانی تایبەت', en: 'Comments, discussions, and personalized bookmarks' } },
  { icon: Zap, title: { ar: 'أخبار فورية', ku: 'هەواڵی بێدەنگ', en: 'Real-time News' }, desc: { ar: 'إشعارات فورية للأخبار العاجلة والمهمة', ku: 'ئاگادارکردنەوەی بێدەنگ بۆ هەواڵی بەھێز و گرنگ', en: 'Instant notifications for breaking news' } },
  { icon: Award, title: { ar: 'محتوى موثوق', ku: 'ناوەڕۆکی باوەڕپێکراو', en: 'Trusted Content' }, desc: { ar: 'فريق تحريري محترف ومعايير تحقق عالية', ku: 'تێمی ڕۆژنامەوانی پیشەگەر و استانداردە باوەڕی بەرز', en: 'Professional editorial team with high verification standards' } },
]

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const resolvedParams = await params
  const locale = resolvedParams.locale as 'ar' | 'ku' | 'en'

  return (
    <div className="min-h-screen">
      <Suspense fallback={<div className="h-96 animate-pulse bg-gray-100 dark:bg-gray-900" />}>
        <HeroSection locale={locale} />
      </Suspense>

      <Suspense fallback={<div className="h-48 animate-pulse bg-gray-100 dark:bg-gray-900" />}>
        <BreakingNews locale={locale} />
      </Suspense>

      <section className="py-8 lg:py-12" aria-labelledby="features-heading">
        <div className="container-main">
          <h2 id="features-heading" className="sr-only">
            {locale === 'ar' ? 'مميزات المنصة' : locale === 'ku' ? 'تایبەتمەندییەکانی پلاتفۆرم' : 'Platform Features'}
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {features.map((feature, i) => (
              <article key={i} className="card-hover p-6 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
                  {feature.title[locale]}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {feature.desc[locale]}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <Suspense fallback={<div className="h-96 animate-pulse bg-gray-100 dark:bg-gray-900" />}>
        <LatestNews locale={locale} />
      </Suspense>

      <Suspense fallback={<div className="h-96 animate-pulse bg-gray-100 dark:bg-gray-900" />}>
        <CategorySections locale={locale} />
      </Suspense>

      <Suspense fallback={<div className="h-64 animate-pulse bg-gray-100 dark:bg-gray-900" />}>
        <TrendingTopics locale={locale} />
      </Suspense>

      <section className="py-12 lg:py-16 bg-primary dark:bg-primary-dark" aria-labelledby="newsletter-heading">
        <div className="container-main">
          <NewsletterSignup locale={locale} />
        </div>
      </section>
    </div>
  )
}