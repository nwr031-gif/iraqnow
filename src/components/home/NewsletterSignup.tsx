'use client'

import { useState } from 'react'
import { Mail, Check, Loader2, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface NewsletterSignupProps {
  locale: 'ar' | 'ku' | 'en'
}

const texts = {
  ar: {
    title: 'اشترك في نشرتنا البريدية',
    desc: 'احصل على أهم الأخبار والتحليلات مباشرة في بريدك الإلكتروني، صباح كل يوم.',
    placeholder: 'بريدك الإلكتروني',
    button: 'اشترك الآن',
    success: 'تم الاشتراك بنجاح! شكراً لك.',
    error: 'حدث خطأ، يرجى المحاولة مرة أخرى.',
    loading: 'جاري الاشتراك...',
    privacy: 'باشتراكك، أنت توافق على سياسة الخصوصية وشروط الاستخدام.',
  },
  ku: {
    title: 'بچۆڵە بە نیوزلێتەرەکەمان',
    desc: 'گرنگترین هەواڵ و таحلیلەکان ڕاستەوخۆ لە ئیمەیڵت دەربکەوێت، ھەموو بەیانی.',
    placeholder: 'ئیمەیڵکەت',
    button: 'بچۆڵە',
    success: 'بە سەرکەوتوویی بچوول! سوپاس.',
    error: 'ھەڵەیەک ڕوویدا، تکایە دووبارە ھەوڵ بدە.',
    loading: 'چوولەکەوە...',
    privacy: 'بە چوولەکەوە، تۆ رازی پەلیسی تایبەتێتی و مەرجەکانی بەکارهێنان دەبێت.',
  },
  en: {
    title: 'Subscribe to Our Newsletter',
    desc: 'Get the most important news and analysis delivered straight to your inbox every morning.',
    placeholder: 'Your email address',
    button: 'Subscribe Now',
    success: 'Successfully subscribed! Thank you.',
    error: 'An error occurred. Please try again.',
    loading: 'Subscribing...',
    privacy: 'By subscribing, you agree to our Privacy Policy and Terms of Service.',
  },
}

export function NewsletterSignup({ locale }: NewsletterSignupProps) {
  const t = texts[locale]
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

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
    <div className="mx-auto max-w-2xl text-center">
      <div className="mb-6">
        <h2 className="mb-3 text-2xl lg:text-3xl font-bold text-white">{t.title}</h2>
        <p className="text-white/80">{t.desc}</p>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3" aria-label="Newsletter signup">
        <label htmlFor="newsletter-email" className="sr-only">
          {t.placeholder}
        </label>
        <div className="relative flex-1">
          <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/50" aria-hidden="true" />
          <input
            id="newsletter-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t.placeholder}
            className="w-full rounded-lg bg-white/10 border border-white/20 px-10 py-4 text-white placeholder-white/50 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/50 disabled:opacity-50"
            disabled={status === 'loading' || status === 'success'}
            required
            autoComplete="email"
            dir="ltr"
          />
        </div>
        <button
          type="submit"
          disabled={status === 'loading' || status === 'success'}
          className="btn-primary whitespace-nowrap"
        >
          {status === 'loading' ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              {t.loading}
            </>
          ) : status === 'success' ? (
            <>
              <Check className="h-4 w-4" />
              {t.button}
            </>
          ) : (
            t.button
          )}
        </button>
      </form>
      {message && (
        <p className={cn('mt-4 text-sm flex items-center justify-center gap-2', status === 'success' ? 'text-green-400' : 'text-red-400')}>
          {status === 'success' ? <Check className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
          {message}
        </p>
      )}
      <p className="mt-4 text-xs text-white/60">{t.privacy}</p>
    </div>
  )
}