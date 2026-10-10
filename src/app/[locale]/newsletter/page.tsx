import { Metadata } from 'next'
import Link from 'next/link'
import { Home, ChevronLeft, Mail, Clock, Languages, ShieldCheck, Zap, Gift, CheckCircle2 } from 'lucide-react'
import { Reveal, CountUp } from '@/components/ui/Reveal'
import { IshtarStar, CuneiformDivider } from '@/components/brand/Brand'
import { NewsletterForm } from '@/components/home/NewsletterForm'

export const metadata: Metadata = {
  title: 'النشرة البريدية — صوت الرافدين',
  description: 'اشترك في نشرة العراق الآن البريدية — موجز يومي مدته 5 دقائق بأهم أخبار العراق، بثلاث لغات، مجاناً',
  alternates: { languages: { ar: '/ar/newsletter', ku: '/ku/newsletter', en: '/en/newsletter' } },
}

const UI: Record<string, any> = {
  ar: {
    badge: 'النشرة البريدية', title: 'صوت الرافدين',
    subtitle: 'أهم الأخبار والتحليلات في بريدك كل صباح — موجز مدته 5 دقائق يلخص ما يحتاج العراقي معرفته',
    benefits: 'لماذا تشترك؟',
    benefitsList: [
      { icon: Clock, title: '5 دقائق يومياً', desc: 'موجز مركز بدون حشو — تقرأه مع قهوة الصباح' },
      { icon: Languages, title: 'ثلاث لغات', desc: 'النشرة متاحة بالعربية والكردية والإنكليزية' },
      { icon: Zap, title: 'عاجل أولاً', desc: 'الأخبار العاجلة تصلك فوراً قبل أي مصدر آخر' },
      { icon: ShieldCheck, title: 'بدون إزعاج', desc: 'لا رسائل مزعجة، إلغاء الاشتراك بنقرة واحدة' },
    ],
    stats: { subs: 'مشترك', open: 'معدل الفتح', rating: 'تقييم القراء' },
    sample: 'نموذج من العدد الأخير', sampleTitle: 'موجز الصباح — الثلاثاء', sampleItems: [
      'الموازنة الاتحادية 2026 تصل البرلمان للتصويت النهائي',
      'البنك المركزي يخفض سعر الفائدة بنسبة 0.5%',
      'افتتاح المرحلة الثانية من مترو بغداد الأسبوع القادم',
      'المنتخب العراقي يستعد لودية دولية أمام مصر',
    ],
    faq: 'أسئلة شائعة',
    faqItems: [
      { q: 'هل الاشتراك مجاني؟', a: 'نعم، النشرة مجانية تماماً للأبد. تمويلها من إعلانات محدودة داخل النشرة نفسها.' },
      { q: 'كم رسالة ستصلك؟', a: 'رسالة واحدة يومياً الساعة 7 صباحاً، مع رسالة إضافية نادرة عند الأخبار العاجلة الكبرى فقط.' },
      { q: 'هل يمكنني إلغاء الاشتراك؟', a: 'بالتأكيد، زر إلغاء الاشتراك موجود في نهاية كل رسالة ويعمل بنقرة واحدة بدون أسئلة.' },
      { q: 'هل بريدي آمن؟', a: 'نحن لا نشارك بريدك مع أي طرف ثالث أبداً، وتستطيع حذف بياناتك نهائياً بطلب واحد.' },
    ],
    home: 'الرئيسية',
  },
  ku: {
    badge: 'نامەی هەواڵ', title: 'دەنگی دوو ڕووبار',
    subtitle: 'گرنگترین هەواڵ و شیکاری لە ئیمەیڵت هەموو بەیانی',
    benefits: 'بۆچی بچۆڵە؟',
    benefitsList: [
      { icon: Clock, title: '٥ خولەک ڕۆژانە', desc: 'کورتەیەکی چڕ بێ پڕکردنەوە' },
      { icon: Languages, title: 'سێ زمان', desc: 'بە عەرەبی و کوردی و ئینگلیزی' },
      { icon: Zap, title: 'بەپەلە یەکەم', desc: 'هەواڵی بەپەلە دەگات پێش هەمووان' },
      { icon: ShieldCheck, title: 'بێ ئازار', desc: 'هەڵوەشاندنەوە بە یەک کرتە' },
    ],
    stats: { subs: 'بەشداربوو', open: 'ڕێژەی کردنەوە', rating: 'هەڵسەنگاندنی خوێنەران' },
    sample: 'نموونەی دوایین ژمارە', sampleTitle: 'کورتەی بەیانی — سێشەممە', sampleItems: [
      'بودجەی فیدراڵی ٢٠٢٦ گەیشتە پەرلەمان',
      'بانکی ناوەندی سوودی بەرزکردەوە',
      'کردنەوەی قۆناغی دووەمی مێترۆی بەغدا',
      'هەڵبژاردەی عێراق ئامادەکاری دەکات',
    ],
    faq: 'پرسیارە باوەکان',
    faqItems: [
      { q: 'ئایا بەخۆڕاییە؟', a: 'بەڵێ، بۆ هەمیشە بەخۆڕاییە.' },
      { q: 'چەند نامە دەگات؟', a: 'یەک نامە ڕۆژانە لە کاتژمێر ٧ی بەیانی.' },
      { q: 'دەتوانم هەڵوەشێنمەوە؟', a: 'بەڵێ، بە یەک کرتە.' },
      { q: 'ئیمەیڵم پارێزراوە؟', a: 'هەرگیز لەگەڵ کەس هاوبەش ناکەین.' },
    ],
    home: 'سەرەکی',
  },
  en: {
    badge: 'Newsletter', title: 'Voice of Mesopotamia',
    subtitle: 'The most important news and analysis in your inbox every morning',
    benefits: 'Why Subscribe?',
    benefitsList: [
      { icon: Clock, title: '5 Minutes Daily', desc: 'A focused brief — read it with your morning coffee' },
      { icon: Languages, title: 'Three Languages', desc: 'Available in Arabic, Kurdish and English' },
      { icon: Zap, title: 'Breaking First', desc: 'Breaking news reaches you before anyone else' },
      { icon: ShieldCheck, title: 'No Spam', desc: 'Unsubscribe with one click, anytime' },
    ],
    stats: { subs: 'subscribers', open: 'open rate', rating: 'reader rating' },
    sample: 'Sample from the latest issue', sampleTitle: 'Morning Brief — Tuesday', sampleItems: [
      'Federal Budget 2026 reaches Parliament for final vote',
      'Central Bank cuts interest rate by 0.5%',
      'Baghdad Metro Phase 2 opens next week',
      'Iraqi national team prepares for friendly vs Egypt',
    ],
    faq: 'FAQ',
    faqItems: [
      { q: 'Is it free?', a: 'Yes, completely free forever.' },
      { q: 'How many emails?', a: 'One daily email at 7 AM, plus rare breaking alerts.' },
      { q: 'Can I unsubscribe?', a: 'Yes, one click at the bottom of every email.' },
      { q: 'Is my email safe?', a: 'We never share your email with third parties.' },
    ],
    home: 'Home',
  },
}

