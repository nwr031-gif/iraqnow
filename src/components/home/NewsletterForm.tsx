'use client'

import { useState } from 'react'
import { Mail, Check, Loader2, AlertCircle, Send } from 'lucide-react'
import { cn } from '@/lib/utils'

type Locale = 'ar' | 'ku' | 'en'

const TEXTS: Record<Locale, any> = {
  ar: {
    placeholder: 'بريدك الإلكتروني', button: 'اشترك — مجاناً', loading: 'جاري الاشتراك...',
    success: 'تم الاشتراك بنجاح! تفقد بريدك للتأكيد ✨', error: 'حدث خطأ، يرجى المحاولة مرة أخرى.',
    privacy: 'لن نشارك بريدك مع أي جهة. يمكنك إلغاء الاشتراك في أي وقت.',
  },
  ku: {
    placeholder: 'ئیمەیڵەکەت', button: 'بچۆڵە — بەخۆڕایی', loading: 'چاوەڕێ بکە...',
    success: 'بە سەرکەوتوویی بچوڵی!', error: 'هەڵەیەک ڕوویدا.',
    privacy: 'ئیمەیڵەکەت لەگەڵ هیچ لایەنێک هاوبەش ناکەین.',
  },
  en: {
    placeholder: 'Your email address', button: 'Subscribe — Free', loading: 'Subscribing...',
    success: 'Successfully subscribed! Check your inbox ✨', error: 'Something went wrong. Please try again.',
    privacy: 'We\'ll never share your email. Unsubscribe anytime.',
  },
}

export function NewsletterForm({ locale }: { locale: Locale }) {
  const t = TEXTS[locale]
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !email.includes('@')) return

    setStatus('loading')
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
        throw new Error()
      }
    } catch {
      setStatus('error')
      setMessage(t.error)
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row" aria-label="Newsletter signup">
        <label htmlFor="newsletter-page-email" className="sr-only">{t.placeholder}</label>
        <div className="relative flex-1">
          <Mail className="absolute start-4 top-1/2 h-5 w-5 -translate-y-1/2 text-sand-100/40" aria-hidden="true" />
          <input
            id="newsletter-page-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t.placeholder}
            className="w-full rounded-2xl border border-white/15 bg-white/[0.07] px-12 py-4 text-white placeholder-sand-100/40 backdrop-blur-sm transition-all focus:border-gold-500/60 focus:bg-white/10 focus:outline-none focus:ring-4 focus:ring-gold-500/15 disabled:opacity-50"
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
            <><Loader2 className="h-4 w-4 animate-spin" />{t.loading}</>
          ) : status === 'success' ? (
            <><Check className="h-4 w-4" />{locale === 'en' ? 'Done' : 'تم'}</>
          ) : (
            <><Send className="h-4 w-4" />{t.button}</>
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
      <p className="mt-4 text-center text-[11px] text-sand-100/40">{t.privacy}</p>
    </div>
  )
}
