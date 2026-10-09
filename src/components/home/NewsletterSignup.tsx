'use client'

import { useState } from 'react'
import { Mail, Check, Loader2, AlertCircle, Send, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import { IshtarStar, CuneiformDivider } from '@/components/brand/Brand'
import { Reveal } from '@/components/ui/Reveal'

type Locale = 'ar' | 'ku' | 'en'

const TEXTS: Record<Locale, any> = {
  ar: {
    badge: 'النشرة البريدية',
    title: 'أهم الأخبار في بريدك، كل صباح',
    desc: 'اشترك في نشرة "صوت الرافدين" — موجز يومي مدته 5 دقائق يلخص لك ما يحتاج العراقي معرفته، بثلاث لغات.',
    placeholder: 'بريدك الإلكتروني',
    button: 'اشترك — مجاناً',
    success: 'تم الاشتراك بنجاح! تفقد بريدك للتأكيد.',
    error: 'حدث خطأ، يرجى المحاولة مرة أخرى.',
    loading: 'جاري الاشتراك...',
    privacy: 'لن نشارك بريدك مع أي جهة. يمكنك إلغاء الاشتراك في أي وقت.',
    subscribers: '+48,000 مشترك',
    daily: 'يومياً 7 صباحاً',
  },
  ku: {
    badge: 'نامەی هەواڵ',
    title: 'گرنگترین هەواڵەکان لە ئیمەیڵت، هەموو بەیانی',
    desc: 'بچۆڵە بە نامەی "دەنگی دوو ڕووبار" — کورتەیەکی ڕۆژانەی ٥ خولەکی بە سێ زمان.',
    placeholder: 'ئیمەیڵەکەت',
    button: 'بچۆڵە — بەخۆڕایی',
    success: 'بە سەرکەوتوویی بچوڵی! ئیمەیڵەکەت بپشکنە.',
    error: 'هەڵەیەک ڕوویدا، تکایە دووبارە هەوڵ بدە.',
    loading: 'چوونەژوورەوە...',
    privacy: 'ئیمەیڵەکەت لەگەڵ هیچ لایەنێک هاوبەش ناکەین.',
    subscribers: '+٤٨,٠٠٠ بەشداربوو',
    daily: 'ڕۆژانە ٧ بەیانی',
  },
  en: {
    badge: 'Newsletter',
    title: 'The news that matters, in your inbox every morning',
    desc: 'Subscribe to "Voice of Mesopotamia" — a 5-minute daily brief covering what Iraqis need to know, in three languages.',
    placeholder: 'Your email address',
    button: 'Subscribe — Free',
    success: 'Successfully subscribed! Check your inbox to confirm.',
    error: 'Something went wrong. Please try again.',
    loading: 'Subscribing...',
    privacy: 'We\'ll never share your email. Unsubscribe anytime.',
    subscribers: '48,000+ subscribers',
    daily: 'Daily at 7 AM',
  },
}

export function NewsletterSignup({ locale }: { locale: Locale }) {
  const t = TEXTS[locale]
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const dir = locale === 'en' ? 'ltr' : 'rtl'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !email.includes('@')) return

    setStatus('loading')
    setMessage('')

    try {
      const response = await fetch(`/${locale}/api/newsletter`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, locale }),
      })

      if (response.ok) {
        setStatus('success')
        setMessage(t.success)
        setEmail('')
      } else {
        throw new Error('Failed')
      }
    } catch {
      setStatus('error')
      setMessage(t.error)
    }
  }

  return (
    <section className="relative overflow-hidden" dir={dir} aria-labelledby="newsletter-heading">
      {/* خلفية لازوردية معمارية */}
      <div className="absolute inset-0 bg-gradient-to-br from-lapis-800 via-lapis-950 to-ink-950" aria-hidden="true" />
      <div className="absolute inset-0 ishtar-grid opacity-30" aria-hidden="true" />
      <div
        className="pointer-events-none absolute -bottom-32 start-1/2 h-80 w-[700px] -translate-x-1/2 rounded-full opacity-15 blur-3xl"
        style={{ background: 'radial-gradient(circle, #d4af37 0%, transparent 70%)' }}
        aria-hidden="true"
      />

      <div className="container-main relative py-16 lg:py-24">
        <Reveal>
          <div className="mx-auto max-w-3xl text-center text-white">
            <span className="badge border border-gold-500/30 bg-gold-500/10 text-gold-400 mb-5">
              <Mail className="h-3.5 w-3.5" />
              {t.badge}
            </span>

            <h2 id="newsletter-heading" className="font-kufi text-3xl font-bold leading-snug text-balance lg:text-4xl">
              {t.title}
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-sand-100/60 lg:text-base">
              {t.desc}
            </p>

            {/* شريط معلومات */}
            <div className="mt-5 flex flex-wrap items-center justify-center gap-4 text-xs text-sand-100/50">
              <span className="flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-gold-500" />
                {t.subscribers}
              </span>
              <span className="h-3 w-px bg-white/15" />
              <span className="flex items-center gap-1.5">
                <Send className="h-3.5 w-3.5 text-gold-500" />
                {t.daily}
              </span>
            </div>

            <CuneiformDivider variant="wedge" className="opacity-50" />

            <form onSubmit={handleSubmit} className="mx-auto mt-2 flex max-w-xl flex-col gap-3 sm:flex-row" aria-label="Newsletter signup">
              <label htmlFor="newsletter-email" className="sr-only">{t.placeholder}</label>
              <div className="relative flex-1">
                <Mail className="absolute start-4 top-1/2 h-5 w-5 -translate-y-1/2 text-sand-100/40" aria-hidden="true" />
                <input
                  id="newsletter-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t.placeholder}
                  className="w-full rounded-2xl border border-white/15 bg-white/[0.07] px-12 py-4 text-white placeholder-sand-100/40 backdrop-blur-sm transition-all duration-300 focus:border-gold-500/60 focus:bg-white/10 focus:outline-none focus:ring-4 focus:ring-gold-500/15 disabled:opacity-50"
                  disabled={status === 'loading' || status === 'success'}
                  required
                  autoComplete="email"
                  dir="ltr"
                />
              </div>
              <button
                type="submit"
                disabled={status === 'loading' || status === 'success'}
                className="btn-primary !rounded-2xl font-kufi whitespace-nowrap"
              >
                {status === 'loading' ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {t.loading}
                  </>
                ) : status === 'success' ? (
                  <>
                    <Check className="h-4 w-4" />
                    {locale === 'en' ? 'Done' : 'تم'}
                  </>
                ) : (
                  t.button
                )}
              </button>
            </form>

            {message && (
              <p className={cn(
                'mt-4 flex items-center justify-center gap-2 text-sm',
                status === 'success' ? 'text-green-400' : 'text-red-400'
              )}>
                {status === 'success' ? <Check className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                {message}
              </p>
            )}

            <p className="mt-4 text-[11px] text-sand-100/40">{t.privacy}</p>
          </div>
        </Reveal>
      </div>

      <div className="relative h-8 overflow-hidden" aria-hidden="true">
        <div className="absolute inset-x-0 top-0 flex justify-center opacity-40">
          <IshtarStar size={28} />
        </div>
      </div>
    </section>
  )
}