export default async function NewsletterPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params
  const locale = (['ar', 'ku', 'en'].includes(rawLocale) ? rawLocale : 'ar') as 'ar' | 'ku' | 'en'
  const t = UI[locale]
  const dir = locale === 'en' ? 'ltr' : 'rtl'

  return (
    <div dir={dir} className="min-h-screen bg-[var(--background)]">
      {/* الرأس */}
      <section className="relative overflow-hidden bg-gradient-to-br from-lapis-800 via-lapis-950 to-ink-950 py-16 text-white lg:py-24">
        <div className="pointer-events-none absolute inset-0 ishtar-grid opacity-30" aria-hidden="true" />
        <div
          className="pointer-events-none absolute -bottom-24 start-1/2 h-80 w-[600px] -translate-x-1/2 rounded-full opacity-15 blur-3xl"
          style={{ background: 'radial-gradient(circle, #d4af37 0%, transparent 70%)' }}
          aria-hidden="true"
        />

        <div className="container-main relative">
          <nav aria-label="Breadcrumb" className="mb-8 flex items-center gap-2 text-xs text-sand-100/50">
            <Link href={`/${locale}`} className="flex items-center gap-1.5 transition-colors hover:text-gold-400">
              <Home className="h-3.5 w-3.5" />
              {t.home}
            </Link>
            <ChevronLeft className="h-3.5 w-3.5 ltr:rotate-180" />
            <span className="font-medium text-gold-400">{t.badge}</span>
          </nav>

          <Reveal className="mx-auto max-w-3xl text-center">
            <span className="badge mx-auto mb-5 border border-gold-500/30 bg-gold-500/10 text-gold-400">
              <Mail className="h-3.5 w-3.5" />
              {t.badge}
            </span>
            <h1 className="font-kufi text-3xl font-bold leading-snug lg:text-5xl">
              <span className="text-gold-gradient">{t.title}</span>
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-sm text-sand-100/65 lg:text-base">{t.subtitle}</p>
          </Reveal>

          <Reveal delay={120}>
            <div className="mx-auto mt-10 max-w-xl">
              <NewsletterForm locale={locale} />
            </div>
          </Reveal>

          <Reveal delay={200}>
            <div className="mx-auto mt-10 grid max-w-2xl grid-cols-3 gap-4">
              {[
                { value: 48000, suffix: '+', label: t.stats.subs },
                { value: 42, suffix: '%', label: t.stats.open },
                { value: 4.8, suffix: '/5', label: t.stats.rating, decimal: true },
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <p className="font-kufi text-2xl font-bold text-gold-gradient sm:text-3xl">
                    <CountUp end={stat.value} suffix={stat.suffix} />
                  </p>
                  <p className="mt-1 text-[11px] text-sand-100/50">{stat.label}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <div className="container-main py-12 lg:py-16">
        {/* الفوائد */}
        <Reveal>
          <h2 className="section-title mb-8 font-kufi text-xl font-bold lg:text-2xl">{t.benefits}</h2>
        </Reveal>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {t.benefitsList.map((b: any, i: number) => (
            <Reveal key={i} delay={i * 70}>
              <div className="group h-full rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] p-5 transition-all duration-300 hover:-translate-y-1.5 hover:border-gold-500/40">
                <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-gold-500/12 text-gold-600 transition-transform duration-300 group-hover:scale-110">
                  <b.icon className="h-5 w-5" />
                </span>
                <h3 className="font-kufi text-sm font-bold text-[var(--foreground)]">{b.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-[var(--muted)]">{b.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <CuneiformDivider variant="star" className="my-12 opacity-40" />

        {/* نموذج العدد */}
        <Reveal>
          <div className="mx-auto max-w-2xl">
            <h2 className="mb-6 text-center font-kufi text-xl font-bold text-[var(--foreground)]">{t.sample}</h2>
            <div className="overflow-hidden rounded-3xl border border-gold-500/25 bg-[var(--card-bg)] shadow-2xl shadow-lapis-900/10">
              <div className="flex items-center justify-between bg-gradient-to-l from-lapis-900 to-lapis-950 px-6 py-4 text-white">
                <div className="flex items-center gap-2.5">
                  <IshtarStar size={22} />
                  <div>
                    <p className="font-kufi text-sm font-bold">{t.sampleTitle}</p>
                    <p className="text-[10px] text-sand-100/50">{locale === 'en' ? 'Iraq Now Daily · 7:00 AM' : 'العراق الآن اليومي · 7:00 صباحاً'}</p>
                  </div>
                </div>
                <Mail className="h-5 w-5 text-gold-400" />
              </div>
              <ul className="divide-y divide-[var(--border)] p-2">
                {t.sampleItems.map((item: string, i: number) => (
                  <li key={i} className="flex items-start gap-3 px-4 py-3.5">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-gold-500" />
                    <span className="text-sm leading-relaxed text-[var(--foreground)]">{item}</span>
                  </li>
                ))}
              </ul>
              <div className="border-t border-dashed border-[var(--border)] bg-gold-500/[0.04] px-6 py-3 text-center">
                <p className="text-[11px] text-[var(--muted)]">
                  {locale === 'en' ? 'Read the full stories on iraqnow.iq' : 'اقرأ الأخبار كاملة على iraqnow.iq'}
                </p>
              </div>
            </div>
          </div>
        </Reveal>

        <CuneiformDivider variant="star" className="my-12 opacity-40" />

        {/* الأسئلة الشائعة */}
        <Reveal>
          <h2 className="mb-8 text-center font-kufi text-xl font-bold text-[var(--foreground)]">{t.faq}</h2>
          <div className="mx-auto max-w-2xl space-y-3">
            {t.faqItems.map((item: any, i: number) => (
              <details key={i} className="group rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] p-5 transition-colors open:border-gold-500/40">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold text-[var(--foreground)]">
                  {item.q}
                  <Gift className="h-4 w-4 shrink-0 text-gold-500 transition-transform group-open:rotate-45" />
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">{item.a}</p>
              </details>
            ))}
          </div>
        </Reveal>
      </div>
    </div>
  )
}
