import { Metadata } from 'next'
import Link from 'next/link'
import { Home, ChevronLeft, Send } from 'lucide-react'
import { Reveal } from '@/components/ui/Reveal'
import { SendNewsForm } from '@/components/forms/SendNewsForm'

export const dynamic = 'force-static'

export const metadata: Metadata = {
  title: 'أرسل خبراً',
  description: 'لديك خبر أو حدث في محافظتك؟ أرسله لفريق تحرير العراق الآن لمراجعته ونشره',
  alternates: { languages: { ar: '/ar/send-news', en: '/en/send-news' } },
}

const UI = {
  ar: {
    title: 'أرسل خبراً', subtitle: 'أنت عيننا على الأرض — شاركنا ما يحدث في منطقتك',
    intro: 'هل شهدت حدثاً أو لديك معلومة تستحق التغطية؟ فريق التحرير يراجع كل تقرير يصل قبل النشر، والهوية تُحفظ عند طلبك ذلك.',
  },
  en: {
    title: 'Send a Story', subtitle: 'You are our eyes on the ground',
    intro: 'Witnessed an event or have newsworthy information? Our editors review every submission before publishing.',
  },
}

export default async function SendNewsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params
  const locale = (rawLocale === 'en' ? 'en' : 'ar') as 'ar' | 'en'
  const t = UI[locale]
  const dir = locale === 'en' ? 'ltr' : 'rtl'

  return (
    <div dir={dir} className="min-h-screen bg-[var(--background)]">
      <section className="border-b border-line py-12">
        <div className="container-main">
          <nav aria-label="Breadcrumb" className="mb-8 flex items-center gap-2 text-xs text-[var(--muted)]">
            <Link href={`/${locale}`} className="flex items-center gap-1.5 hover:text-[var(--foreground)]">
              <Home className="h-3.5 w-3.5" />
              {locale === 'en' ? 'Home' : 'الرئيسية'}
            </Link>
            <ChevronLeft className="h-3.5 w-3.5 ltr:rotate-180" />
            <span className="font-medium text-[var(--foreground)]">{t.title}</span>
          </nav>

          <Reveal className="text-center">
            <span className="badge badge-lapis mx-auto mb-5">
              <Send className="h-3.5 w-3.5" />
              {t.title}
            </span>
            <h1 className="font-kufi text-3xl font-bold tracking-tight lg:text-4xl">{t.title}</h1>
            <p className="mx-auto mt-3 max-w-xl text-[15px] text-[var(--muted)]">{t.subtitle}</p>
            <p className="mx-auto mt-2 max-w-xl text-sm text-[var(--muted)] opacity-80">{t.intro}</p>
          </Reveal>
        </div>
      </section>

      <section className="container-main max-w-2xl py-10">
        <Reveal delay={100}>
          <SendNewsForm />
        </Reveal>
      </section>
    </div>
  )
}
