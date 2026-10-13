'use client'

import { useState } from 'react'
import { Mail, Loader2, CheckCircle2, Send } from 'lucide-react'
import { Reveal } from '@/components/ui/Reveal'

type Locale = 'ar' | 'ku' | 'en'

const T = {
  ar: {
    eyebrow: 'النشرة البريدية', title: 'أهم الأخبار تصلك أولاً',
    subtitle: 'ملخص أسبوعي موجز بأهم أخبار العراق والشرق الأوسط — بلا إزعاج، ويمكنك إلغاء الاشتراك بضغطة.',
    placeholder: 'بريدك الإلكتروني', subscribe: 'اشترك',
    privacy: 'بالاشتراك أنت توافق على سياسة الخصوصية. لا نشارك بريدك مع أي طرف ثالث.',
    success: 'تم الاشتراك بنجاح — أهلاً بك في نشرة العراق الآن',
    invalid: 'يرجى إدخال بريد إلكتروني صحيح',
  },
  en: {
    eyebrow: 'Newsletter', title: 'Top stories, first to you',
    subtitle: 'A concise weekly digest of Iraq and Middle East news — no spam, unsubscribe anytime.',
    placeholder: 'Your email address', subscribe: 'Subscribe',
    privacy: 'By subscribing you agree to our privacy policy. We never share your email.',
    success: 'Subscribed successfully — welcome to the Iraq Now newsletter',
    invalid: 'Please enter a valid email address',
  },
}

export function NewsletterSignup({ locale }: { locale: 'ar' | 'ku' | 'en' }) {
  const t = (T as Record<string, typeof T.ar>)[locale] || T.ar
  const dir = locale === 'en' ? 'ltr' : 'rtl'
  const [email, setEmail] = useState('')
  const [state, setState] = useState<'idle' | 'loading' | 'done'>('idle')
  const [error, setError] = useState('')

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (state === 'loading') return
    setError('')

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) {
      setError(t.invalid)
      return
    }

    setState('loading')
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      })
      const data = await res.json().catch(() => ({}))
      if (res.ok && data.ok) {
        setState('done')
        return
      }
      setError(data.error || 'تعذر الاشتراك — حاول مجدداً')
    } catch {
      setError('تعذر الاتصال — حاول مجدداً')
    }
    setState('idle')
  }

  return (
    <section className="border-y border-line bg-cream py-16 lg:py-20" dir={dir} aria-labelledby="newsletter-heading">
      <div className="container-main">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow mb-3">
              <Mail className="h-3.5 w-3.5" />
              {t.eyebrow}
            </p>
            <h2 id="newsletter-heading" className="section-title text-3xl lg:text-4xl">{t.title}</h2>
            <p className="mx-auto mt-3 max-w-lg text-[15px] text-[var(--muted)]">{t.subtitle}</p>
          </div>
        </Reveal>

        <Reveal delay={120}>
          {state === 'done' ? (
            <div className="mx-auto mt-8 flex max-w-md items-center justify-center gap-3 rounded-2xl border border-line bg-[var(--card-bg)] px-6 py-5" role="status">
              <CheckCircle2 className="h-6 w-6 shrink-0 text-emerald-600" />
              <p className="text-sm font-semibold text-[var(--foreground)]">{t.success}</p>
            </div>
          ) : (
            <form onSubmit={submit} className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row" noValidate>
              <div className="relative flex-1">
                <Mail className="absolute start-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t.placeholder}
                  aria-label={t.placeholder}
                  maxLength={120}
                  className="w-full rounded-full border border-line bg-[var(--card-bg)] py-3.5 pe-4 ps-11 text-sm text-[var(--foreground)] placeholder:text-[var(--muted)] focus:border-gold-500 focus:outline-none"
                />
              </div>
              <button
                type="submit"
                disabled={state === 'loading'}
                className="btn-primary inline-flex items-center justify-center gap-2 font-kufi"
              >
                {state === 'loading' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                {t.subscribe}
              </button>
            </form>
          )}
        </Reveal>

        {error && (
          <p className="mx-auto mt-4 max-w-md rounded-xl bg-cream-deep px-4 py-2.5 text-center text-xs font-semibold text-[var(--foreground)]" role="alert">
            {error}
          </p>
        )}

        <p className="mt-6 text-center text-[11px] text-[var(--muted)]">{t.privacy}</p>
      </div>
    </section>
  )
}
