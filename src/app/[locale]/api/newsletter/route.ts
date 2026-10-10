import { NextRequest, NextResponse } from 'next/server'
import { storeAddSubscriber, storeSubscribers } from '@/lib/supabase-store'
import { verifyTurnstile } from '@/lib/turnstile-verify'

type LocaleParam = 'ar' | 'ku' | 'en'

const WELCOME: Record<LocaleParam, { subject: string; html: string }> = {
  ar: {
    subject: 'أهلاً بك في نشرة صوت الرافدين 🇮🇶',
    html: `<div style="font-family:Tahoma,Arial;background:#0f2140;color:#f5f0e6;padding:32px;border-radius:12px;direction:rtl;text-align:center">
      <h1 style="color:#d4af37">أهلاً بك في العراق الآن</h1>
      <p>ستصلك أهم أخبار العراق كل صباح في الساعة 7:00 — موجز مدته 5 دقائق بالعربية والكردية والإنكليزية.</p>
      <a href="https://iraqnow.pages.dev/ar" style="background:#d4af37;color:#0f2140;padding:10px 24px;border-radius:8px;text-decoration:none;font-weight:bold">تصفح الموقع الآن</a>
    </div>`,
  },
  ku: {
    subject: 'بەخێربێی بۆ نامەی هەواڵ 🇮🇶',
    html: '<div style="font-family:Tahoma;color:#f5f0e6;direction:rtl;text-align:center"><h1 style="color:#d4af37">بەخێربێی بۆ عێراق ئێستا</h1><p>هەواڵە گرنگەکان هەموو بەیانییەک لە ٧:٠٠</p></div>',
  },
  en: {
    subject: 'Welcome to Iraq Now Newsletter 🇮🇶',
    html: '<div style="font-family:Arial;color:#f5f0e6;text-align:center"><h1 style="color:#d4af37">Welcome to Iraq Now</h1><p>Iraq\'s most important news every morning at 7:00 AM</p><a href="https://iraqnow.pages.dev/en" style="background:#d4af37;color:#0f2140;padding:10px 24px;border-radius:8px;text-decoration:none;font-weight:bold">Visit Iraq Now</a></div>',
  },
}

async function sendWelcomeEmail(email: string, locale: LocaleParam): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) return false

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: process.env.NEWS_FROM_EMAIL || 'onboarding@resend.dev',
        to: email,
        subject: WELCOME[locale].subject,
        html: WELCOME[locale].html,
      }),
    })
    return res.ok
  } catch {
    return false
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, locale, turnstileToken } = body

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
    }

    const safeLocale: LocaleParam = ['ar', 'ku', 'en'].includes(locale) ? locale : 'ar'

    /* التحقق من Turnstile إن كان مفعّلاً */
    const human = await verifyTurnstile(turnstileToken || '')
    if (!human) {
      return NextResponse.json({ error: 'فشل التحقق — أنت روبوت؟' }, { status: 403 })
    }

    const result = await storeAddSubscriber(email, safeLocale)
    if (!result.ok) {
      return NextResponse.json({ error: result.error || 'Failed to subscribe' }, { status: 500 })
    }

    /* إرسال بريد ترحيبي عبر Resend (إن كان مفعّلاً) — غير معترض به */
    sendWelcomeEmail(email, safeLocale).catch(() => {})

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Newsletter signup error:', error)
    return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 })
  }
}

export async function GET() {
  const subscribers = await storeSubscribers()
  return NextResponse.json({ total: subscribers.length })
}


